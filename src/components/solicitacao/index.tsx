"use client";
import { Flex } from "@chakra-ui/react";
import ModalConsultaRegistro from "@/components/modal-consulta-cpf";
import FormSolicitacao from "@/components/form/solicitacao";
import { useState } from "react";

export default function SolicitacaoSWITCH() {
  const [cpfChange, setCpfChange] = useState<string>("");
  const [isOpen, setIsOpen] = useState<Boolean>(true);
  const [solicitacao, setSolicitacao] = useState<any>(null);

  const onCpfChange = (cpf: string) => {
    setCpfChange(cpf);
  };
  const handleClose = (isOpen: boolean) => {
    setIsOpen(isOpen);
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
        {isOpen === true && (
          <Flex w={"full"} h={"full"} justifyContent={"center"}>
            <FormSolicitacao cpf={cpfChange} solicitacao={solicitacao} />
          </Flex>
        )}
      </Flex>
    </>
  );
}
