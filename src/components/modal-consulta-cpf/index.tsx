"use client";
import {
  Box,
  Button,
  Divider,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  List,
  Flex,
  VStack,
  InputGroup,
  InputLeftElement,
  Icon,
  InputRightElement,
  useToast,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaIdCard, FaLongArrowAltUp } from "react-icons/fa";
import { IoSearch, IoWarning } from "react-icons/io5";
import { cpf as ChekCpf } from "cpf-cnpj-validator";
import { useEffect, useState } from "react";
import { mask, unMask } from "remask";
import { useRouter } from "next/navigation";
import { useSession } from "@/hook/useSession";

interface CpfProps {
  onCpfChange: (cpf: string) => void;
  setCpfChange: string | null;
  onIsOpen: (isOpen: boolean) => void;
  onSolicitacao: (solicitacao: any) => void;
}

export default function ModalConsultaRegistro({
  setCpfChange,
  onCpfChange,
  onIsOpen,
  onSolicitacao,
}: CpfProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [CPF, setCPF] = useState("");
  const [CPFMask, setCPFMask] = useState("");
  const toast = useToast();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [IsContinue, setIsContinue] = useState(false);
  const [solexists, setsolExists] = useState(false);
  const router = useRouter();

  const session = useSession();
  useEffect(() => {
    if (!setCpfChange) {
      setIsOpen(true);
    }
  }, [isOpen, setCpfChange]);

  const handleClose = () => {
    router.push("/home");
  };

  const handleSubmit = async () => {
    const IsValdCpf = ChekCpf.isValid(CPF);
    if (!CPF) {
      toast({
        title: "Erro!",
        description: "O CPF é obrigatório!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else if (CPF.length < 11) {
      toast({
        title: "Erro!",
        description: "Faltam caracteres no CPF!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else if (!IsValdCpf) {
      toast({
        title: "Erro!",
        description: "CPF inválido!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      try {
        const request = await fetch(`/api/consulta/cpf/${CPF}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (request.ok) {
          const response = await request.json();

          if (response.cpf) {
            setSolicitacoes(response.solicitacoes);
            toast({
              title: "CPF já cadastrado!",
              description: response.message,
              status: "warning",
              duration: 3000,
              isClosable: true,
            });
            setIsContinue(false);
            onCpfChange(CPF);
          } else {
            setSolicitacoes(response.solicitacoes);
            setsolExists(true);
            toast({
              title: "CPF disponível.",
              description: response.message,
              status: "success",
              duration: 3000,
              isClosable: true,
              
            });
            setIsContinue(true);
            onCpfChange(CPF);
          }
        }
      } catch (error: any) {
        toast({
          title: "Erro!",
          description: "Erro ao verificar o CPF!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  const handleContinueWithData = (item: any) => {
    onSolicitacao(item);
    setIsOpen(false);
    onIsOpen(true);
  };

  const handleContinue = () => {
    console.log("handleContinue");
    setIsOpen(false);
  };

  // Cores responsivas ao tema
  const bgModal = useColorModeValue("white", "gray.800");
  const bgInput = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("#023147", "gray.100");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const labelColor = useColorModeValue("#023147", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("#00713D", "green.400");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const itemBg = useColorModeValue("gray.50", "gray.700");
  const linkColor = useColorModeValue("#00713D", "green.400");
  const warningBg = useColorModeValue("orange.50", "orange.900");
  const warningBorder = useColorModeValue("orange.200", "orange.600");
  const warningIcon = useColorModeValue("orange.600", "orange.300");

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {}} 
      isCentered 
      size="xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent
        bg={bgModal}
        borderRadius="xl"
        boxShadow="2xl"
        maxW="600px"
        mx={4}
      >
        <ModalHeader pt={6} pb={4}>
          <VStack spacing={2} align="center">
            <Box
              p={3}
              bg="green.100"
              _dark={{ bg: "green.900" }}
              borderRadius="full"
            >
              <Icon as={FaIdCard} fontSize="24" color={iconColor} />
            </Box>
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Consulta de CPF
            </Text>
            <Text fontSize="sm" color={subtextColor} textAlign="center">
              Digite o CPF do cliente para iniciar uma nova solicitação
            </Text>
          </VStack>
        </ModalHeader>

        <ModalBody px={6} py={4}>
          <VStack spacing={4} w="full">
            <Box w="full">
              <FormLabel
                fontSize="sm"
                fontWeight="medium"
                color={labelColor}
                mb={2}
              >
                CPF do Cliente
              </FormLabel>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaIdCard} color={iconColor} />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="000.000.000-00"
                  focusBorderColor="#00713D"
                  bg={bgInput}
                  color={textColor}
                  borderRadius="lg"
                  fontSize="md"
                  _placeholder={{ color: placeholderColor }}
                  border="2px"
                  borderColor={borderColor}
                  _hover={{ borderColor: "#00713D" }}
                  value={CPFMask}
                  onChange={(e) => {
                    const valor = e.target.value;
                    const valorLimpo = unMask(valor);
                    const masked = mask(valorLimpo, ["999.999.999-99"]);
                    setCPFMask(masked);
                    setCPF(valorLimpo);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (CPF.length == 11) {
                        handleSubmit();
                      } else {
                        toast({
                          title: "Atenção!",
                          description: "Por favor, digite o CPF completo.",
                          status: "warning",
                          duration: 3000,
                          isClosable: true,
                          position: "top-right",
                        });
                      }
                    }
                  }}
                />
                <InputRightElement width="auto" pr={2}>
                  <Button
                    bg="#00713D"
                    _hover={{ bg: "#00631B" }}
                    color="white"
                    size="md"
                    onClick={() => handleSubmit()}
                    leftIcon={<Icon as={IoSearch} />}
                  >
                    Buscar
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Text fontSize="xs" color={subtextColor} mt={2}>
                Digite apenas números ou use o formato com pontos e traço
              </Text>
            </Box>

            {solicitacoes.length > 0 && (
              <Box w="full" mt={4}>
                {solexists === true && (
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color={labelColor}
                    mb={3}
                  >
                    Solicitações Existentes
                  </Text>
                )}
                <List spacing={2}>
                  {solicitacoes.map((item: any) => (
                    <Flex key={item.id} direction="column" w="full">
                      <Flex
                        justify="space-between"
                        align="center"
                        p={3}
                        bg={itemBg}
                        borderRadius="lg"
                        _hover={{ bg: hoverBg }}
                        transition="all 0.2s ease"
                        border="1px"
                        borderColor={borderColor}
                        flexDirection={{ base: "column", sm: "row" }}
                        gap={2}
                      >
                        <Link
                          href={`/solicitacoes/${item.id}`}
                          color={linkColor}
                          fontWeight="bold"
                          fontSize="md"
                          _hover={{ textDecoration: "underline" }}
                          flex={1}
                        >
                          {item.nome}
                        </Link>
                        <Link
                          href={`/solicitacoes/${item.id}`}
                          color={subtextColor}
                          fontWeight="medium"
                          fontSize="sm"
                          _hover={{ color: linkColor }}
                        >
                          ID: {item.id}
                        </Link>
                      </Flex>
                      {session?.hierarquia === "ADM" && (
                        <Button
                          bg="#00713D"
                          _hover={{ bg: "#00631B" }}
                          color="white"
                          size="sm"
                          onClick={() => handleContinueWithData(item)}
                          borderTopRadius={0}
                          borderBottomRadius="lg"
                          leftIcon={<Icon as={FaLongArrowAltUp} />}
                          rightIcon={<Icon as={FaLongArrowAltUp} />}
                        >
                          Usar Informações desta Solicitação
                        </Button>
                      )}
                    </Flex>
                  ))}
                  {solicitacoes.length > 0 && session?.hierarquia !== "ADM" && (
                    <Flex
                      align="center"
                      p={3}
                      bg={warningBg}
                      borderRadius="lg"
                      border="1px"
                      borderColor={warningBorder}
                      gap={2}
                    >
                      <Icon as={IoWarning} color={warningIcon} fontSize="20" />
                      <Text fontSize="sm" color={textColor}>
                        Solicitação já existente. Favor abrir um chamado ou entrar em contato com nossa equipe.
                      </Text>
                    </Flex>
                  )}
                </List>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter px={6} pb={6} pt={4}>
          <Flex justify="flex-end" w="full" gap={3} flexWrap="wrap">
            {IsContinue && (
              <Button
                bg="#00713D"
                _hover={{ bg: "#00631B" }}
                color="white"
                onClick={() => handleContinue()}
                flex={{ base: 1, sm: "none" }}
                minW={{ sm: "150px" }}
              >
                Continuar Cadastro
              </Button>
            )}
            <Button
              variant="outline"
              borderColor="#00713D"
              color="#00713D"
              _hover={{ bg: "gray.50" }}
              _dark={{ _hover: { bg: "gray.700" } }}
              onClick={() => handleClose()}
              flex={{ base: 1, sm: "none" }}
              minW={{ sm: "100px" }}
            >
              Fechar
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
