import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

export default function ModalAddAlerta() {
  const [TipoAlerta, setTipoAlerta] = useState("");
  const [Message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const HandleClose = () => {
    onClose();
    setTipoAlerta("");
    setMessage("");
  }

  const HandleSubmit = async () => {
    try {
      setLoading(true);
      const body = {
        descricao: Message,
      }
      const response = await fetch("/api/bug_report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao adicionar alerta");
      }
      toast({
        title: "Alerta adicionado com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      HandleClose();
      window.location.reload();
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast({
        title: "Erro",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <Button
        colorScheme="red"
        size="md"
        variant={"outline"}
        onClick={() => onOpen()}
      >
        Alerta Geral
      </Button>
      <Modal
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader>Novo Alerta</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={4}>
            <Box>
              <Text>Informe a Mensagem</Text>
              <Textarea onChange={(e) => setMessage(e.target.value)} />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button isLoading={loading} onClick={HandleClose}>Cancelar</Button>
            <Button isLoading={loading} colorScheme="blue" onClick={HandleSubmit}>Confirmar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
