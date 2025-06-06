"use client";

import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";

interface BtnIniciarAtendimentoProps {
  hierarquia: string | null;
  status: boolean | null;
  aprovacao: string | null;
  id: number | null;
}

export default function BtnIniciarAtendimento({
  hierarquia,
  status: initialStatus,
  aprovacao,
  id,
}: BtnIniciarAtendimentoProps) {
  const [status, setStatus] = useState(initialStatus);
  const toast = useToast();

  const handleIniciarAtendimento = async () => {
    const req = await fetch(`/api/solicitacao/atendimento/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await req.json();
    if (!req.ok) {
      toast({
        title: "Erro ao iniciar atendimento",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    toast({
      title: "Atendimento iniciado com sucesso",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });

    setStatus(true);
  };

  const handleCancelarAtendimento = async () => {
    const req = await fetch(`/api/solicitacao/atendimento/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await req.json();
    if (!req.ok) {
      toast({
        title: "Erro ao cancelar atendimento",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    toast({
      title: "Atendimento cancelado com sucesso",
      status: "warning",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });

    setStatus(false);
  };

  return (
    <>
      {!["EMITIDO", "REVOGADO", "APROVADO"].includes(aprovacao ?? "") &&
        hierarquia === "ADM" && (
          <>
            {status ? (
              <Button
                size="sm"
                colorScheme="red"
                textColor={"black"}
                onClick={handleCancelarAtendimento}
              >
                CANCELAR ATENDIMENTO
              </Button>
            ) : (
              <Button
                size="sm"
                colorScheme="teal"
                textColor={"black"}
                onClick={handleIniciarAtendimento}
              >
                INICIAR ATENDIMENTO
              </Button>
            )}
          </>
        )}
    </>
  );
}
