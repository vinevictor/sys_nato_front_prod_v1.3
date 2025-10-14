"use client";

import { IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { GrStatusCritical, GrStatusGood } from "react-icons/gr";
import { MdDomain, MdDomainDisabled } from "react-icons/md";

interface BtnDesativarEmpreendimentoProps {
  id: number;
  ativo: boolean;
}

export default function BtnDesativarEmpreendimento({
  id,
  ativo,
}: BtnDesativarEmpreendimentoProps) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    const data = await fetch(`/api/empreendimento/delete/${id}`, {
      method: "DELETE",
    });
    const res = await data.json();

    if (!res.ok) {
      toast({
        title: "Sucesso!",
        description: ativo
          ? "Empreendimento Desativado com sucesso!"
          : "Empreendimento Ativado com sucesso!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      window.location.reload();
    } else {
      toast({
        title: "Erro!",
        description: "Ocorreu um erro ao alterar o status do Empreendimento",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      window.location.reload();
    }

    setIsLoading(false);
  };

  return (
    <Tooltip
      label={
        ativo
          ? "Deseja desativar Empreendimento?"
          : "Deseja ativar Empreendimento?"
      }
      placement="top"
    >
      <IconButton
        variant="outline"
        colorScheme={ativo ? "red" : "green"}
        icon={ativo ? <MdDomainDisabled /> : <MdDomain />}
        aria-label={ativo ? "Desativar" : "Ativar"}
        onClick={handleToggleStatus}
        isLoading={isLoading}
        isDisabled={isLoading}
        _hover={{
          bg: ativo ? "red.50" : "green.50",
          _dark: {
            bg: ativo ? "red.900" : "green.900",
          },
        }}
        _dark={{
          borderColor: ativo ? "red.600" : "green.600",
          color: ativo ? "red.400" : "green.400",
        }}
      />
    </Tooltip>
  );
}
