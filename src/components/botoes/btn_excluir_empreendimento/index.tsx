"use client";

import { Button, Tooltip, useToast, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { GrStatusCritical, GrStatusGood } from "react-icons/gr";

interface BtnDesativarEmpreendimentoProps {
  id: string;
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
      label={ativo ? "Desativar Empreendimento" : "Ativar Empreendimento"}
    >
      <Button
        variant="outline"
        colorScheme={ativo ? "green" : "red"}
        onClick={handleToggleStatus}
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        <Icon
          as={ativo ? GrStatusGood : GrStatusCritical}
          color={ativo ? "green.500" : "red.500"}
          mr={2}
        />
        {ativo ? "Ativado" : "Desativado"}
      </Button>
    </Tooltip>
  );
}
