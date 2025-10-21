"use client";
import {
  Badge,
  Flex,
  IconButton,
  Link,
  Progress,
  Td,
  Text,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiDownload, FiEdit, FiEye } from "react-icons/fi";

interface TableComponentNatosignProps {
  dados: natosign.NatosignObjectType;
  session?: any;
}

export const TableComponentNatosign = ({
  dados,
}: TableComponentNatosignProps) => {
  const router = useRouter();
  const dtCriacao = new Date(dados.createdAt).toLocaleString("pt-BR");
  const dtFim = new Date(dados.updatedAt).toLocaleString("pt-BR");
  const signatarios = dados.signatarios || [];
  const totalSigners = signatarios.length;
  const signedCount = signatarios.filter(
    (s: { state: string }) => s.state === "done"
  ).length;
  const progressValue =
    totalSigners > 0 ? (signedCount / totalSigners) * 100 : 0;

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { bg: string; color: string }> = {
      new: { bg: "#3B82F6", color: "#FFFFFF" },
      draft: { bg: "#3B82F6", color: "#FFFFFF" },
      done: { bg: "#059669", color: "#FFFFFF" },
      completed: { bg: "#059669", color: "#FFFFFF" },
      signing: { bg: "#F59E0B", color: "#FFFFFF" },
      rejected: { bg: "#DC2626", color: "#FFFFFF" },
      failed: { bg: "#DC2626", color: "#FFFFFF" },
      expired: { bg: "#DC2626", color: "#FFFFFF" },
    };
    const { bg, color } = statusStyles[status] || {
      bg: "#6B7280",
      color: "#FFFFFF",
    };

    return (
      <Badge
        bg={bg}
        color={color}
        textTransform="capitalize"
        px={3}
        py={1}
        borderRadius="md"
        fontWeight="semibold"
        letterSpacing="wide"
        _dark={{ bg, color }}
      >
        {dados.status_view || status}
      </Badge>
    );
  };

  return (
    <Tr
      _hover={{
        bg: "white",
        transform: "translateY(-2px)",
        shadow: "md",
        _dark: {
          bg: "gray.700",
          shadow: "dark-lg",
        },
      }}
      transition="all 0.3s"
    >
      <Td
        p={{ base: 2, md: 3 }}
        borderBottomColor="gray.200"
        _dark={{ borderBottomColor: "gray.700", color: "gray.100" }}
        color="gray.800"
      >
        <Text fontWeight="medium">{dados.id}</Text>
      </Td>
      <Td
        p={{ base: 2, md: 3 }}
        borderBottomColor="gray.200"
        _dark={{ borderBottomColor: "gray.700", color: "gray.100" }}
        color="gray.800"
      >
        {dados.signatarios && dados.signatarios.length > 0
          ? dados.signatarios.map((s: { nome: string }) => s.nome).join(", ")
          : "--"}
      </Td>
      <Td
        p={{ base: 2, md: 3 }}
        borderBottomColor="gray.200"
        _dark={{ borderBottomColor: "gray.700" }}
      >
        {totalSigners > 0 ? (
          <VStack spacing={1} align="stretch" maxW="100px">
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="gray.600"
              _dark={{ color: "gray.400" }}
              textAlign="right"
            >
              {signedCount} de {totalSigners}
            </Text>
            <Progress value={progressValue} size="xs" colorScheme="green" />
          </VStack>
        ) : (
          <Text color="gray.600" _dark={{ color: "gray.400" }}>
            --
          </Text>
        )}
      </Td>

      <Td
        p={{ base: 2, md: 3 }}
        borderBottomColor="gray.200"
        _dark={{ borderBottomColor: "gray.700" }}
      >
        {getStatusBadge(dados.status)}
      </Td>
      <Td
        p={{ base: 2, md: 3 }}
        borderBottomColor="gray.200"
        _dark={{ borderBottomColor: "gray.700", color: "gray.100" }}
        color="gray.800"
      >
        <Text fontSize="sm">{dtCriacao}</Text>
      </Td>
      <Td
        p={{ base: 2, md: 3 }}
        borderBottomColor="gray.200"
        _dark={{ borderBottomColor: "gray.700", color: "gray.100" }}
        color="gray.800"
      >
        <Text fontSize="sm">{dtFim}</Text>
      </Td>
      <Td
        p={{ base: 2, md: 3 }}
        borderBottomColor="gray.200"
        _dark={{ borderBottomColor: "gray.700" }}
      >
        <Flex gap={2} justify="center">
          <Tooltip label="Visualizar Envelope">
            <IconButton
              onClick={() =>
                window.open(
                  dados.public_link ||
                    dados.doc_modificado_viw ||
                    dados.doc_original_viw,
                  "_blank"
                )
              }
              bg="blue.400"
              color="white"
              variant="solid"
              _dark={{
                bg: "blue.400",
                color: "white",
              }}
              size="sm"
              icon={<FiEye />}
              aria-label="Visualizar"
              _hover={{
                bg: "blue.50",
                _dark: { bg: "blue.900" },
              }}
              transition="all 0.2s"
            />
          </Tooltip>
          <Tooltip label="Baixar Documento">
            <IconButton
              as={Link}
              href={dados.doc_modificado_down || dados.doc_original_down}
              isExternal
              bg="orange.600"
              color="white"
              variant="solid"
              _dark={{
                bg: "orange.600",
                color: "white",
              }}
              size="sm"
              icon={<FiDownload />}
              aria-label="Baixar"
              _hover={{
                bg: "gray.100",
                _dark: { bg: "gray.900" },
              }}
              transition="all 0.2s"
            />
          </Tooltip>
          <Tooltip label="Detalhes do Envelope">
            <IconButton
              bg="gray.400"
              color="white"
              variant="solid"
              _dark={{
                bg: "gray.400",
                color: "white",
              }}
              size="sm"
              icon={<FiEdit />}
              aria-label="Detalhes"
              onClick={() => {
                router.push(`/natosign/${dados.id}`);
              }}
              _hover={{
                bg: "gray.100",
                _dark: { bg: "gray.900" },
              }}
              transition="all 0.2s"
            />
          </Tooltip>
        </Flex>
      </Td>
    </Tr>
  );
};
