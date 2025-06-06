"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface ButtonProps {
  id: number;
  N_nota: string;
}

export const BotaoSaveNota = ({ id, N_nota }: ButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const route = useRouter();
  const toast = useToast();

  const handlesalve = async () => {
    onClose();
    console.log(id);
    const res = await fetch(`/api/adm/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nota_fiscal: N_nota
      })
    });
    if (res.ok) {
      console.log(await res.json());
      route.refresh();
    } else {
      toast({
        title: "Erro!",
        description: "Erro ao salvar nota fiscal!",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <>
      <Button size={"xs"} colorScheme="green" onClick={onOpen}>
        Salvar
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="15px"
        />
        <ModalContent>
          <ModalHeader>Você tem certeza que deseja salvar?</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
          <ModalFooter
            w={"full"}
            display={"flex"}
            justifyContent={"end"}
            gap={2}
          >
            <Button onClick={onClose} colorScheme="cyan">
              Cancelar
            </Button>
            <Button onClick={handlesalve} colorScheme="green">
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
