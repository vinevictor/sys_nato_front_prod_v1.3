"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  SimpleGrid,
  Divider,
  Button,
  VStack,
  HStack,
  AspectRatio,
  Link,
  useToast,
} from "@chakra-ui/react";
import { FiDownload, FiExternalLink, FiRefreshCw } from "react-icons/fi";
import { SignatarioCard } from "./SignatarioCard";

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box>
    <Text fontSize="sm" color="gray.500">
      {label}
    </Text>
    <Text fontSize="md" fontWeight="medium">
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

export default function NatosignViewClient({ envelope }: any) {
  const router = useRouter();
  const toast = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

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

  const signatarios = envelope.signatarios || [];
  const createdAtFormatted = new Date(envelope.createdAt).toLocaleString(
    "pt-BR"
  );
  const updatedAtFormatted = new Date(envelope.updatedAt).toLocaleString(
    "pt-BR"
  );

  return (
    <Box
      w={{ base: "100%", lg: "80%", xl: "70%" }}
      bg="white"
      p={{ base: 4, md: 8 }}
      borderRadius="lg"
      shadow="md"
    >
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Heading as="h1" size="lg">
            Detalhes do Envelope
          </Heading>
          <HStack>
            {getStatusBadge(envelope.status, envelope.status_view)}
            <Button
              size="sm"
              leftIcon={<FiRefreshCw />}
              onClick={handleUpdateStatus}
              isLoading={isUpdating}
              colorScheme="teal"
            >
              Sincronizar Status
            </Button>
          </HStack>
        </Flex>
        <Divider />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <InfoItem label="ID" value={envelope.id} />
          <InfoItem label="UUID" value={envelope.UUID} />
          <InfoItem label="Nome do Arquivo" value={envelope.original_name} />
          <InfoItem label="Data de Criação" value={createdAtFormatted} />
          <InfoItem label="Última Atualização" value={updatedAtFormatted} />
          <InfoItem label="Status do Pagamento" value={envelope.status_pg} />
        </SimpleGrid>
        <Divider />
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Documentos
          </Heading>
          <HStack spacing={4} wrap="wrap">
            <Button
              as={Link}
              href={envelope.doc_modificado_viw}
              isExternal
              colorScheme="blue"
              leftIcon={<FiExternalLink />}
            >
              Visualizar
            </Button>
            <Button
              as={Link}
              href={envelope.doc_modificado_down}
              colorScheme="green"
              leftIcon={<FiDownload />}
            >
              Baixar Assinado
            </Button>
            <Button
              as={Link}
              href={envelope.doc_original_down}
              colorScheme="gray"
              leftIcon={<FiDownload />}
            >
              Baixar Original
            </Button>
          </HStack>
        </Box>
        <Divider />
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Signatários
          </Heading>
          {signatarios.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {signatarios.map((signer: any) => (
                <SignatarioCard key={signer.id} signer={signer} />
              ))}
            </SimpleGrid>
          ) : (
            <Text color="gray.500">Nenhum signatário associado.</Text>
          )}
        </Box>
        <Divider />
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Pré-visualização
          </Heading>
          <AspectRatio ratio={4 / 5} maxH="70vh">
            <iframe
              title="Pré-visualização do PDF"
              src={envelope.doc_modificado_viw || envelope.doc_original_viw}
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
              }}
            />
          </AspectRatio>
        </Box>
      </VStack>
    </Box>
  );
}
