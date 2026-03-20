"use client";
import { Button, Box, Text, Flex, Icon, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { CheckCircleIcon } from "@chakra-ui/icons";
// Importe seu tipo de dados se ele estiver em um arquivo separado,
// ou use 'any' temporariamente para validar o funcionamento.
import { SolicitacaoIdTypeData } from "@/types/solicitacao";

interface Props {
  id: number;
  token: string;
  data: SolicitacaoIdTypeData; // Define que o componente recebe o objeto data
}

export default function BtnDevolucao({ id, token, data }: Props) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Se já estiver confirmado, exibe o Card Verde
  if (data?.conf_devolucao) {
    return (
      <Box
        p={3}
        bg="green.50"
        _dark={{ bg: "green.900/20" }}
        border="1px solid"
        borderColor="green.200"
        rounded="md"
        w="full"
      >
        <Flex align="center" gap={3}>
          <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
          <Box>
            <Text
              fontWeight="bold"
              fontSize="xs"
              color="green.700"
              _dark={{ color: "green.300" }}
            >
              DEVOLUÇÃO CONFIRMADA
            </Text>
            {data?.dt_conf_devolucao && (
              <Text fontSize="10px" color="green.600">
                {new Date(data.dt_conf_devolucao).toLocaleString("pt-BR")}
              </Text>
            )}
          </Box>
        </Flex>
      </Box>
    );
  }

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conf_devolucao: true }),
        }
      );

      if (res.ok) {
        toast({
          title: "Devolução Confirmada",
          status: "success",
          duration: 2000,
        });
        // Força o refresh para atualizar os dados do Server Component
        window.location.reload();
      } else {
        toast({ title: "Erro ao confirmar", status: "error" });
      }
    } catch (err) {
      toast({ title: "Erro de conexão", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      colorScheme="orange"
      variant="outline"
      size="sm"
      w="full"
      isLoading={loading}
      onClick={handleConfirmar}
      leftIcon={<CheckCircleIcon />}
    >
      Confirmar Devolução
    </Button>
  );
}
