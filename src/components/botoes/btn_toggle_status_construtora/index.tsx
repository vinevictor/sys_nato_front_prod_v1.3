"use client";
import { IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdCancel, MdCheckCircle } from "react-icons/md";

interface BtnToggleStatusConstrutoraProps {
  id: number;
  statusAtual: boolean;
}

/**
 * Botão para ativar ou desativar construtora
 * 
 * @param id - ID da construtora
 * @param statusAtual - Status atual da construtora (true = ativo, false = inativo)
 * 
 * Funcionalidade:
 * - Se ativo (true): mostra botão laranja para desativar
 * - Se inativo (false): mostra botão verde para ativar
 * - Faz PUT para /api/construtora/update/:id invertendo o status
 */
export default function BtnToggleStatusConstrutora({
  id,
  statusAtual,
}: BtnToggleStatusConstrutoraProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleToggleStatus = async () => {
    setIsLoading(true);

    try {
      const novoStatus = !statusAtual;

      const response = await fetch(`/api/construtora/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: novoStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }

      toast({
        title: "Sucesso!",
        description: `Construtora ${novoStatus ? "ativada" : "desativada"} com sucesso!`,
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });

      router.refresh();
    } catch (error) {
      console.error("Erro ao alternar status:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status da construtora",
        status: "error",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip
      label={statusAtual ? "Desativar Construtora" : "Ativar Construtora"}
    >
      <IconButton
        aria-label={statusAtual ? "Desativar" : "Ativar"}
        icon={statusAtual ? <MdCancel /> : <MdCheckCircle />}
        colorScheme={statusAtual ? "orange" : "green"}
        variant="outline"
        onClick={handleToggleStatus}
        isLoading={isLoading}
      />
    </Tooltip>
  );
}
