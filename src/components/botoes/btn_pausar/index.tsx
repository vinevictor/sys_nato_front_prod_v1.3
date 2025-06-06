"use client";
import { Button, Tooltip, useToast } from "@chakra-ui/react";
import { useState } from "react";

interface BotaoPausarProps {
  id: number | null;
  statusPause: boolean | null;
}

export default function BotaoPausar({ id, statusPause }: BotaoPausarProps) {
  const [pause, setPause] = useState(statusPause);

  const toast = useToast();

  const handleOnClick = async () => {
    if (pause) {
      const dados = {
        pause: false,
        reativar: true,
      };
      const req = await fetch(`/api/solicitacao/pause/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });
      if (!req.ok) {
        toast({
          position: "top",
          title: "Erro ao reativar solicitação!",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          position: "top",
          title: "Solicitação reativada com sucesso!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setPause(false);
      }
    } else {
      const dados = {
        pause: true,
      };
      const req = await fetch(`/api/solicitacao/pause/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!req.ok) {
        toast({
          position: "top",
          title: "Erro ao pausar solicitação!",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          position: "top",
          title: "Solicitação pausada com sucesso!",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
        setPause(true);
      }
    }
  };

  return (
    <>
      <Tooltip
        label={`Botão para congelar o tempo do cliente no sistema, quando despausado volta ao fluxo normal.`}
        bg={"yellow.700"}
      >
        <Button
          textColor={"black"}
          size="sm"
          colorScheme="yellow"
          onClick={handleOnClick}
        >
          {pause ? "DESPAUSAR" : "PAUSAR"}
        </Button>
      </Tooltip>
    </>
  );
}
