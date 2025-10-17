import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MdAddCircle } from "react-icons/md";
import { useEffect, useState } from "react";

interface ConstutoraType {
  id: number;
  razaosocial: string;
  cnpj: string;
  fantasia: string;
}

export default function ModalAddCobranca() {
  const [ConstutoraData, setConstutoraData] = useState<ConstutoraType[]>([]);
  const [Constutora, setConstutora] = useState(0);
  const [DataInicio, setDataInicio] = useState("");
  const [DataFim, setDataFim] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const HandleClose = () => {
    onClose();
    setConstutora(0);
    setDataInicio("");
    setDataFim("");
  }

  useEffect(() => {
    fetchConstutora();
  }, []);

  const fetchConstutora = async () => {
    try {
      const req = await fetch("/api/construtora/getall");
      const res = await req.json();
      setConstutoraData(res);
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as construtoras",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const HandleSubmit = async () => {
   try {
    setLoading(true);
    const body = {
      ConstrutoraId: Constutora,
      Inicio: DataInicio,
      Fim: DataFim
    }
    const response = await fetch("/api/relatorio/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    toast({
      title: "Cobrança adicionada com sucesso!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setLoading(false);
    HandleClose();
    window.location.reload();
   } catch (error) {
    setLoading(false);
    console.log(error);
    toast({
      title: "Erro",
      description: "Não foi possível adicionar a cobrança",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
   }
  };

  return (
    <>
      <Button
        leftIcon={<MdAddCircle size={20} />}
        bg="#3B82F6"
        color="white"
        size={{ base: "sm", md: "md" }}
        fontSize={{ base: "sm", md: "md" }}
        onClick={() => onOpen()}
        shadow="md"
        borderWidth="2px"
        borderColor="#3B82F6"
        _hover={{
          bg: "#2563EB",
          borderColor: "#2563EB",
          transform: "translateY(-2px)",
          shadow: "lg",
        }}
        _active={{
          transform: "translateY(0)",
          shadow: "md",
        }}
        _dark={{
          bg: "#3B82F6",
          borderColor: "#60A5FA",
          _hover: {
            bg: "#2563EB",
            borderColor: "#3B82F6",
          },
        }}
        transition="all 0.2s"
      >
        Nova Cobrança
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
          <ModalHeader>Nova Cobrança</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={4}>
            <Box>
              <Text>Selecione a Construtora</Text>
              <Select value={Constutora} onChange={(e) => setConstutora(Number(e.target.value))}>
                <option value={0}></option>
                {ConstutoraData.map((item: ConstutoraType) => (
                <option key={item.id} value={item.id}>{item.fantasia || item.razaosocial}</option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text>Informe a Data de inicio</Text>
              <Input type="date" value={DataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </Box>
            <Box>
              <Text>Informe Data de Fim</Text>
              <Input type="date" value={DataFim} onChange={(e) => setDataFim(e.target.value)} />
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
