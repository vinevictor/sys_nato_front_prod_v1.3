"use client";

import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { BsFillPencilFill } from "react-icons/bs";
import { ModalEditarFinanceira } from "@/components/financeirasCard/modal";

interface BtnEditarFinanceiraProps {
  id: number;
}

/**
 * Botão para editar financeira que abre modal
 * Segue o padrão visual dos botões de empreendimento
 */
export function BtnEditarFinanceira({ id }: BtnEditarFinanceiraProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip label="Editar Financeira">
        <IconButton
          colorScheme="blue"
          variant="outline"
          icon={<BsFillPencilFill />}
          aria-label="Editar Financeira"
          onClick={onOpen}
        />
      </Tooltip>

      <ModalEditarFinanceira id={id} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
