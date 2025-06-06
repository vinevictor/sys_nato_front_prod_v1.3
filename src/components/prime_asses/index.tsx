"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { SetStateAction, useEffect, useState } from "react";
import { SenhaComponent } from "../Senha";

interface Props {
  session: SessionNext.Client | null;
}

export default function ModalPrimeAsses({ session }: Props) {
  const [Senha, setSenha] = useState("");
  const [ConfirmeSenha, setConfirmeSenha] = useState("");
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const primeiro_asseso = session?.reset_password;
  const ID = session?.id;

  useEffect(() => {
    if (primeiro_asseso) {
      (async () => {
        const request = await fetch(`/api/usuario/getId/${ID}`);
        const data = await request.json();
        if (data.reset_password) {
          onOpen();
        }
      })();
    }
  }, [ID, onOpen, primeiro_asseso]);

  const OverlayTwo = () => (
    <ModalOverlay bg="none" backdropFilter="auto" backdropInvert="80%" />
  );

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(Senha, ConfirmeSenha);

    if (Senha !== ConfirmeSenha) {
      toast({
        title: "Erro!",
        description: "As senhas devem ser iguais!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const data = {
      password: Senha,
    };

    const ID = session?.id;

    const request = await fetch(`/api/reset_password/${ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (request.ok) {
      toast({
        title: "Sucesso!",
        description: "Senha Alterada com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
    if (!request.ok) {
      toast({
        title: "Erro!",
        description: "Erro ao Alterar senha!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
        {OverlayTwo()}
        <ModalOverlay />
        <ModalContent bg={"gray.100"}>
          <ModalHeader>Atualização de senha</ModalHeader>
          <FormControl onSubmit={handleSubmit}>
            <ModalBody>
              <Box>
                <FormLabel>Nova senha</FormLabel>
                <SenhaComponent
                  onvalue={(e: SetStateAction<string>) => setSenha(e)}
                  setvalue={Senha}
                  envClick={undefined}
                />
              </Box>
              <Box mt={4}>
                <FormLabel>Confirmação de senha</FormLabel>
                <SenhaComponent
                  onvalue={(e: SetStateAction<string>) => setConfirmeSenha(e)}
                  setvalue={ConfirmeSenha}
                  envClick={handleSubmit}
                />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" mr={3} onClick={handleSubmit}>
                Salvar
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </FormControl>
        </ModalContent>
      </Modal>
    </>
  );
}
