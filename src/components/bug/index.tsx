"use client";
import { Alert, AlertDescription, AlertTitle, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GoAlertFill } from "react-icons/go";

interface BugType {
  id: number;
  tipo: string;
  message: string;
  createAt: Date;
  updatedAt: Date;
}

export const BugReport = () => {
  const [bug, setBug] = useState<BugType[]>([]);

  useEffect(() => {
    HandleFindAll();
  }, []);
  // TODO: remover componente
  // Função responsável por buscar todos os bugs na API de forma segura
  const HandleFindAll = async () => {
    try {
      const response = await fetch(`/api/bug_report`);
      if (response.ok) {
        // Lê o corpo da resposta como texto
        const text = await response.text();
        // Só tenta converter para JSON se houver conteúdo
        if (text) {
          const data = JSON.parse(text);
          if (Array.isArray(data) && data.length > 0) {
            setBug(data);
          } else {
            setBug([]); // Se não houver dados, define como lista vazia
          }
        } else {
          setBug([]); // Resposta vazia, define lista vazia
        }
      } else {
        // Trata status de erro da API
        console.error("Erro na resposta da API:", response.status);
      }
    } catch (error) {
      // Exibe o erro no console para facilitar o debug
      console.log(error);
    }
  };

  const MapBug = bug?.map((bug: any, index: number) => {
    return (
      <Alert
        key={index}
        status={"warning"}
        bg="orange.50"
        border="1px solid"
        borderColor="orange.200"
        borderRadius="lg"
        p={4}
        shadow="sm"
        cursor="pointer"
        transition="all 0.3s"
        _hover={{
          bg: "orange.100",
          borderColor: "orange.300",
          shadow: "md",
          transform: "translateY(-2px)",
        }}
      >
        <GoAlertFill
          fontSize={"1.5rem"}
          color="#D69E2E"
          style={{ marginRight: "0.75rem", flexShrink: 0 }}
        />
        <Flex flexDir="column" gap={1} flex={1}>
          <AlertTitle fontSize="xl" fontWeight="bold" color="orange.700" mb={1}>
            Alerta
          </AlertTitle>
          <AlertDescription fontSize="md" color="orange.600" lineHeight="1.4">
            {bug.descricao}
          </AlertDescription>
        </Flex>
      </Alert>
    );
  });

  return (
    <>
      {bug.length > 0 && (
        <Flex flexDir="column" gap={3} mx={0}>
          {MapBug}
        </Flex>
      )}
    </>
  );
};