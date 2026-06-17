"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Flex,
  Text,
  Heading,
  Button,
  Image,
  IconButton,
  Spinner,
  useToast,
  useColorModeValue,
  VStack,
  Badge,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { MdCopyAll, MdCheckCircle, MdArrowBack } from "react-icons/md";

interface ContainerPagamentoDiretoProps {
  tokenJWT: string;
}

export default function ContainerPagamentoDireto({
  tokenJWT,
}: ContainerPagamentoDiretoProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const token = searchParams.get("token");
  const nome = searchParams.get("nome");
  const cpf = searchParams.get("cpf");
  const idSolicitacao = searchParams.get("idSolicitacao");

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("#E8E8E8", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const cardBg = useColorModeValue("gray.50", "gray.900");
  const cardPixBg = useColorModeValue("gray.100", "gray.700");

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "PENDENTE" | "CONCLUIDA" | "ERRO"
  >("PENDENTE");
  const [pixData, setPixData] = useState<{
    pixCopiaECola: string;
    imagemQrcode: string;
    txid: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [valorCert, setValorCert] = useState<string>("0.00");

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const checarStatusPagamento = useCallback(
    async (txid: string) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pix/verifique/${txid}`
        );
        const result = await res.json();

        if (res.ok && result.status === "CONCLUIDA") {
          setPaymentStatus("CONCLUIDA");
          toast({
            title: "Pagamento confirmado com sucesso!",
            status: "success",
            duration: 5000,
          });
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      } catch (err) {
        console.error("Erro no polling do PIX:", err);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!token && !idSolicitacao) {
      toast({ title: "Dados de checkout inválidos.", status: "error" });
      router.push("/direto");
      return;
    }

    const iniciarFluxoPagamento = async () => {
      try {
        let valorFinal = "0.00";
        let targetId = idSolicitacao;
        const tokenJWTLocalStorage = tokenJWT;
        if (!targetId && cpf) {
          const checkCpfRes = await fetch(
            `${
              process.env.NEXT_PUBLIC_STRAPI_API_URL
            }/direto/check/pagamento/cpf/${cpf.replace(/\D/g, "")}`
          );
          const checkCpfData = await checkCpfRes.json();
          if (checkCpfRes.ok && checkCpfData?.id) {
            targetId = checkCpfData.id;
          }
        }

        // CASO 1: A proposta já existe no banco de dados (Vem pelo clique na listagem ou recuperada via CPF)
        if (targetId) {
          const solRes = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto/${targetId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenJWTLocalStorage}`,
              },
            }
          );

          if (solRes.ok) {
            const solData = await solRes.json();
            valorFinal = Number(solData.valorcd || 0).toFixed(2);

            // Se o registro já possui um PIX Efí associado, restaura e ativa o polling imediatamente
            if (solData.pixCopiaECola && solData.imagemQrcode && solData.txid) {
              setPixData({
                pixCopiaECola: solData.pixCopiaECola,
                imagemQrcode: solData.imagemQrcode,
                txid: solData.txid,
              });
              setValorCert(valorFinal);

              // Verifica se o banco já acusa como pago para atualizar o layout na hora
              if (
                solData.pg_andamento?.toUpperCase() === "PAGO" ||
                solData.pg_status
              ) {
                setPaymentStatus("CONCLUIDA");
              } else {
                setPaymentStatus("PENDENTE");
              }

              setLoading(false);

              pollingRef.current = setInterval(() => {
                checarStatusPagamento(solData.txid);
              }, 5000);
              return; // Aborta gerações duplicadas
            }
          }
        }

        // CASO 2: Nova solicitação direta estrutural via Token CNAB pura
        if (token && !token.startsWith("CD")) {
          const infoRes = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto/getInfosToken/${token}`
          );
          const infoData = await infoRes.json();
          if (!infoRes.ok)
            throw new Error("Erro ao descriptografar token de venda.");

          valorFinal = Number(infoData.data.valor_cert).toFixed(2);
        } else if (!targetId) {
          throw new Error("Parâmetros estruturais de checkout malformados.");
        }

        setValorCert(valorFinal);

        // Gera nova ordem no Banco Central caso o cliente realmente não possua cobranças ativas
        const pixRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pix`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cpf, nome, valor: valorFinal }),
          }
        );

        const pixResult = await pixRes.json();
        if (!pixRes.ok)
          throw new Error("Falha ao emitir PIX no Banco Central.");

        if (targetId) {
          await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto/update/${targetId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenJWTLocalStorage}`,
              },
              body: JSON.stringify({
                txid: pixResult.txid,
                pixCopiaECola: pixResult.pixCopiaECola,
                imagemQrcode: pixResult.imagemQrcode,
                pg_andamento: "PENDENTE",
              }),
            }
          );
        }

        setPixData(pixResult);
        setPaymentStatus("PENDENTE");
        setLoading(false);

        pollingRef.current = setInterval(() => {
          checarStatusPagamento(pixResult.txid);
        }, 5000);
      } catch (error: any) {
        toast({
          title: "Erro no processamento",
          description: error.message,
          status: "error",
        });
        setPaymentStatus("ERRO");
        setLoading(false);
      }
    };

    iniciarFluxoPagamento();

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [
    token,
    idSolicitacao,
    cpf,
    nome,
    router,
    toast,
    checarStatusPagamento,
    tokenJWT,
  ]);

  const handleCopy = () => {
    if (pixData?.pixCopiaECola) {
      navigator.clipboard.writeText(pixData.pixCopiaECola);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Flex
        h="80vh"
        w="full"
        align="center"
        justify="center"
        direction="column"
        gap={4}
      >
        <Spinner size="xl" color="#00713D" thickness="4px" />
        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
          Gerando cobrança PIX e preparando checkout...
        </Text>
      </Flex>
    );
  }

  return (
    <Container maxW="2xl" py={8}>
      <Button
        leftIcon={<MdArrowBack />}
        variant="ghost"
        mb={4}
        onClick={() => router.push("/direto")}
      >
        Voltar para Vendas Diretas
      </Button>

      <Box
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        rounded="xl"
        shadow="2xl"
        p={6}
      >
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading size="md" color="#023147" _dark={{ color: "white" }}>
              Checkout de Pagamento
            </Heading>
            <Badge
              colorScheme={
                paymentStatus === "CONCLUIDA"
                  ? "green"
                  : paymentStatus === "PENDENTE"
                  ? "orange"
                  : "red"
              }
              px={3}
              py={1}
              borderRadius="full"
            >
              {paymentStatus === "CONCLUIDA"
                ? "PAGO"
                : paymentStatus === "PENDENTE"
                ? "AGUARDANDO PAGAMENTO"
                : "ERRO"}
            </Badge>
          </Flex>

          <Divider borderColor={borderColor} />

          <Box
            bg={cardBg}
            p={4}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
          >
            <Text fontSize="sm">
              <strong>Cliente:</strong> {nome}
            </Text>
            <Text fontSize="sm">
              <strong>CPF:</strong>{" "}
              {cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
            </Text>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="#00713D"
              _dark={{ color: "#00d672" }}
              mt={2}
            >
              Valor da Emissão: R$ {valorCert.replace(".", ",")}
            </Text>
          </Box>

          {paymentStatus === "PENDENTE" && pixData && (
            <Flex direction="column" align="center" gap={5} py={2}>
              <Text fontSize="sm" textAlign="center" color="gray.500">
                Escaneie o QR Code abaixo pelo aplicativo do seu banco ou
                utilize a chave copia e cola:
              </Text>

              {pixData.imagemQrcode && (
                <Box
                  p={3}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  shadow="md"
                >
                  <Image
                    src={pixData.imagemQrcode}
                    alt="QR Code"
                    boxSize="220px"
                  />
                </Box>
              )}

              <Flex
                align="center"
                gap={2}
                w="full"
                bg={cardPixBg}
                p={3}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                position="relative"
              >
                <Text
                  fontSize="xs"
                  fontFamily="monospace"
                  wordBreak="break-all"
                  pr={12}
                >
                  {pixData.pixCopiaECola}
                </Text>
                <IconButton
                  aria-label="Copiar código PIX"
                  icon={
                    copied ? (
                      <MdCheckCircle color="#00713D" size={20} />
                    ) : (
                      <MdCopyAll size={20} />
                    )
                  }
                  size="sm"
                  variant="ghost"
                  position="absolute"
                  right={2}
                  onClick={handleCopy}
                />
              </Flex>

              <Flex
                gap={2}
                align="center"
                color="gray.500"
                fontSize="sm"
                mt={2}
              >
                <Spinner size="xs" color="gray.500" />
                <Text>Aguardando a detecção do pagamento em tempo real...</Text>
              </Flex>
            </Flex>
          )}

          {paymentStatus === "CONCLUIDA" && (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={8}
              gap={3}
            >
              <Icon as={MdCheckCircle} boxSize="70px" color="green.500" />
              <Heading size="md" color="green.500">
                Pagamento Confirmado!
              </Heading>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                A solicitação direta foi liberada no sistema. O certificado está
                pronto para seguir com as etapas de agendamento e emissão.
              </Text>
              <Button
                colorScheme="blue"
                w="full"
                mt={4}
                onClick={() => router.push("/direto")}
              >
                Ir para a Listagem de Vendas
              </Button>
            </Flex>
          )}
        </VStack>
      </Box>
    </Container>
  );
}
