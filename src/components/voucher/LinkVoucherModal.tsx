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
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa";

interface LinkVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Adicionamos um passo "LIST" para quando vierem múltiplos resultados
type ModalStep = "SEARCH" | "LIST" | "CONFIRM";

export function LinkVoucherModal({
  isOpen,
  onClose,
  onSuccess,
}: LinkVoucherModalProps) {
  const [step, setStep] = useState<ModalStep>("SEARCH");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  const [searchResults, setSearchResults] = useState<any[]>([]); // Lista de encontrados
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<any>(null); // O escolhido

  const toast = useToast();

  // 1. Função de Busca
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setSelectedSolicitacao(null);
    setSearchResults([]);

    try {
      const resultados = await buscarSolicitacaoPreview(searchTerm);

      if (resultados && resultados.length > 0) {
        // Lógica Inteligente:
        if (resultados.length === 1) {
          // Se só achou 1, vai direto pra confirmação (comportamento rápido)
          setSelectedSolicitacao(resultados[0]);
          setStep("CONFIRM");
        } else {
          // Se achou vários (ex: buscou por "Silva"), mostra lista para escolher
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

  // Selecionar item da lista
  const handleSelectFromList = (item: any) => {
    setSelectedSolicitacao(item);
    setStep("CONFIRM");
  };

  // 2. Função de Vínculo
  const handleConfirmLink = async () => {
    if (!selectedSolicitacao) return;

    setIsLinking(true);
    try {
      await vincularVoucher({
        solicitacaoId: selectedSolicitacao.id,
        fcw2Id: 0,
        nome: "", // Backend preenche
        cpf: "", // Backend preenche
        usuarioId: 1, // Idealmente pegar do contexto de auth
      });

      toast({
        title: "Sucesso!",
        description: "Voucher vinculado à solicitação.",
        status: "success",
      });

      handleClose();
      onSuccess();
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

  const handleClose = () => {
    setStep("SEARCH");
    setSearchTerm("");
    setSelectedSolicitacao(null);
    setSearchResults([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Vincular Voucher</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          {/* PASSO 1: BUSCA */}
          {step === "SEARCH" && (
            <VStack spacing={4}>
              <Text fontSize="sm" color="gray.500">
                Busque pelo <b>ID da venda</b> ou pelo <b>Nome do cliente</b>{" "}
                para localizar a solicitação.
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

          {/* PASSO 2: LISTA (Se houver múltiplos resultados) */}
          {step === "LIST" && (
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="bold" color="gray.600">
                Encontramos {searchResults.length} resultados. Selecione o
                correto:
              </Text>

              <Box maxH="300px" overflowY="auto" pr={1}>
                {searchResults.map((item) => (
                  <Card
                    key={item.id}
                    variant="outline"
                    mb={2}
                    cursor="pointer"
                    _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                    onClick={() => handleSelectFromList(item)}
                  >
                    <CardBody py={3} px={4}>
                      <Flex align="center" gap={3}>
                        <Box
                          p={2}
                          bg="gray.100"
                          borderRadius="full"
                          color="gray.500"
                        >
                          <FaUser />
                        </Box>
                        <Box flex="1">
                          <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                            {item.nome}
                          </Text>
                          <Flex gap={2} mt={1}>
                            <Badge colorScheme="blue" fontSize="xs">
                              ID: {item.id}
                            </Badge>
                            <Badge colorScheme="gray" fontSize="xs">
                              {item.cpf || "CPF N/A"}
                            </Badge>
                          </Flex>
                        </Box>
                        <Button size="xs" colorScheme="blue" variant="ghost">
                          Selecionar
                        </Button>
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
                color="green.600"
                fontWeight="bold"
                textAlign="center"
              >
                <Icon as={FaSearch} mr={2} />
                Solicitação Encontrada
              </Text>

              <Card
                variant="filled"
                bg="green.50"
                borderColor="green.200"
                borderWidth="1px"
              >
                <CardBody py={4}>
                  <Box mb={3}>
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      textTransform="uppercase"
                      fontWeight="bold"
                    >
                      Cliente
                    </Text>
                    <Text fontWeight="bold" fontSize="lg">
                      {selectedSolicitacao.nome || "Nome não identificado"}
                    </Text>
                  </Box>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        textTransform="uppercase"
                        fontWeight="bold"
                      >
                        CPF/CNPJ
                      </Text>
                      <Text fontFamily="monospace">
                        {selectedSolicitacao.cpf || "---"}
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        textTransform="uppercase"
                        fontWeight="bold"
                      >
                        ID Venda
                      </Text>
                      <Badge colorScheme="blue" fontSize="md">
                        #{selectedSolicitacao.id}
                      </Badge>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              <Divider />

              <Text fontSize="sm" color="gray.600" textAlign="center">
                Tem certeza que deseja vincular um voucher disponível a este
                cliente?
              </Text>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {step === "SEARCH" ? (
            <Button
              onClick={handleSearch}
              colorScheme="blue"
              isLoading={isSearching}
              w="100%"
            >
              Buscar Cliente
            </Button>
          ) : (
            <Flex w="100%" justify="space-between">
              <Button variant="ghost" onClick={() => setStep("SEARCH")}>
                Nova Busca
              </Button>
              {step === "CONFIRM" && (
                <Button
                  colorScheme="green"
                  onClick={handleConfirmLink}
                  isLoading={isLinking}
                  loadingText="Vinculando..."
                >
                  Confirmar Vínculo
                </Button>
              )}
            </Flex>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
