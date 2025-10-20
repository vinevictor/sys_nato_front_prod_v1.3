"use client";

import { IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdCheckCircle, MdCancel } from "react-icons/md";

interface BtnToggleStatusFinanceiraProps {
  id: number;
  statusAtual: boolean;
}

/**
 * Botão para ativar/desativar status de financeira
 * 
 * Inverte o status atual da financeira com um clique.
 * - Se ativo (true) -> desativa (false)
 * - Se inativo (false) -> ativa (true)
 * 
 * @param id - ID da financeira
 * @param statusAtual - Status atual (true = ativo, false = inativo)
 */
export function BtnToggleStatusFinanceira({
  id,
  statusAtual,
}: BtnToggleStatusFinanceiraProps) {
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);

    try {
      const novoStatus = !statusAtual;
      console.log("🚀 ~ handleToggleStatus ~ novoStatus:", novoStatus)

      const req = await fetch(`/api/financeira/put/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: novoStatus,
        }),
      });

      if (!req.ok) {
        throw new Error("Erro ao atualizar status");
      }

      toast({
        title: "Sucesso!",
        description: `Financeira ${novoStatus ? "ativada" : "desativada"} com sucesso!`,
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });

      // Atualiza a página para refletir mudanças
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Ocorreu um erro ao atualizar o status da financeira.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip label={statusAtual ? "Desativar Financeira" : "Ativar Financeira"}>
      <IconButton
        colorScheme={statusAtual ? "orange" : "green"}
        variant="outline"
        icon={statusAtual ? <MdCancel /> : <MdCheckCircle />}
        aria-label={statusAtual ? "Desativar" : "Ativar"}
        onClick={handleToggleStatus}
        isLoading={isLoading}
      />
    </Tooltip>
  );
}
