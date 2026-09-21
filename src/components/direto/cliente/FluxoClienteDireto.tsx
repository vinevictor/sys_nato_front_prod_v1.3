"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdCheckCircle, MdCopyAll } from "react-icons/md";

/** Número do atendimento exibido na confirmação. Ajustar com o número oficial. */
const TELEFONE_ATENDIMENTO = "(16) XXXXX-0713";
const INTERVALO_STATUS_MS = 5000;
const API = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const VERDE = "#00713D";

type Etapa =
  | "carregando"
  | "invalido"
  | "apresentacao"
  | "explicacao"
  | "cpf"
  | "confirmacao"
  | "pagamento"
  | "pago";

interface DadosCliente {
  nome: string;
  cpf: string;
  telefone: string | null;
}

interface Cobranca {
  pixCopiaECola: string;
  imagemQrcode: string;
  valor: number;
  expiraEm: string | null;
}

async function chamar<T>(
  caminho: string,
  body?: Record<string, string>,
): Promise<{ ok: boolean; status: number; data: T & { message?: string } }> {
  const res = await fetch(`${API}/direto/cliente/${caminho}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

const formatarCpf = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const formatarTelefone = (v: string | null) => {
  const d = (v ?? "").replace(/\D/g, "");
  if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  return v ?? "-";
};

function PaginaBoasVindas({
  passo,
  texto,
  onIr,
}: {
  passo: 1 | 2;
  texto: string;
  onIr: (e: Etapa) => void;
}) {
  const etapas: Etapa[] = ["apresentacao", "explicacao", "cpf"];
  return (
    <VStack spacing={8} align="stretch">
      <Heading
        size="lg"
        color="green.900"
        textAlign="center"
        lineHeight="short"
      >
        {texto}
      </Heading>
      <VStack spacing={3} align="center">
        <Flex gap={3}>
          {etapas.map((e, i) => (
            <Box
              key={e}
              as="button"
              w={{ base: "48px", md: "80px" }}
              h="8px"
              rounded="md"
              bg={i + 1 === passo ? "green.700" : "gray.300"}
              onClick={() => onIr(e)}
              aria-label={`Ir para a etapa ${i + 1}`}
            />
          ))}
        </Flex>
        <Text color="green.700" fontWeight="bold">
          {passo}/3
        </Text>
        <Button
          bg="green.900"
          color="white"
          rounded="full"
          px={8}
          _hover={{ bg: "green.500" }}
          onClick={() => onIr(etapas[passo])}
        >
          PRÓXIMO &gt;
        </Button>
      </VStack>
    </VStack>
  );
}

export default function FluxoClienteDireto({ token }: { token: string }) {
  const [etapa, setEtapa] = useState<Etapa>("carregando");
  const [aceitouLgpd, setAceitouLgpd] = useState(false);
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [dados, setDados] = useState<DadosCliente | null>(null);
  const [cobranca, setCobranca] = useState<Cobranca | null>(null);
  const [copiado, setCopiado] = useState(false);
  const cobrancaRef = useRef<Cobranca | null>(null);
  cobrancaRef.current = cobranca;

  useEffect(() => {
    chamar(`${token}/inicio`)
      .then((r) => setEtapa(r.ok ? "apresentacao" : "invalido"))
      .catch(() => setEtapa("invalido"));
  }, [token]);

  const validarCpf = async () => {
    setErro("");
    setEnviando(true);
    try {
      const r = await chamar<{ pago: boolean; dados: DadosCliente }>(
        `${token}/validar-cpf`,
        { cpf },
      );
      if (!r.ok) {
        setErro(r.data.message || "Não foi possível validar o CPF.");
        return;
      }
      setDados(r.data.dados);
      setEtapa(r.data.pago ? "pago" : "confirmacao");
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  const carregarCobranca = useCallback(async () => {
    const r = await chamar<{ pago: boolean } & Partial<Cobranca>>(
      `${token}/cobranca`,
      { cpf },
    );
    if (!r.ok) {
      setErro(r.data.message || "Não foi possível gerar a cobrança.");
      return false;
    }
    if (r.data.pago) {
      setEtapa("pago");
      return true;
    }
    setCobranca(r.data as Cobranca);
    return true;
  }, [token, cpf]);

  const irParaPagamento = async () => {
    setErro("");
    setEnviando(true);
    try {
      if (await carregarCobranca())
        setEtapa((e) => (e === "pago" ? e : "pagamento"));
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  // Aguarda a confirmação do pagamento; se a cobrança expirar, busca uma nova.
  useEffect(() => {
    if (etapa !== "pagamento") return;
    const id = setInterval(async () => {
      try {
        const expiraEm = cobrancaRef.current?.expiraEm;
        if (expiraEm && new Date(expiraEm) < new Date()) {
          await carregarCobranca();
          return;
        }
        const r = await chamar<{ pago: boolean }>(`${token}/status`, { cpf });
        if (r.ok && r.data.pago) setEtapa("pago");
      } catch {
        /* tenta de novo no próximo ciclo */
      }
    }, INTERVALO_STATUS_MS);
    return () => clearInterval(id);
  }, [etapa, token, cpf, carregarCobranca]);

  const copiar = () => {
    if (!cobranca) return;
    navigator.clipboard.writeText(cobranca.pixCopiaECola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <Flex
      minH="100vh"
      bg="white"
      color="gray.800"
      py={8}
      fontFamily="'Sofia Sans', sans-serif"
    >
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Sofia+Sans:wght@300;400;700&display=swap"
        rel="stylesheet"
      />
      <Container maxW="xl">
        <VStack spacing={6} align="stretch">
          <Flex justify="center">
            <Image src="/sisnatologo_dark.png" alt="Logo Sisnato" w="160px" />
          </Flex>

          <Box bg="white" rounded="xl" shadow="lg" p={{ base: 5, md: 8 }}>
            {etapa === "carregando" && (
              <Flex justify="center" py={10}>
                <Spinner size="xl" color={VERDE} thickness="4px" />
              </Flex>
            )}

            {etapa === "invalido" && (
              <VStack spacing={3} py={6}>
                <Heading size="md">Link inválido ou expirado</Heading>
                <Text textAlign="center" color="gray.500">
                  Confira o link recebido ou solicite um novo ao seu atendente.
                </Text>
              </VStack>
            )}

            {etapa === "apresentacao" && (
              <PaginaBoasVindas
                passo={1}
                texto="Bem-vindo ao processo de certificação digital! Aqui, você realizará o processo de cadastro de forma rápida e segura."
                onIr={setEtapa}
              />
            )}

            {etapa === "explicacao" && (
              <PaginaBoasVindas
                passo={2}
                texto="Com um certificado digital, você pode assinar documentos eletronicamente de forma segura e rápida, além de proteger suas transações online."
                onIr={setEtapa}
              />
            )}

            {etapa === "cpf" && (
              <VStack spacing={5} align="stretch">
                <Heading size="lg" color="green.900" textAlign="center">
                  TERMOS E CONDIÇÕES
                </Heading>
                <Text fontSize="lg" color="green.900" textAlign="center">
                  Para liberação do processo, precisamos que aceite os{" "}
                  <a
                    href="/termos/uso"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "underline", color: "#1e3a8a" }}
                  >
                    termos &amp; condições
                  </a>
                </Text>
                <Checkbox
                  isChecked={aceitouLgpd}
                  onChange={(e) => setAceitouLgpd(e.target.checked)}
                  colorScheme="green"
                  justifyContent="center"
                >
                  <Text fontWeight="bold" color="green.900">
                    Aceito os Termos &amp; Condições
                  </Text>
                </Checkbox>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Seus dados pessoais são tratados conforme a LGPD e a{" "}
                  <a
                    href="/termos/privacidade"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    Política de Privacidade
                  </a>
                  .
                </Text>
                <Box>
                  <Text mb={1} fontSize="sm" fontWeight="semibold">
                    Seu CPF
                  </Text>
                  <Input
                    value={cpf}
                    onChange={(e) => setCpf(formatarCpf(e.target.value))}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    maxLength={14}
                  />
                </Box>
                {erro && (
                  <Alert status="error" rounded="md">
                    <AlertIcon />
                    {erro}
                  </Alert>
                )}
                <Button
                  bg={VERDE}
                  color="white"
                  _hover={{ opacity: 0.9 }}
                  isDisabled={!aceitouLgpd || cpf.length !== 14}
                  isLoading={enviando}
                  onClick={validarCpf}
                >
                  Validar CPF
                </Button>
              </VStack>
            )}

            {etapa === "confirmacao" && dados && (
              <VStack spacing={5} align="stretch">
                <Heading size="md">Confira seus dados</Heading>
                <Box
                  p={4}
                  rounded="lg"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text>
                    <strong>Nome:</strong> {dados.nome}
                  </Text>
                  <Text>
                    <strong>CPF:</strong> {formatarCpf(dados.cpf)}
                  </Text>
                  <Text>
                    <strong>Telefone:</strong>{" "}
                    {formatarTelefone(dados.telefone)}
                  </Text>
                </Box>
                {erro && (
                  <Alert status="error" rounded="md">
                    <AlertIcon />
                    {erro}
                  </Alert>
                )}
                <Button
                  bg={VERDE}
                  color="white"
                  _hover={{ opacity: 0.9 }}
                  isLoading={enviando}
                  onClick={irParaPagamento}
                >
                  Confirmo e ir para pagamento
                </Button>
              </VStack>
            )}

            {etapa === "pagamento" && cobranca && (
              <VStack spacing={5} align="stretch">
                <Heading size="md">Pagamento via PIX</Heading>
                <Text fontSize="lg" fontWeight="bold" color={VERDE}>
                  Valor: R$ {cobranca.valor.toFixed(2).replace(".", ",")}
                </Text>
                <Divider />
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Escaneie o QR Code pelo aplicativo do seu banco ou use o
                  código copia e cola.
                </Text>
                <Flex justify="center">
                  <Box
                    p={3}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    rounded="xl"
                  >
                    <Image
                      src={cobranca.imagemQrcode}
                      alt="QR Code PIX"
                      boxSize="220px"
                    />
                  </Box>
                </Flex>
                <Flex
                  align="center"
                  gap={2}
                  p={3}
                  rounded="lg"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text
                    fontSize="xs"
                    fontFamily="monospace"
                    wordBreak="break-all"
                    flex={1}
                  >
                    {cobranca.pixCopiaECola}
                  </Text>
                  <IconButton
                    aria-label="Copiar código PIX"
                    size="sm"
                    variant="ghost"
                    onClick={copiar}
                    icon={
                      copiado ? (
                        <MdCheckCircle color={VERDE} size={20} />
                      ) : (
                        <MdCopyAll size={20} />
                      )
                    }
                  />
                </Flex>
                <Flex
                  gap={2}
                  align="center"
                  justify="center"
                  color="gray.500"
                  fontSize="sm"
                >
                  <Spinner size="xs" />
                  <Text>Aguardando a confirmação do pagamento...</Text>
                </Flex>
              </VStack>
            )}

            {etapa === "pago" && (
              <VStack spacing={3} py={6}>
                <Icon as={MdCheckCircle} boxSize="70px" color="green.500" />
                <Heading size="md" color="green.500">
                  Pagamento confirmado!
                </Heading>
                <Text textAlign="center" color="gray.500">
                  Em breve um atendente irá te chamar pelo número{" "}
                  {TELEFONE_ATENDIMENTO}.
                </Text>
              </VStack>
            )}
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
}
