"use client";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  Tooltip,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import React from "react";
import { RiMailSendLine } from "react-icons/ri";

interface BtnResetSenhaProps {
  ID: number;
}

export function BtnResetSenha({ ID }: BtnResetSenhaProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  async function handleReset(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/usuario/reset/${ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Senha resetada com sucesso!",
          status: "success",
          duration: 9000,
          isClosable: true
        });
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro!",
        description: "Ocorreu um erro ao resetar a senha!",
        status: "error",
        duration: 9000,
        isClosable: true
      });
      onClose();
    }
  }

  return (
    <>
      <Tooltip label="Resetar Senha">
        <IconButton
          colorScheme="blue"
          variant="outline"
          icon={<RiMailSendLine />}
          aria-label="Resetar Senha"
          onClick={onOpen}
        />
      </Tooltip>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Resetar Senha
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja resetar a senha? Você não pode desfazer esta ação depois.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleReset} ml={3}>
                Resetar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
