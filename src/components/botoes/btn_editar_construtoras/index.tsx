"use client";

import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { BsFillPencilFill } from "react-icons/bs";
import ModalEditarConstrutora from "@/components/construtoraCard/modal";

interface BtnEditarConstrutoraProps {
  id: number;
}

export function BtnEditarConstrutora({ id }: BtnEditarConstrutoraProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip label="Editar Construtora">
        <IconButton
          colorScheme="blue"
          variant="outline"
          icon={<BsFillPencilFill />}
          aria-label="Edit"
          onClick={onOpen}
        />
      </Tooltip>

      <ModalEditarConstrutora
        isOpen={isOpen}
        onClose={onClose}
        construtoraId={id}
      />
    </>
  );
}
