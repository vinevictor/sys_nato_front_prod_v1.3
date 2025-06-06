"use client";

import useAlertContext from "@/hook/useAlertContext";
import { AuthUser } from "@/types/session";
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
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

interface BtCreateAlertClienteProps {
  DataSolicitacao: solictacao.SolicitacaoObjectCompleteType;
  user: AuthUser | null;
}

export function BtCreateAlertCliente({
  DataSolicitacao,
  user,
}: BtCreateAlertClienteProps) {
  const hierarquia = user?.hierarquia;
  const [Data, setData] = useState<
    solictacao.SolicitacaoObjectCompleteType | undefined
  >();
  const [Loading, setLoading] = useState(false);
  const [Descricao, setDescricao] = useState("");
  const toast = useToast();

  const { setAlert } = useAlertContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const OverlayTwo = () => (
    <ModalOverlay bg="none" backdropFilter="auto" backdropInvert="80%" />
  );

  useEffect(() => {
    if (DataSolicitacao) setData(DataSolicitacao);
  }, [DataSolicitacao]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    const data: AlertsType.AlertsProps = {
      corretor_id: Data?.corretor?.id,
      solicitacao_id: Data?.id,
      descricao: Descricao,
    };

    // Send a POST request to the /api/alerts/create endpoint with the data object.
    const request = await fetch(`/api/alerts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // If the request was successful, show a success toast message.
    if (request.ok) {
      toast({
        title: "Sucesso!",
        description: "Alerta criado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setAlert(true);
      setLoading(false);
      setTimeout(() => {
        setAlert(false);
      }, 100);
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
      setLoading(false);
    }
  };

  return (
    <>
      {hierarquia === "ADM" && (
        <>
          <Button
            colorScheme="yellow"
            variant="solid"
            size="sm"
            onClick={onOpen}
            isLoading={Loading}
            spinner={<BeatLoader size={8} color="black" />}
          >
            CRIAR ALERTA
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} isCentered size={"3xl"}>
            {OverlayTwo()}
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {Data?.nome &&
                  `Criar Alerta para ${Data?.nome} vendedor ${Data?.corretor?.nome}`}
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
                    isLoading={Loading}
                    spinner={<BeatLoader size={8} color="black" />}
                  >
                    Cancelar
                  </Button>
                  <Button
                    colorScheme="green"
                    mr={3}
                    onClick={handleSubmit}
                    isLoading={Loading}
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
