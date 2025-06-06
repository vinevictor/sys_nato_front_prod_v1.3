"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Text,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Flex,
  Link,
  Checkbox,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { useToast } from "@chakra-ui/react";

interface Props {
  session: SessionNext.Client;
}

export default function ModalTermos({ session }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [check, setCheck] = useState(false);
  const toast = useToast();

  const termosAceitos = session.termos;
  const idUser = Number(session.id);

  useEffect(() => {
    if (session) {
      if (!termosAceitos && idUser) {
        (async () => {
          try {
            const req = await fetch(`api/termo/get/${idUser}`);
            const res = await req.json();

            if (!req.ok) {
              throw new Error(res.message);
            }
            if (!res.termos) {
              onOpen();
            }
          } catch (error: any) {
            console.log(error);
            onOpen();
            toast({
              title: "Erro!",
              description: error.message,
              status: "error",
              duration: 8000,
              isClosable: true,
            });
          }
        })();
      }
    }
  }, [onOpen, termosAceitos, idUser, toast]);
  const handleCheckboxChange = (e: any) => {
    setCheck(e.target.checked);
  };

  const handleSubmit = async () => {
    try {
      const data = await fetch(`api/termo/update/${idUser}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ termoAceito: check }),
      });
      const res = await data.json();

      if (!data.ok) {
        throw new Error(res.message);
      }
      onClose();
      toast({
        title: "Política de Privacidade e Termos de uso Aceito!",
        description: res.message,
        status: "success",
        duration: 5000,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Erro!",
        description: `Ops ocorreu um erro inesperado erro: ${error.message}`,
        status: "error",
        duration: 8000,
      });
      setTimeout(() => {
        onClose();
      }, 5000);
    }
  };

  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.4)" />
      <ModalContent p={6}>
        <Flex
          flexDirection={"column"}
          gap={2}
          alignItems={"center"}
          textAlign={"center"}
        >
          <ModalHeader fontSize={"2xl"}>
            Política de Privacidade <br /> e Termos de uso
          </ModalHeader>
          <Text fontSize={"sm"}>
            Para continuar utilizando nossos serviços é necessário aceitar
            nossos termos de uso e política de privacidade.
          </Text>
          <FiFileText size={"50px"} />
          <Flex flexDirection={"column"}>
            <Link href="/termos/uso" color={"blue"} isExternal>
              Política de Privacidade
            </Link>
            <Link href="/termos/privacidade" color={"blue"} isExternal>
              Termos de uso
            </Link>
          </Flex>
          <ModalBody>
            <Checkbox
              size="lg"
              colorScheme="green"
              onChange={handleCheckboxChange}
              isChecked={check}
            >
              <Text fontSize={"sm"}>
                Declaro que li e aceito as Políticas de Privacidade e Termos de
                Uso.
              </Text>
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                handleSubmit();
              }}
              isDisabled={!check}
            >
              Aceitar e Continuar
            </Button>
          </ModalFooter>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
