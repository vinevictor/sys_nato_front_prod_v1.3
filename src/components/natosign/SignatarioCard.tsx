// app/(private_route)/natosign/[id]/SignatarioCard.tsx
"use client";

import {
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

// Função para formatar o CPF (12345678901 -> 123.456.789-01)
const formatCPF = (cpf: string) => {
  if (!cpf) return "Não informado";
  // Remove qualquer caractere que não seja dígito
  const cleaned = cpf.replace(/\D/g, "");
  // Aplica a máscara
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Função para dar cor ao status do signatário
const getSignerStatusBadge = (state: string) => {
  const statusInfo: { [key: string]: { label: string; color: string } } = {
    "in-transit": { label: "Aguardando", color: "yellow" },
    waiting: { label: "Aguardando", color: "yellow" },
    signing: { label: "Assinando", color: "orange" },
    done: { label: "Assinado", color: "green" },
    filled: { label: "Assinado", color: "green" },
    rejected: { label: "Rejeitado", color: "red" },
  };
  const info = statusInfo[state] || { label: state, color: "gray" };
  return (
    <Badge colorScheme={info.color} variant="solid" borderRadius="full" px={3}>
      {info.label}
    </Badge>
  );
};

interface SignatarioCardProps {
  signer: {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    state: string;
    updatedAt: string;
  };
}

export const SignatarioCard = ({ signer }: SignatarioCardProps) => {
  const lastUpdate = new Date(signer.updatedAt).toLocaleString("pt-BR");

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} shadow="sm" bg="gray.50">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <HStack spacing={4}>
            <Avatar name={signer.nome} size="md" />
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                {signer.nome}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {signer.email}
              </Text>
            </Box>
          </HStack>
          {getSignerStatusBadge(signer.state)}
        </HStack>
        <Flex justify="space-between" align="center" pt={2}>
          <Box>
            <Text fontSize="xs" color="gray.500">
              CPF
            </Text>
            <Text fontWeight="medium">{formatCPF(signer.cpf)}</Text>
          </Box>
          <Box textAlign="right">
            <Text fontSize="xs" color="gray.500">
              Última Atualização
            </Text>
            <Text fontWeight="medium">{lastUpdate}</Text>
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};
