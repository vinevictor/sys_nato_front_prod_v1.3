"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  MdAccountBalance,
  MdBusiness,
  MdFileCopy,
  MdShare,
} from "react-icons/md";
import { Session } from "@/types/session";
import { BeatLoader } from "react-spinners";

interface CompartilharModalProps {
  session: Session.SessionServer | null;
}

interface Empreendimento {
  id: number;
  nome: string;
}

interface Financeiro {
  id: number;
  fantasia: string;
  direto: boolean;
}

export const CompartilharModal = ({ session }: CompartilharModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalEmpreendimento, setModalEmpreendimento] = useState<number | null>(
    null
  );
  const [modalFinanceiro, setModalFinanceiro] = useState<number | null>(null);
  const [dataEmpreendimento, setDataEmpreendimento] = useState<
    Empreendimento[]
  >([]);
  const [dataFinanceiro, setDataFinanceiro] = useState<Financeiro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [link, setLink] = useState<string>("");

  // Buscar dados quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setIsLoading(true); // Moved to the beginning of fetchData
    if (dataEmpreendimento.length === 0) {
      toast({
        title: "Erro ao carregar dados",
        description:
          "Você não possui empreendimentos cadastrados, entre em contato com o suporte",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "top-right",
      });
      // onClose(); // Removed to allow the modal to open even if one list is empty
    }
    if (dataFinanceiro.length === 0) {
      toast({
        title: "Erro ao carregar dados",
        description:
          "Você não possui CCa cadastrados, entre em contato com o suporte",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "top-right",
      });
      // onClose(); // Removed to allow the modal to open even if one list is empty
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (modalEmpreendimento && modalFinanceiro) HandleGetUrl();
  }, [modalEmpreendimento, modalFinanceiro]);

  const handleClose = () => {
    setModalEmpreendimento(null);
    setModalFinanceiro(null);
    onClose();
  };

  const HandleGetUrl = async () => {
    setIsSubmitting(true);
    fetch(`/api/direto/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        financeiroId: modalFinanceiro,
        empreendimentoId: modalEmpreendimento,
        baseUrl: "https://sisnato.redebrasilrp.com.br/direto/cadastro",
      }),
    })
      .then(async (res) => {
        setIsSubmitting(false);
        const data = await res.json();
        setLink(data.link);
      })
      .catch((error) => {
        setIsSubmitting(false);
        toast({
          title: "Erro ao gerar link",
          description: "Erro ao gerar link. error: " + error,
          status: "error",
          duration: 6000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  useEffect(() => {
    if (!session) return;
    const user = session?.user;
    const empreendimentoList = user?.empreendimento;
    const financeiroList = user?.Financeira;
    const filter = financeiroList.filter((item) => item.direto === true);
    setDataEmpreendimento(empreendimentoList || []);
    setDataFinanceiro(filter || []);
  }, [session]);
  
  const ColorLoader = () => {
    const theme = useColorModeValue("light", "dark");
    if (theme === "light") {
      return "#00713D";
    } else {
      return "#00d672";
    }
  };

  return (
    <>
      <Button
        leftIcon={<Icon as={MdShare} />}
        colorScheme="green"
        bg="#00713D"
        color="white"
        minW="140px"
        size="sm"
        transition="all 0.2s"
        _hover={{
          bg: "#005a31",
          transform: "translateY(-2px)",
          shadow: "lg",
        }}
        _active={{ transform: "translateY(0)" }}
        _dark={{
          bg: "#00d672",
          color: "gray.900",
          _hover: { bg: "#00c060" },
        }}
        onClick={onOpen}
      >
        Compartilhar
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="xl"
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent
          bg="white"
          _dark={{ bg: "gray.800" }}
          borderRadius="xl"
          shadow="2xl"
        >
          <ModalHeader
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color="#023147"
            borderBottomWidth="1px"
            borderBottomColor="gray.200"
            _dark={{ color: "gray.100", borderBottomColor: "gray.700" }}
          >
            Compartilhar Link Direto
          </ModalHeader>
          <ModalCloseButton
            _hover={{ bg: "red.100", color: "red.600" }}
            _dark={{ _hover: { bg: "red.900", color: "red.300" } }}
          />

          <ModalBody py={6}>
            <Text
              fontSize="sm"
              color="gray.600"
              _dark={{ color: "gray.400" }}
              mb={6}
            >
              Selecione o empreendimento e a financeira (CCA) para gerar o link
              de compartilhamento.
            </Text>

            <FormControl isRequired mb={4}>
              <FormLabel
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Empreendimento
              </FormLabel>
              <Select
                placeholder="Selecione o empreendimento..."
                value={modalEmpreendimento?.toString() ?? ""}
                onChange={(e) => setModalEmpreendimento(Number(e.target.value))}
                bg="white"
                color="gray.800"
                borderColor="gray.300"
                icon={<MdBusiness />}
                size="lg"
                isDisabled={isLoading}
                _hover={{ borderColor: "green.500" }}
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                }}
                _dark={{
                  bg: "gray.800",
                  borderColor: "gray.600",
                  color: "gray.100",
                  _hover: { borderColor: "#00d672" },
                  _focus: {
                    borderColor: "#00d672",
                    boxShadow: "0 0 0 1px #00d672",
                  },
                }}
                sx={{
                  "& option": {
                    bg: "white",
                    color: "gray.800",
                  },
                  "&:is([data-theme='dark']) option, .chakra-ui-dark & option":
                    {
                      bg: "gray.800",
                      color: "gray.100",
                    },
                }}
              >
                {dataEmpreendimento.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Financeira (CCA)
              </FormLabel>
              <Select
                placeholder="Selecione a financeira..."
                value={modalFinanceiro?.toString() ?? ""}
                onChange={(e) => setModalFinanceiro(Number(e.target.value))}
                bg="white"
                color="gray.800"
                borderColor="gray.300"
                icon={<MdAccountBalance />}
                size="lg"
                isDisabled={isLoading}
                _hover={{ borderColor: "green.500" }}
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                }}
                _dark={{
                  bg: "gray.800",
                  borderColor: "gray.600",
                  color: "gray.100",
                  _hover: { borderColor: "#00d672" },
                  _focus: {
                    borderColor: "#00d672",
                    boxShadow: "0 0 0 1px #00d672",
                  },
                }}
                sx={{
                  "& option": {
                    bg: "white",
                    color: "gray.800",
                  },
                  "&:is([data-theme='dark']) option, .chakra-ui-dark & option":
                    {
                      bg: "gray.800",
                      color: "gray.100",
                    },
                }}
              >
                {dataFinanceiro.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fantasia}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Link
              </FormLabel>
              <InputGroup size="lg" display="flex" alignItems="center">
                {isSubmitting ? (
                  <BeatLoader size={10} color={ColorLoader()} />
                ) : (
                  <Text fontSize="lg">
                    {link
                      ? link.length > 46
                        ? `${link.slice(0, 46)}.....`
                        : link
                      : ""}
                  </Text>
                )}
                <InputRightElement width="4.5rem">
                  <Button
                    h="32px"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(link);
                      toast({
                        title: "Link copiado!",
                        description:
                          "Link copiado para a área de transferência.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      });
                    }}
                    bg="transparent"
                  >
                    <MdFileCopy size={20} />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {/* <Button
              variant="outline"
              colorScheme="gray"
              size="lg"
              mr={3}
              onClick={handleClose}
              isDisabled={isSubmitting}
              borderColor="gray.300"
              _hover={{ bg: "gray.100" }}
              _dark={{ borderColor: "gray.600", _hover: { bg: "gray.700" } }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              bg="#00713D"
              size="lg"
              isLoading={isSubmitting}
              loadingText="Gerando..."
              onClick={handleCompartilhar}
              _hover={{ bg: "#005a31" }}
              _dark={{
                bg: "#00d672",
                color: "gray.900",
                _hover: { bg: "#00c060" },
              }}
            >
              Gerar Link
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
