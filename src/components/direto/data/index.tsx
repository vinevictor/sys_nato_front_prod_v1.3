"use client";

import { useEffect, useState } from "react";
import {
  Flex,
  FormLabel,
  Spinner,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

interface FinanceiraItem {
  id: number;
  fantasia: string;
}

interface FinanceiraLinksProps {
  userId: number;
  label?: string;
}


export const FinanceiraLinks = ({
  userId,
  label = "Links CCAs",
}: FinanceiraLinksProps) => {
  const [financeiras, setFinanceiras] = useState<FinanceiraItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIds() {
      try {

        const res = await fetch(
          `/api/direto/financeira/${userId}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Erro ${res.status}: ${errorText}`);
        }

        const json = await res.json();

        if (Array.isArray(json)) {
          setFinanceiras(json);
        } else {
          throw new Error("Formato de resposta inválido");
        }
      } catch (err: any) {
        console.error("Erro ao buscar financeiras:", err);
        setError(err.message ?? "Falha inesperada");
      }
    }


    if (userId) {
      fetchIds();
    }
  }, [userId]);


  if (!userId) return null;


  if (error)
    return (
      <Alert status="error" borderRadius="md" p={2}>
        <AlertIcon />
        <Text fontSize="sm">Erro ao carregar financeiras: {error}</Text>
      </Alert>
    );

  if (financeiras === null)
    return (
      <Flex justify="center" align="center" py={2}>
        <Spinner size="sm" />
        <Text fontSize="sm" ml={2}>Carregando...</Text>
      </Flex>
    );


  return (
    <Flex direction="column" px={2} lineHeight="1rem" gap={1}>
      <FormLabel fontWeight="bold">{label}</FormLabel>

      {financeiras.length === 0 ? (
        <Text fontSize="sm" color="gray.500">
          Nenhuma financeira encontrada
        </Text>
      ) : (
        financeiras.map((financeira) => (
          <Flex key={financeira.id} direction="column" py={1}>
            <Text fontSize="xs" color="gray.600" fontWeight="semibold">
              {financeira.fantasia}
            </Text>
            <Text
              fontSize="xs"
              color="blue.600"
              fontFamily="mono"
              bg="gray.50"
              p={1}
              borderRadius="sm"
              border="1px solid"
              borderColor="gray.200"
              cursor="text"
              userSelect="all"
              _hover={{ bg: "gray.100" }}
            >
              {`${window.location.origin}/direto/${financeira.id}`}
            </Text>
          </Flex>
        ))
      )}
    </Flex>
  );
};