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
  useToast
} from "@chakra-ui/react";
import { useFormStatus } from "react-dom";
import { BsFillTrashFill } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { BeatLoader } from "react-spinners";

interface BtnExcluirUserProps {
  id: number;
}

export function BtnExcluirUser({ id }: BtnExcluirUserProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const status = useFormStatus();
  const toast = useToast();

  const handleExcluir = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
    const response = await fetch(`/api/usuario/delete/${id}`, {
      method: "DELETE",
    });
    console.log(response);

      toast({
        title: "Sucesso!",
        description: "Usuario excluído com sucesso!",
        status: "success",
        duration: 9000,
        isClosable: true
      });

      onClose();
      window.location.reload();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Ocorreu um erro ao excluir o usuario!",
        status: "error",
        duration: 9000,
        isClosable: true
      });

      onClose();
    }
  };

  return (
    <>
      <Tooltip label="Excluir usuário">
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
            <Text fontWeight={"bold"} fontSize={"20px"} textAlign={"center"}>
              Você tem certeza de que deseja deletar Este usuario?
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
              isLoading={status.pending ? true : false}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Confirmar Exclusão
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
