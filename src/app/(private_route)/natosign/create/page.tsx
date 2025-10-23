"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Flex,
  Button,
  VStack,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import Step1 from "@/components/natosign/create/step1";
import Step2 from "@/components/natosign/create/step2";
import Step3 from "@/components/natosign/create/step3";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

interface Signer {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  type: "signer" | "approver" | "carbon-copy";
}

interface CcaType {
  id: number;
  fantasia: string;
  valor: number;
  Intelesign_price: number;
  Intelesign_status: boolean;
}

interface ConstType {
  id: number;
  fantasia: string;
}

interface FormData {
  signatureType: "simple" | "qualified";
  document: File | null;
  signers: Signer[];
  valor: number;
  cca_id: string;
  const_id: string;
  title: string;
  subject: string;
  message: string;
  expire_at: number;
}
const fetchConstrutoras = async () => {
  try {
    const req = await fetch("/api/construtora/intellisign");
    if (!req.ok) return [];
    return await req.json();
  } catch (error) {
    console.error("Erro ao buscar construtoras:", error);
    return [];
  }
};

export default function CreateNatosign() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [availableCcas, setAvailableCcas] = useState<CcaType[]>([]);
  const [isCcaLoading, setIsCcaLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isConstLoading, setIsConstLoading] = useState(true);
  const [availableConst, setAvailableConst] = useState<ConstType[]>([]);

  const [formData, setFormData] = useState<FormData>({
    signatureType: "simple",
    document: null,
    signers: [
      {
        name: "",
        cpf: "",
        email: "",
        phone: "",
        type: "signer",
      },
    ],
    valor: 0,
    cca_id: "",
    const_id: "",
    title: "SisNato - Assinatura de documento",
    subject: "Contrato de financiamento de imóvel",
    message:
      "Por favor, assine o documento para prosseguir com o processo de financiamento de imóvel.",
    expire_at: 7, // 7 dias
  });
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      // Bloco do CCA (permanece o mesmo)
      setIsCcaLoading(true);
      try {
        const reqCca = await fetch("/api/financeira/intellisign");
        const resCca = await reqCca.json();
        if (resCca && resCca.data) {
          setAvailableCcas(resCca.data);
          if (resCca.data.length === 1) {
            const unicoCca = resCca.data[0];
            setFormData((prev) => ({
              ...prev,
              cca_id: unicoCca.id.toString(),
              valor: unicoCca.Intelesign_price,
            }));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar CCAs:", error);
      } finally {
        setIsCcaLoading(false);
      }

      setIsConstLoading(true);
      try {
        const resConst = await fetchConstrutoras();
        if (resConst && resConst.data) {
          setAvailableConst(resConst.data);
          // Auto-seleção se houver apenas uma construtora
          if (resConst.data.length === 1) {
            setFormData((prev) => ({
              ...prev,
              const_id: resConst.data[0].id.toString(),
            }));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar construtoras:", error);
      } finally {
        setIsConstLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCcaChange = (ccaId: string) => {
    const selectedCca = availableCcas.find(
      (cca) => cca.id.toString() === ccaId
    );

    setFormData((prev) => ({
      ...prev,
      cca_id: ccaId,
      valor: selectedCca ? selectedCca.Intelesign_price : 0,
    }));
  };

  useEffect(() => {
    if (!formData.document) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(formData.document);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.document]);

  const nextStep = () => {
    if (step === 1) {
      if (!formData.signatureType) {
        toast({
          title: "Campos obrigatórios",
          description:
            "Por favor, selecione o tipo de assinatura e de assinante.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
    if (step === 2) {
      if (!formData.document) {
        toast({
          title: "Documento faltando",
          description: "Por favor, envie um documento para assinar.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    // if (!formData.const_id) {
    //   toast({
    //     title: "Campo Obrigatório",
    //     description: "Por favor, selecione uma Construtora.",
    //     status: "warning",
    //   });
    //   return;
    // }
    if (!formData.cca_id) {
      toast({
        title: "Campo Obrigatório",
        description: "Por favor, selecione uma Financeira (CCA).",
        status: "warning",
      });
      return;
    }
    if (!formData.document) {
      toast({
        title: "Documento Faltando",
        description: "Por favor, anexe o documento para assinatura.",
        status: "warning",
      });
      return;
    }
    const algumSignatarioInvalido = formData.signers.some(
      (signer) =>
        !signer.name ||
        signer.name.trim() === "" ||
        !signer.email ||
        signer.email.trim() === "" ||
        !signer.cpf ||
        signer.cpf.trim() === ""
    );

    if (algumSignatarioInvalido) {
      toast({
        title: "Campos Obrigatórios",
        description:
          "Nome, Email e CPF são obrigatórios para todos os signatários.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const signatariosParaApi = formData.signers.map((s) => ({
        nome: s.name.toUpperCase(),
        email: s.email.toLowerCase(),
        cpf: s.cpf.replace(/\D/g, ""),
      }));

      const apiFormData = new FormData();

      apiFormData.append("file", formData.document);
      apiFormData.append("const_id", formData.const_id || "1");
      apiFormData.append("signatarios", JSON.stringify(signatariosParaApi));
      if (formData.title) apiFormData.append("title", formData.title);
      if (formData.subject) apiFormData.append("subject", formData.subject);
      if (formData.message) apiFormData.append("message", formData.message);
      if (formData.expire_at)
        apiFormData.append("expire_at", formData.expire_at.toString());

      apiFormData.append("valor", formData.valor.toString());
      apiFormData.append("cca_id", formData.cca_id);
      apiFormData.append("type", formData.signatureType);

      const response = await fetch("/api/intelesign", {
        method: "POST",
        body: apiFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao enviar o envelope.");
      }

      const result = await response.json();
      console.log("Sucesso:", result);

      toast({
        title: "Envelope enviado com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      router.push("/natosign");
    } catch (error: any) {
      console.error("Erro ao enviar envelope:", error);
      toast({
        title: "Erro ao enviar envelope.",
        description: error.message,
        status: "error",
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      w="full"
      maxW={{ base: "100%", sm: "95%", md: "96%", lg: "98%" }}
      mx="auto"
      py={{ base: 4, md: 5, lg: 6 }}
      px={{ base: 3, sm: 4, md: 5, lg: 6 }}
    >
      <VStack spacing={{ base: 5, md: 6, lg: 8 }} align="stretch" w="full">
        {/* Cabeçalho */}
        <Flex
          bg="white"
          _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
          borderBottomWidth="2px"
          borderBottomColor="#00713D"
          p={{ base: 4, sm: 5, md: 6 }}
          align="center"
          justify="space-between"
          wrap="wrap"
          gap={{ base: 3, md: 4 }}
          borderRadius={{ base: "md", md: "lg", xl: "xl" }}
          borderBottomRadius={0}
          shadow={{ base: "sm", md: "md", lg: "lg" }}
        >
          <Flex align="center" gap={{ base: 2, md: 3 }} w="full">
            <IconButton
              aria-label="Voltar"
              icon={<ArrowBackIcon />}
              onClick={() => router.back()}
              variant="ghost"
              size={{ base: "sm", md: "md" }}
              color="#023147"
              _dark={{ color: "gray.100" }}
              _hover={{
                bg: "gray.100",
                _dark: { bg: "gray.700" },
              }}
            />
            <Heading
              fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
              size={{ base: "md", md: "lg" }}
              color="#023147"
              _dark={{ color: "gray.100" }}
            >
              Criar Novo Envelope
            </Heading>
          </Flex>
        </Flex>

        {/* Área de Conteúdo */}
        <Box
          bg="white"
          _dark={{ bg: "gray.800" }}
          p={{ base: 4, md: 6, lg: 8 }}
          borderRadius="xl"
          borderTopRadius={0}
          shadow="lg"
        >
          <VStack spacing={{ base: 6, md: 8 }} align="stretch">

          {step === 1 && (
            <Step1
              formData={formData}
              setFormData={setFormData}
              handleCcaChange={handleCcaChange}
              availableCcas={availableCcas}
              isCcaLoading={isCcaLoading}
              isConstLoading={isConstLoading}
              availableConst={availableConst}
            />
          )}
          {step === 2 && (
            <Step2
              formData={formData}
              setFormData={setFormData}
              previewUrl={previewUrl}
            />
          )}
          {step === 3 && (
            <Step3 formData={formData} setFormData={setFormData} />
          )}

          <Flex
            justify={step === 1 ? "flex-end" : "space-between"}
            pt={{ base: 4, md: 6 }}
            borderTopWidth="1px"
            borderTopColor="gray.200"
            _dark={{ borderTopColor: "gray.700" }}
            gap={3}
            wrap="wrap"
          >
            {step > 1 && (
              <Button
                onClick={prevStep}
                variant="outline"
                colorScheme="gray"
                size={{ base: "md", md: "lg" }}
                borderColor="gray.300"
                _dark={{ borderColor: "gray.600" }}
              >
                Voltar
              </Button>
            )}

            {step < 3 && (
              <Button
                onClick={nextStep}
                colorScheme="blue"
                bg="#3B82F6"
                _hover={{ bg: "#2563EB" }}
                size={{ base: "md", md: "lg" }}
              >
                Próximo
              </Button>
            )}

            {step === 3 && (
              <Button
                onClick={handleSubmit}
                colorScheme="green"
                bg="#00713D"
                _hover={{ bg: "#005a31" }}
                _dark={{
                  bg: "#00d672",
                  color: "gray.900",
                  _hover: { bg: "#00c060" },
                }}
                isLoading={isLoading}
                size={{ base: "md", md: "lg" }}
              >
                Enviar Envelope
              </Button>
            )}
          </Flex>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
