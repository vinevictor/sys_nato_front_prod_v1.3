"use client";

import {
  buscarSolicitacaoPreview,
  vincularVoucher,
} from "@/actions/voucher/voucherActions";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
  Text,
  Box,
  Spinner,
  Badge,
  InputGroup,
  InputRightElement,
  Card,
  CardBody,
  IconButton,
  Flex,
  Divider,
  SimpleGrid,
  Heading,
  useClipboard,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaSearch, FaUser, FaCheckCircle, FaCopy } from "react-icons/fa";

interface LinkVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ModalStep = "SEARCH" | "LIST" | "CONFIRM" | "SUCCESS";

interface LinkedResult {
  voucher: string;
  cliente: string;
  origem: string;
}

export function LinkVoucherModal({
  isOpen,
  onClose,
  onSuccess,
}: LinkVoucherModalProps) {
  const [step, setStep] = useState<ModalStep>("SEARCH");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<any>(null);

  const [linkedData, setLinkedData] = useState<LinkedResult | null>(null);

  const { onCopy, hasCopied } = useClipboard(linkedData?.voucher || "");

  const toast = useToast();

  // --- CORES ADAPTÁVEIS (LIGHT / DARK) ---
  const bgCard = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.500", "gray.400");
  const hoverBorderColor = useColorModeValue("blue.400", "blue.300");
  const hoverBgColor = useColorModeValue("blue.50", "gray.600");

  // Card de Sucesso
  const successBg = useColorModeValue("green.50", "rgba(72, 187, 120, 0.1)"); // Verde suave
  const successBorder = useColorModeValue("green.400", "green.500");
  const successText = useColorModeValue("green.700", "green.200");

  const handleClose = () => {
    setStep("SEARCH");
    setSearchTerm("");
    setSelectedSolicitacao(null);
    setSearchResults([]);
    setLinkedData(null);
    onClose();
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setSelectedSolicitacao(null);
    setSearchResults([]);

    try {
      const resultados = await buscarSolicitacaoPreview(searchTerm);

      if (resultados && resultados.length > 0) {
        if (resultados.length === 1) {
          setSelectedSolicitacao(resultados[0]);
          setStep("CONFIRM");
        } else {
          setSearchResults(resultados);
          setStep("LIST");
        }
      } else {
        toast({
          title: "Não encontrado",
          description: "Nenhuma solicitação encontrada com esse ID ou Nome.",
          status: "warning",
        });
      }
    } catch (error) {
      toast({ title: "Erro na busca", status: "error" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectFromList = (item: any) => {
    setSelectedSolicitacao(item);
    setStep("CONFIRM");
  };

  const handleConfirmLink = async () => {
    if (!selectedSolicitacao) return;

    if (!selectedSolicitacao.id_fcw) {
      toast({
        title: "Atenção",
        description:
          "Este cliente não possui ID FCWEB. Gere a ficha antes de vincular.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLinking(true);
    try {
      const result = await vincularVoucher({
        solicitacaoId: selectedSolicitacao.id,
        fcw2Id: selectedSolicitacao.id_fcw || 0,
        nome: "",
        cpf: "",
        usuarioId: 1,
      });

      setLinkedData(result);
      onSuccess();
      setStep("SUCCESS");
    } catch (error: any) {
      toast({
        title: "Erro ao vincular",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={step === "SUCCESS" ? "md" : "lg"}
      closeOnOverlayClick={step !== "SUCCESS"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {step === "SUCCESS" ? "Voucher Vinculado!" : "Vincular Voucher"}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          {/* PASSO 1: BUSCA */}
          {step === "SEARCH" && (
            <VStack spacing={4}>
              <Text fontSize="sm" color={labelColor}>
                Busque pelo <b>ID da venda</b> ou pelo <b>Nome do cliente</b>.
              </Text>
              <FormControl>
                <FormLabel>ID ou Nome do Cliente</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="Ex: 1050 ou Ariel Silva"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    autoFocus
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Buscar"
                      icon={isSearching ? <Spinner size="sm" /> : <FaSearch />}
                      size="sm"
                      onClick={handleSearch}
                      variant="ghost"
                      colorScheme="blue"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </VStack>
          )}

          {/* PASSO 2: LISTA */}
          {step === "LIST" && (
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="bold" color={labelColor}>
                Selecione o cliente correto:
              </Text>
              <Box maxH="300px" overflowY="auto" pr={1}>
                {searchResults.map((item) => (
                  <Card
                    key={item.id}
                    variant="outline"
                    mb={2}
                    cursor="pointer"
                    bg={bgCard}
                    borderColor={borderColor}
                    _hover={{ borderColor: hoverBorderColor, bg: hoverBgColor }}
                    onClick={() => handleSelectFromList(item)}
                  >
                    <CardBody py={3} px={4}>
                      <Flex align="center" gap={3}>
                        <Box
                          p={2}
                          bg={useColorModeValue("gray.200", "gray.600")}
                          borderRadius="full"
                          color="gray.500"
                        >
                          <FaUser />
                        </Box>
                        <Box flex="1">
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            noOfLines={1}
                            color={textColor}
                          >
                            {item.nome}
                          </Text>
                          <Flex gap={2} mt={1}>
                            <Badge colorScheme="blue" fontSize="xs">
                              ID: {item.id}
                            </Badge>
                            {item.id_fcw && (
                              <Badge colorScheme="purple" fontSize="xs">
                                FCW: {item.id_fcw}
                              </Badge>
                            )}
                          </Flex>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </Box>
            </VStack>
          )}

          {/* PASSO 3: CONFIRMAÇÃO */}
          {step === "CONFIRM" && selectedSolicitacao && (
            <VStack spacing={4} align="stretch">
              <Text
                fontSize="md"
                color="green.500"
                fontWeight="bold"
                textAlign="center"
              >
                Cliente Encontrado
              </Text>

              <Card
                variant="filled"
                bg={bgCard}
                borderColor={borderColor}
                borderWidth="1px"
              >
                <CardBody py={4}>
                  <Box mb={4}>
                    <Text
                      fontSize="xs"
                      color={labelColor}
                      textTransform="uppercase"
                      fontWeight="bold"
                    >
                      Nome do Cliente
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" color={textColor}>
                      {selectedSolicitacao.nome || "Nome não identificado"}
                    </Text>
                  </Box>

                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text
                        fontSize="xs"
                        color={labelColor}
                        textTransform="uppercase"
                        fontWeight="bold"
                      >
                        CPF/CNPJ
                      </Text>
                      <Text fontFamily="monospace" color={textColor}>
                        {selectedSolicitacao.cpf || "---"}
                      </Text>
                    </Box>

                    <Box>
                      <Text
                        fontSize="xs"
                        color={labelColor}
                        textTransform="uppercase"
                        fontWeight="bold"
                      >
                        ID FCWEB
                      </Text>
                      {selectedSolicitacao.id_fcw ? (
                        <Badge colorScheme="purple" fontSize="md">
                          #{selectedSolicitacao.id_fcw}
                        </Badge>
                      ) : (
                        <Text color="red.500" fontSize="sm" fontWeight="bold">
                          Não vinculado
                        </Text>
                      )}
                    </Box>

                    <Box>
                      <Text
                        fontSize="xs"
                        color={labelColor}
                        textTransform="uppercase"
                        fontWeight="bold"
                      >
                        ID Venda
                      </Text>
                      <Badge colorScheme="blue" fontSize="md">
                        #{selectedSolicitacao.id}
                      </Badge>
                    </Box>
                  </SimpleGrid>
                </CardBody>
              </Card>

              <Divider />

              {!selectedSolicitacao.id_fcw && (
                <Text
                  fontSize="sm"
                  color="red.500"
                  textAlign="center"
                  fontWeight="bold"
                >
                  ⚠️ Este cliente não possui Ficha FCWEB. <br />
                  Não será possível vincular o voucher.
                </Text>
              )}

              {selectedSolicitacao.id_fcw && (
                <Text fontSize="sm" color={labelColor} textAlign="center">
                  Confirmar vínculo de voucher para este cliente?
                </Text>
              )}
            </VStack>
          )}

          {/* PASSO 4: SUCESSO */}
          {step === "SUCCESS" && linkedData && (
            <VStack spacing={6} py={4} align="center">
              <Icon as={FaCheckCircle} w={16} h={16} color="green.500" />

              <Box textAlign="center">
                <Heading size="md" color={textColor}>
                  Vínculo Realizado!
                </Heading>
                <Text color={labelColor} fontSize="sm" mt={1}>
                  O voucher foi reservado para <b>{linkedData.cliente}</b>.
                </Text>
              </Box>

              <Card
                variant="outline"
                w="100%"
                borderColor={successBorder}
                bg={successBg}
                borderWidth={2}
              >
                <CardBody textAlign="center" py={6}>
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    color={labelColor}
                    fontWeight="bold"
                    mb={1}
                  >
                    Código do Voucher
                  </Text>
                  <Heading
                    size="xl"
                    fontFamily="monospace"
                    color={successText}
                    mb={4}
                  >
                    {linkedData.voucher}
                  </Heading>

                  <Button
                    leftIcon={hasCopied ? <FaCheckCircle /> : <FaCopy />}
                    onClick={onCopy}
                    size="sm"
                    colorScheme="green"
                    variant="solid"
                  >
                    {hasCopied ? "Copiado!" : "Copiar Código"}
                  </Button>
                </CardBody>
              </Card>

              <Text fontSize="xs" color={labelColor}>
                Origem:{" "}
                {linkedData.origem === "REPASSE_LOCAL"
                  ? "Estoque Reciclável"
                  : "Estoque Novo"}
              </Text>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {step === "SEARCH" && (
            <Button
              onClick={handleSearch}
              colorScheme="blue"
              isLoading={isSearching}
              w="100%"
            >
              Buscar Cliente
            </Button>
          )}

          {step === "LIST" && (
            <Button variant="ghost" onClick={() => setStep("SEARCH")}>
              Voltar
            </Button>
          )}

          {step === "CONFIRM" && (
            <Flex w="100%" justify="space-between">
              <Button variant="ghost" onClick={() => setStep("SEARCH")}>
                Nova Busca
              </Button>
              <Button
                colorScheme="green"
                onClick={handleConfirmLink}
                isLoading={isLinking}
                loadingText="Vinculando..."
                isDisabled={!selectedSolicitacao?.id_fcw}
              >
                Confirmar Vínculo
              </Button>
            </Flex>
          )}

          {step === "SUCCESS" && (
            <Button colorScheme="gray" onClick={handleClose} w="100%">
              Fechar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
