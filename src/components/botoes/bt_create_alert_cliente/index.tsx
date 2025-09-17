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

  const OverlayTwo = () => (
    <ModalOverlay bg="none" backdropFilter="auto" backdropInvert="80%" />
  );


  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    if (!corretorId) {
      toast({
        title: "Erro",
        description: "Defina um corretor para criar um alerta!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      // return;
    }

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

    if (request.ok) {
      toast({
        title: "Sucesso!",
        description: "Alerta criado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setAlert(true);
      setIsLoading(false);
      setTimeout(() => {
        setAlert(false);
      }, 1000);
      // window.location.reload();
      onClose();
    }

    // Close the modal.
    if (!request.ok) {
      // If there was an error, show an error toast message.
      toast({
        title: "Erro!",
        description: "Erro ao criar alerta!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      { isAdmin && (
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
            {OverlayTwo()}
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {solicitacaoNome &&
                  `Criar Alerta para solicitacao ${solicitacaoNome}`}
              </ModalHeader>
              <ModalCloseButton />
              <FormControl>
                <ModalBody>
                  <FormControl id="text" isRequired mt={4}>
                    <FormLabel>Descrição</FormLabel>
                    <Textarea
                      value={Descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Digite o texto"
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    isLoading={isLoading}
                    spinner={<BeatLoader size={8} color="black" />}
                  >
                    Cancelar
                  </Button>
                  <Button
                    colorScheme="green"
                    mr={3}
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    spinner={<BeatLoader size={8} color="black" />}
                  >
                    Enviar
                  </Button>
                </ModalFooter>
              </FormControl>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}
