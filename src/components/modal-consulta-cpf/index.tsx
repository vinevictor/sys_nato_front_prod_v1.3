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
  InputGroup,
  InputLeftElement,
  Icon,
  InputRightElement,
  useToast,
  Text,
  Link,
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
    router.push("/");
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
      } catch (error) {
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
    setIsOpen(false);
    onIsOpen(true);
  };
  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
      <ModalContent
        bg="white"
        borderRadius="2xl"
        boxShadow="xl"
        maxW="lg"
        p={6}
      >
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          color="teal.600"
          textAlign="center"
          borderBottomWidth="2px"
          borderColor="gray.200"
        >
          Forneça o CPF do cliente
        </ModalHeader>

        <ModalBody py={6}>
          <Box mb={6}>
            <FormLabel
              fontWeight="semibold"
              color="teal.600"
              fontSize="lg"
              mb={2}
            >
              CPF
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" pt={1.5}>
                <Icon as={FaIdCard} color="gray.400" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Digite o CPF"
                focusBorderColor="teal.400"
                bg="gray.50"
                borderRadius="md"
                pl={10}
                fontSize="md"
                _placeholder={{ color: "gray.500" }}
                h="12"
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
                        title: "Erro!",
                        description:
                          "Faltam caracteres no CPF! Por favor, digite o CPF corretamente.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                    }
                  }
                }}
              />
              <InputRightElement width="4.5rem" pt={1.5} pe={2}>
                <Button
                  colorScheme="teal"
                  px={2}
                  h="10"
                  onClick={() => handleSubmit()}
                >
                  <Icon as={IoSearch} boxSize={6} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>

          {solicitacoes.length >= 0 && (
            <Box mt={8}>
              {solexists === true && (
              <FormLabel
                fontWeight="semibold"
                color="teal.600"
                fontSize="lg"
                mb={4}
              >
                Solicitação existente
              </FormLabel>
              )}
              <List spacing={3}>
                {solicitacoes.map((item: any) => (
                  <Flex key={item.id} direction="column">
                    <Flex
                      key={item}
                      justify="space-between"
                      align="center"
                      p={4}
                      bg="gray.50"
                      borderRadius="md"
                      _hover={{ bg: "gray.100" }}
                      transition="all 0.2s ease"
                      boxShadow="sm"
                      flexDirection={{ base: "column", md: "row" }}
                    >
                      {session?.hierarquia === "ADM" ? (
                        <Link
                          href={`/solicitacoes/${item.id}`}
                          color="teal.600"
                          fontWeight="bold"
                          fontSize="md"
                          mb={{ base: 2, md: 0 }}
                        >
                          {item.nome}
                        </Link>
                      ) : (
                        <Link
                          href={`/solicitacoes/${item.id}`}
                          color="teal.600"
                          fontWeight="bold"
                          fontSize="md"
                          mb={{ base: 2, md: 0 }}
                        >
                          {item.nome}
                        </Link>
                      )}
                      {session?.hierarquia === "ADM" ? (
                        <Link
                          href={`/solicitacoes/${item.id}`}
                          color="teal.600"
                          fontWeight="semibold"
                          fontSize="sm"
                        >
                          {item.id}
                        </Link>
                      ) : (
                        <Link
                          href={`/solicitacoes/${item.id}`}
                          color="teal.600"
                          fontWeight="semibold"
                          fontSize="sm"
                        >
                          {item.id}
                        </Link>
                      )}
                    </Flex>
                    {session?.hierarquia === "ADM" && (
                      <Button
                        colorScheme="green"
                        size="sm"
                        h={"fit-content"}
                        p={1}
                        fontSize={"1xs"}
                        onClick={() => handleContinueWithData(item)}
                        borderTopRadius={0}
                      >
                        <Icon as={FaLongArrowAltUp} mr={1} />
                        Usar Informações desta solicitação
                        <Icon as={FaLongArrowAltUp} mr={1} />
                      </Button>
                    )}
                  </Flex>
                ))}
                {solicitacoes.length > 0 && session?.hierarquia !== "ADM" && (
                  <Flex
                    justify="space-between"
                    align="center"
                    p={4}
                    bg="orange.100"
                    borderRadius="md"
                    boxShadow="sm"
                    border="1px solid orange"
                    flexDirection={{ base: "column", md: "row" }}
                  >
                    <Text fontSize={"1xs"}>
                      <Icon as={IoWarning} color="orange.600" mr={2} />
                      Solicitação Já Existente, Favor Abrir um Chamado ou entrar
                      em contato com a nossa equipe.
                    </Text>
                  </Flex>
                )}
              </List>
            </Box>
          )}
        </ModalBody>

        <Divider />

        <ModalFooter mt={4}>
          <Flex justify="flex-end" w="full" gap={3}>
            {IsContinue && (
              <Button colorScheme="teal" onClick={() => handleContinue()}>
                Continuar cadastro
              </Button>
            )}
            <Button
              variant="outline"
              colorScheme="teal"
              onClick={() => handleClose()}
            >
              Fechar
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
