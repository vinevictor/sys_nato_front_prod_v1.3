"use client";

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiDownload, FiExternalLink, FiRefreshCw } from "react-icons/fi";
import { SignatarioCard } from "./SignatarioCard";
import { PDFViewer } from "./PDFViewer";

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box>
    <Text
      fontSize="xs"
      fontWeight="semibold"
      color="gray.600"
      textTransform="uppercase"
      letterSpacing="wide"
      mb={1}
      _dark={{ color: "gray.400" }}
    >
      {label}
    </Text>
    <Text
      fontSize="md"
      fontWeight="medium"
      color="#023147"
      _dark={{ color: "gray.100" }}
    >
      {value}
    </Text>
  </Box>
);

const getStatusBadge = (status: string, statusView: string) => {
  const statusColors: { [key: string]: string } = {
    new: "blue",
    done: "green",
    signing: "orange",
    rejected: "red",
    failed: "red",
  };
  return (
    <Badge
      colorScheme={statusColors[status] || "gray"}
      px={3}
      py={1}
      borderRadius="full"
      textTransform="capitalize"
    >
      {statusView}
    </Badge>
  );
};

type EnvelopeType = {
  UUID: string;
  ativo: boolean;
  background_sheet: string;
  cca: {
    id: number;
    cnpj: string;
    razaosocial: string;
    fantasia: string;
    tel: string;
  };
  cca_id: number;
  construtora_id: number;
  construtora: {
    id: number;
    cnpj: string;
    razaosocial: string;
    fantasia: string;
    tel: string;
  };
  createdAt: string;
  description: string;
  doc_modificado_down: string;
  doc_modificado_viw: string;
  doc_original_down: string;
  doc_original_viw: string;
  hash: string;
  id: number;
  message: string;
  original_name: string;
  public_link: string;
  signatarios: any[];
  status: string;
  status_pg: string;
  status_view: string;
  title: string;
  type: string;
  updatedAt: string;
  user_id: number;
  valor: number;
};

interface NatosignViewClientProps {
  envelope: EnvelopeType;
}

export default function NatosignViewClient({
  envelope,
}: NatosignViewClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/intelesign/status/${envelope.id}`);
      if (!response.ok) {
        throw new Error("Falha ao buscar atualização de status.");
      }
      toast({
        title: "Status Atualizado!",
        description: "Os dados do envelope foram sincronizados.",
        status: "success",
        isClosable: true,
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Falha ao baixar o arquivo.");
      }

      // Obter o ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();

      // Detectar o tipo de arquivo pelos bytes iniciais (magic numbers)
      const uint8Array = new Uint8Array(arrayBuffer);
      let mimeType = "application/octet-stream";
      let extension = "";

      // Verificar assinatura do arquivo
      if (uint8Array[0] === 0x50 && uint8Array[1] === 0x4b) {
        // ZIP file (50 4B)
        mimeType = "application/zip";
        extension = ".zip";
      } else if (
        uint8Array[0] === 0x25 &&
        uint8Array[1] === 0x50 &&
        uint8Array[2] === 0x44 &&
        uint8Array[3] === 0x46
      ) {
        // PDF file (25 50 44 46 = %PDF)
        mimeType = "application/pdf";
        extension = ".pdf";
      } else {
        // Tentar obter do Content-Type do response
        const contentType = response.headers.get("content-type");
        if (contentType) {
          mimeType = contentType;
          if (contentType.includes("pdf")) extension = ".pdf";
          else if (contentType.includes("zip")) extension = ".zip";
        }
      }

      // Garantir que o filename tenha a extensão correta
      let finalFilename = filename;
      if (extension && !filename.toLowerCase().endsWith(extension)) {
        // Remove extensão incorreta se existir
        finalFilename = filename.replace(/\.(pdf|zip)$/i, "") + extension;
      }

      // Criar blob com o tipo correto
      const blob = new Blob([arrayBuffer], { type: mimeType });

      // Criar URL temporária para o blob
      const downloadUrl = window.URL.createObjectURL(blob);

      // Criar e clicar no link de download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = finalFilename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      // Limpar após um pequeno delay para garantir que o download iniciou
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);

      toast({
        title: "Download Iniciado!",
        description: `Baixando ${finalFilename}`,
        status: "success",
        isClosable: true,
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao baixar",
        description: error.message || "Não foi possível baixar o arquivo.",
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const signatarios = envelope.signatarios || [];
  const createdAtFormatted = new Date(envelope.createdAt).toLocaleString(
    "pt-BR"
  );
  const updatedAtFormatted = new Date(envelope.updatedAt).toLocaleString(
    "pt-BR"
  );
  const pdfUrl = envelope.doc_modificado_viw || envelope.doc_original_viw;

  const shouldShowUpdateButton = (): boolean => {
    const statusFinalizado =
      envelope.status === "done" || envelope.status === "completed";
    return !statusFinalizado;
  };

  return (
    <VStack spacing={{ base: 5, md: 6 }} align="stretch" w="full">
      {/* Header com ação */}
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={4}
        pb={4}
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        _dark={{ borderBottomColor: "gray.700" }}
      >
        <Heading size="md" color="#023147" _dark={{ color: "gray.100" }}>
          Detalhes do Envelope
        </Heading>
        <Button
          leftIcon={<FiRefreshCw />}
          onClick={handleUpdateStatus}
          isLoading={isUpdating}
          size={{ base: "sm", md: "md" }}
          colorScheme="green"
          bg="#00713D"
          _hover={{ bg: "#005a31" }}
          _dark={{
            bg: "#00d672",
            color: "gray.900",
            _hover: { bg: "#00c060" },
          }}
        >
          Sincronizar Status
        </Button>
      </Flex>

      {/* Informações principais */}
      <Box
        bg="gray.50"
        p={{ base: 4, md: 6 }}
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
        _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      >
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <InfoItem label="ID" value={envelope.id} />
          <InfoItem label="UUID" value={envelope.UUID} />
          <InfoItem label="Nome do Arquivo" value={envelope.original_name} />
          <InfoItem label="Data de Criação" value={createdAtFormatted} />
          <InfoItem label="Última Atualização" value={updatedAtFormatted} />
          <InfoItem label="Status do Pagamento" value={envelope.status_pg} />
        </SimpleGrid>
      </Box>

      {/* Documentos */}
      <Box>
        <Heading size="sm" mb={4} color="#023147" _dark={{ color: "gray.100" }}>
          Documentos
        </Heading>
        <Flex gap={3} wrap="wrap">
          <Button
            as={Link}
            onClick={() => window.open(envelope.public_link, "_blank")}
            isExternal
            leftIcon={<FiExternalLink />}
            size={{ base: "sm", md: "md" }}
            colorScheme="blue"
            bg="#3B82F6"
            _hover={{ bg: "#2563EB" }}
            disabled={!envelope.doc_modificado_viw}
          >
            Visualizar
          </Button>
          <Button
            onClick={() =>
              handleDownload(
                envelope.doc_modificado_down,
                `Assinado_${envelope.original_name}`
              )
            }
            leftIcon={<FiDownload />}
            size={{ base: "sm", md: "md" }}
            colorScheme="green"
            bg="#00713D"
            _hover={{ bg: "#005a31" }}
            _dark={{
              bg: "#00d672",
              color: "gray.900",
              _hover: { bg: "#00c060" },
            }}
            disabled={shouldShowUpdateButton()}
            isLoading={isDownloading}
            loadingText="Baixando..."
          >
            Baixar Assinado
          </Button>
          <Button
            onClick={() =>
              window.open(envelope.background_sheet, "_blank")
            }
            leftIcon={<FiDownload />}
            size={{ base: "sm", md: "md" }}
            colorScheme="green"
            bg="#00713D"
            _hover={{ bg: "#005a31" }}
            _dark={{
              bg: "#00d672",
              color: "gray.900",
              _hover: { bg: "#00c060" },
            }}
            disabled={shouldShowUpdateButton()}
            isLoading={isDownloading}
            loadingText="Baixando..."
          >
            Baixar Logs
          </Button>
          <Button
            onClick={() =>
              handleDownload(
                envelope.doc_original_down,
                `${envelope.original_name}_original`
              )
            }
            leftIcon={<FiDownload />}
            size={{ base: "sm", md: "md" }}
            variant="outline"
            colorScheme="gray"
            borderColor="gray.300"
            _dark={{ borderColor: "gray.600" }}
            isLoading={isDownloading}
            loadingText="Baixando..."
          >
            Baixar Original
          </Button>
        </Flex>
      </Box>

      {/* Signatários */}
      <Box>
        <Heading size="sm" mb={4} color="#023147" _dark={{ color: "gray.100" }}>
          Signatários
        </Heading>
        {signatarios.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {signatarios.map((signer: any) => (
              <SignatarioCard key={signer.id} signer={signer} />
            ))}
          </SimpleGrid>
        ) : (
          <Flex
            w="full"
            minH="150px"
            justifyContent="center"
            alignItems="center"
            bg="gray.50"
            _dark={{ bg: "gray.900" }}
            borderRadius="lg"
            p={8}
          >
            <Text fontSize="md" color="gray.600" _dark={{ color: "gray.400" }}>
              Nenhum signatário associado.
            </Text>
          </Flex>
        )}
      </Box>

      {/* Pré-visualização do PDF */}
      <Box>
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
          <Heading size="sm" color="#023147" _dark={{ color: "gray.100" }}>
            Pré-visualização do Documento
          </Heading>
          {pdfUrl && (
            <Button
              as={Link}
              href={pdfUrl}
              isExternal
              size="sm"
              leftIcon={<FiExternalLink />}
              colorScheme="blue"
              variant="outline"
            >
              Abrir em nova aba
            </Button>
          )}
        </Flex>
        {pdfUrl ? (
          <PDFViewer fileUrl={pdfUrl} />
        ) : (
          <Flex
            w="full"
            minH="200px"
            justify="center"
            align="center"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="lg"
            bg="gray.50"
            _dark={{
              bg: "gray.900",
              borderColor: "gray.700",
            }}
          >
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              Nenhum documento disponível para pré-visualização.
            </Text>
          </Flex>
        )}
      </Box>
    </VStack>
  );
}
