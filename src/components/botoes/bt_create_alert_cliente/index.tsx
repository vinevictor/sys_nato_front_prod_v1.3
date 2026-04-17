"use client";

import useAlertContext from "@/hook/useAlertContext";
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

interface BtCreateAlertClienteProps {
  corretorId: number;
  solicitacaoId: number;
  solicitacaoNome: string;
  isAdmin: boolean;
}

export function BtCreateAlertCliente({
  corretorId,
  solicitacaoId,
  solicitacaoNome,
  isAdmin,
}: BtCreateAlertClienteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [Descricao, setDescricao] = useState("");

  const { setAlert } = useAlertContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();


  const handleSubmit = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();

    if (!Descricao.trim()) {
      toast({
        title: "Atenção",
        description: "Escreva uma descrição para o alerta.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!corretorId) {
      toast({
        title: "Erro",
        description: "Esta solicitação não possui um corretor vinculado!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        corretor_id: corretorId,
        solicitacao_id: solicitacaoId,
        descricao: Descricao,
      };

      const request = await fetch(`/api/alerts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await request.json();

      if (request.ok) {
        toast({
          title: "Sucesso!",
          description: "Alerta criado e enviado via WhatsApp!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setDescricao("");
        setAlert(true);
        onClose();

        setTimeout(() => {
          setAlert(false);
        }, 1000);
      } else {
        throw new Error(responseData.message || "Erro ao criar alerta");
      }
    } catch (error: any) {
      toast({
        title: "Erro!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isAdmin && (
        <>
          <Button
            colorScheme="yellow"
            variant="solid"
            size="sm"
            onClick={onOpen}
            isLoading={isLoading}
            spinner={<BeatLoader size={8} color="black" />}
          >
            CRIAR ALERTA
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} isCentered size={"3xl"}>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent>
              <ModalHeader color="#023147">
                {solicitacaoNome
                  ? `Criar Alerta para: ${solicitacaoNome}`
                  : "Criar Novo Alerta"}
              </ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <FormControl id="text" isRequired>
                    <FormLabel fontWeight="bold">
                      O que o corretor precisa saber?
                    </FormLabel>
                    <Textarea
                      value={Descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Descreva o problema ou a ação necessária aqui..."
                      size="lg"
                      minH="150px"
                      focusBorderColor="green.500"
                    />
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  isDisabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  colorScheme="green"
                  ml={3}
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  spinner={<BeatLoader size={8} color="white" />}
                  isDisabled={!Descricao.trim()}
                >
                  Enviar Alerta
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}
