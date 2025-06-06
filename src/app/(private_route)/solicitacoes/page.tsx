"use client";

import FormSolicitacao from "@/components/form/solicitacao";
import ModalConsultaRegistro from "@/components/modal-consulta-cpf";
import { Flex } from "@chakra-ui/react";
import { useState } from "react";

export default function Solicitacao() {
  const [cpfChange, setCpfChange] = useState<string>("");
  const [isOpen, setIsOpen] = useState<Boolean>(true);

  const onCpfChange = (cpf: string) => {
    setCpfChange(cpf);
  };
  const handleClose = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <Flex>
      <ModalConsultaRegistro
        onIsOpen={handleClose}
        setCpfChange={cpfChange}
        onCpfChange={onCpfChange}
      />
      {isOpen === true && (
        <Flex w={"full"} h={"full"} justifyContent={"center"}>
          <FormSolicitacao cpf={cpfChange} />
        </Flex>
      )}
    </Flex>
  );
}
