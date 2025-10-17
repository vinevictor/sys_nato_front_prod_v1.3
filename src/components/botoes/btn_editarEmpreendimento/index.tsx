"use client";

import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { BsFillPencilFill } from "react-icons/bs";
import { ModalEditarEmpreendimento } from "@/components/modal/ModalEditarEmpreendimento";

interface BtnEditarEmpreendimentoProps {
  id: number;
  listConstrutora: any[];
  listEstado: any[];
}

/**
 * Botão para editar empreendimento
 *
 * Abre um modal com o formulário de edição ao ser clicado.
 *
 * @param id - ID do empreendimento a ser editado
 * @returns Botão de edição com modal
 */
export function BtnEditarEmpreendimento({ id, listConstrutora, listEstado }: BtnEditarEmpreendimentoProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip label="Editar Empreendimento" placement="top">
        <IconButton
          colorScheme="blue"
          variant="outline"
          icon={<BsFillPencilFill />}
          aria-label="Editar"
          onClick={onOpen}
          _hover={{
            bg: "blue.50",
            _dark: { bg: "blue.900" },
          }}
          _dark={{
            borderColor: "blue.600",
            color: "blue.400",
          }}
        />
      </Tooltip>

      <ModalEditarEmpreendimento id={id} isOpen={isOpen} onClose={onClose} lista={listConstrutora} listEstado={listEstado} />
    </>
  );
}
