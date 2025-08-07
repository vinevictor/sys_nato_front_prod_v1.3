"use client";

import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormLabel,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface FinanceiraItem {
  id: number;
  fantasia: string;
}

interface FinanceiraLinksProps {
  label?: string;
}


export const FinanceiraLinks = ({
  label = "Links CCAs",
}: FinanceiraLinksProps) => {
  const [financeiras, setFinanceiras] = useState<FinanceiraItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    async function fetchIds() {
      try {

        const res = await fetch(
          `/api/direto/financeira/url`
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
    fetchIds();
  }, []);


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
  
  const CopyLink = (url: string) => { 
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado",
      description: "Link copiado para a área de transferência",
      status: "success",
      duration: 2000,
    });
  }
    


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
            <Button
              fontSize="xs"
              color="blue.600"
              fontFamily="mono"
              bg="gray.50"
              p={1}
              borderRadius="sm"
              border="1px solid"
              borderColor="gray.200"
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onClick={() => CopyLink(`${window.location.origin}/direto/cadastro/?idfinanceira=${financeira.id}`)}
            >
              {`${window.location.origin}/direto/cadastro/?idfinanceira=${financeira.id}`}
            </Button>
          </Flex>
        ))
      )}
    </Flex>
  );
};