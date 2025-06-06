"use client";

import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BsFillTrashFill } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";

interface BtnExcluirUserProps {
  id?: number;
  status?: boolean;
}
export default function BtmExcluirConstrutora({
  id,
  status,
}: BtnExcluirUserProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const route = useRouter();

  const handleExcluir = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/construtora/delete/${id}`, {
        method: "DELETE",
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message);
      }
      toast({
        title: "Sucesso!",
        description: "Construtora excluído com sucesso!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      route.refresh();
      onClose();
    } catch (error: any) {
      onClose();
      toast({
        title: "Erro!",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {status ? (
        <>
          <Tooltip label="Excluir Construtora">
            <IconButton
              colorScheme="red"
              variant="outline"
              icon={<BsFillTrashFill />}
              aria-label="Delete"
              onClick={onOpen}
            />
          </Tooltip>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />

            <ModalContent>
              <ModalBody p={10}>
                <Text
                  fontWeight={"bold"}
                  fontSize={"20px"}
                  textAlign={"center"}
                >
                  Você tem certeza de que deseja deletar Esta Construtora?
                </Text>
              </ModalBody>

              <ModalFooter>
                <Button leftIcon={<MdOutlineCancel />} onClick={onClose}>
                  Cancelar
                </Button>

                <Button
                  leftIcon={<BsFillTrashFill />}
                  onClick={handleExcluir}
                  colorScheme="red"
                >
                  Confirmar Exclusão
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : null}
    </>
  );
}
