import { GetSessionServer } from "@/lib/auth_confg";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  SimpleGrid,
  Divider,
  Button,
  Icon,
  VStack,
  HStack,
  AspectRatio,
  Link,
} from "@chakra-ui/react";
import { FiDownload, FiExternalLink } from "react-icons/fi";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

const requestData = async (id: number, token: string | undefined) => {
  if (!token) {
    return { error: true, message: "Não autorizado", data: null, status: 401 };
  }
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/intelesign/${id}`;

  const request = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!request.ok) {
    return {
      error: true,
      message: "Envelope não encontrado",
      data: null,
      status: request.status,
    };
  }

  const data = await request.json();

  return {
    error: false,
    message: "Envelope encontrado",
    data: data,
    status: request.status,
  };
};

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

// Função para mapear o status para um esquema de cores do Chakra UI
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

export default async function NatosignView({ params }: Props) {
  const { id } = params;
  const session = await GetSessionServer();
  const res = await requestData(+id, session?.token);
  console.log("🚀 ~ NatosignView ~ res:", res);

  if (res.error || !res.data) {
    return notFound();
  }

  const envelope = res.data;

  const createdAtFormatted = new Date(envelope.createdAt).toLocaleString(
    "pt-BR"
  );
  const updatedAtFormatted = new Date(envelope.updatedAt).toLocaleString(
    "pt-BR"
  );
  const valorFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(envelope.valor);

  return (
    <Flex w="full" justify="center" p={{ base: 4, md: 8 }} bg="#F8F8F8">
      <Box
        w={{ base: "100%", lg: "80%", xl: "70%" }}
        bg="white"
        p={{ base: 4, md: 8 }}
        borderRadius="lg"
        shadow="md"
      >
        <VStack spacing={6} align="stretch">
          {/* Cabeçalho */}
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading as="h1" size="lg">
              Detalhes do Envelope
            </Heading>
            {getStatusBadge(envelope.status, envelope.status_view)}
          </Flex>

          <Divider />

          {/* Grade de Informações Principais */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <InfoItem label="ID" value={envelope.id} />
            <InfoItem label="UUID" value={envelope.UUID} />
            <InfoItem label="Nome do Arquivo" value={envelope.original_name} />
            <InfoItem label="Data de Criação" value={createdAtFormatted} />
            <InfoItem label="Última Atualização" value={updatedAtFormatted} />
            <InfoItem label="Status do Pagamento" value={envelope.status_pg} />
          </SimpleGrid>

          <Divider />

          {/* Botões de Ação para Documentos */}
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
                Visualizar Documento
              </Button>
              <Button
                as={Link}
                href={envelope.doc_modificado_down}
                colorScheme="green"
                leftIcon={<FiDownload />}
              >
                Baixar Documento Assinado
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

          {/* Pré-visualização do PDF ERRO AQUI */}
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
    </Flex>
  );
}
