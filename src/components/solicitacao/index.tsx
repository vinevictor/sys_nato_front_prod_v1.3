"use client";
import { Flex } from "@chakra-ui/react";
import ModalConsultaRegistro from "@/components/modal-consulta-cpf";
import FormSolicitacao from "@/components/form/solicitacao";
import { useState } from "react";
import { Session } from "@/types/session";

interface switchProps {
  session: Session.SessionServer;
}

export default function SolicitacaoSWITCH({ session }: switchProps) {
  const [cpfChange, setCpfChange] = useState<string>("");
  const [solicitacao, setSolicitacao] = useState<any>(null);

  const onCpfChange = (cpf: string) => {
    setCpfChange(cpf);
  };

  const handleClose = () => {
    // Função placeholder para controle do modal
    setCpfChange("");
    setSolicitacao(null);
  };

  return (
    <>
      <Flex>
        <ModalConsultaRegistro
          onIsOpen={handleClose}
          setCpfChange={cpfChange}
          onCpfChange={onCpfChange}
          onSolicitacao={setSolicitacao}
        />
        {cpfChange && (
          <Flex w={"full"} h={"full"} justifyContent={"center"}>
            <FormSolicitacao
              cpf={cpfChange}
              solicitacao={solicitacao}
              session={session}
            />
          </Flex>
        )}
      </Flex>
    </>
  );
}
