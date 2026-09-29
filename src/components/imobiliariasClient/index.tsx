"use client";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import {
  MdAdd,
  MdBadge,
  MdBusiness,
  MdClear,
  MdDelete,
  MdEdit,
  MdFilterAlt,
  MdHomeWork,
  MdPeople,
  MdPhone,
  MdPowerSettingsNew,
  MdSearch,
} from "react-icons/md";
import { mask } from "remask";
import ImobiliariaFormModal from "./ImobiliariaFormModal";

export interface ImobiliariaListItem {
  id: number;
  razaosocial: string;
  fantasia: string;
  cnpj: string;
  tel: string | null;
  email: string | null;
  status: boolean;
  colaboradores: number;
}

interface ImobiliariasClientProps {
  data: ImobiliariaListItem[];
  isAdm: boolean;
}

const filtrosVazios = {
  id: "",
  razaosocial: "",
  fantasia: "",
  cnpj: "",
  status: "todos",
};

export default function ImobiliariasClient({
  data,
  isAdm,
}: ImobiliariasClientProps) {
  const [lista, setLista] = useState<ImobiliariaListItem[]>(data);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState(filtrosVazios);
  const [editId, setEditId] = useState<number | undefined>();
  const [excluirId, setExcluirId] = useState<number | undefined>();
  const [acaoId, setAcaoId] = useState<number | undefined>();
  const modal = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const buscar = useCallback(
    async (f: typeof filtrosVazios) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (f.id) params.append("id", f.id);
        if (f.razaosocial) params.append("razaosocial", f.razaosocial);
        if (f.fantasia) params.append("fantasia", f.fantasia);
        if (f.cnpj) params.append("cnpj", f.cnpj.replace(/\D/g, ""));
        if (f.status !== "todos") params.append("status", f.status);

        const response = await fetch(
          `/api/imobiliaria/search?${params.toString()}`
        );
        if (!response.ok) throw new Error("Erro ao buscar dados");
        setLista(await response.json());
      } catch {
        toast({
          title: "Erro na busca",
          description: "Não foi possível realizar o filtro no servidor.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const limparFiltros = () => {
    setFiltros(filtrosVazios);
    buscar(filtrosVazios);
  };

  const abrirModal = (id?: number) => {
    setEditId(id);
    modal.onOpen();
  };

  const alternarStatus = async (item: ImobiliariaListItem) => {
    setAcaoId(item.id);
    try {
      const response = await fetch(`/api/imobiliaria/update/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !item.status }),
      });
      const retorno = await response.json();
      if (!response.ok) throw new Error(retorno.message);
      setLista((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: !i.status } : i))
      );
      toast({
        title: `Imobiliária ${item.status ? "desativada" : "ativada"}`,
        status: "success",
        duration: 2000,
        position: "top-right",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status",
        description: error.message,
        status: "error",
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setAcaoId(undefined);
    }
  };

  const confirmarExclusao = async () => {
    if (!excluirId) return;
    setAcaoId(excluirId);
    try {
      const response = await fetch(`/api/imobiliaria/delete/${excluirId}`, {
        method: "DELETE",
      });
      const retorno = await response.json();
      if (!response.ok) throw new Error(retorno.message);
      setLista((prev) => prev.filter((i) => i.id !== excluirId));
      toast({
        title: "Imobiliária excluída",
        status: "success",
        duration: 2000,
        position: "top-right",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        status: "error",
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setAcaoId(undefined);
      setExcluirId(undefined);
    }
  };

  const inputProps = { bg: "gray.50", _dark: { bg: "gray.700" } };

  return (
    <VStack
      w="full"
      maxW="95%"
      mx="auto"
      spacing={6}
      align="stretch"
      py={8}
      px={{ base: 4, md: 6 }}
    >
      {/* Cabeçalho */}
      <Flex
        align="center"
        justify="space-between"
        pb={4}
        borderBottom="2px solid"
        borderColor="#00713D"
        flexWrap={{ base: "wrap", md: "nowrap" }}
        gap={4}
      >
        <Flex align="center" gap={3}>
          <Icon as={MdHomeWork} boxSize={8} color="#00713D" />
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="#023147"
            _dark={{ color: "white" }}
          >
            Gerenciar Imobiliárias
          </Heading>
        </Flex>

        <Button
          leftIcon={<MdAdd />}
          colorScheme="green"
          bg="#00713D"
          _hover={{ bg: "#005a31" }}
          _dark={{ bg: "#00d672", _hover: { bg: "#00c060" } }}
          size={{ base: "md", md: "lg" }}
          onClick={() => abrirModal()}
        >
          Criar Nova Imobiliária
        </Button>
      </Flex>

      {/* Filtros */}
      <Box
        bg="white"
        _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        p={6}
        borderRadius="lg"
        shadow="md"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Flex align="center" gap={2} mb={4}>
          <Icon as={MdFilterAlt} boxSize={5} color="#00713D" />
          <Text
            fontWeight="600"
            fontSize="lg"
            color="gray.700"
            _dark={{ color: "gray.200" }}
          >
            Filtros Avançados
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
          <Input
            {...inputProps}
            placeholder="ID"
            type="number"
            value={filtros.id}
            onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
          />
          <Input
            {...inputProps}
            placeholder="Razão Social"
            value={filtros.razaosocial}
            onChange={(e) =>
              setFiltros({ ...filtros, razaosocial: e.target.value })
            }
          />
          <Input
            {...inputProps}
            placeholder="Nome Fantasia"
            value={filtros.fantasia}
            onChange={(e) =>
              setFiltros({ ...filtros, fantasia: e.target.value })
            }
          />
          <Input
            {...inputProps}
            placeholder="CNPJ"
            value={filtros.cnpj}
            onChange={(e) => setFiltros({ ...filtros, cnpj: e.target.value })}
          />
          <Select
            value={filtros.status}
            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
            bg="gray.50"
            color="gray.700"
            _dark={{ bg: "gray.700", color: "white", borderColor: "gray.600" }}
          >
            <option value="todos">Todos Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </Select>
        </SimpleGrid>

        <Flex mt={6} justify="space-between" align="center">
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            <strong>{lista.length}</strong> imobiliária(s) encontrada(s)
          </Text>
          <HStack spacing={3}>
            <Button
              leftIcon={<MdClear />}
              variant="outline"
              colorScheme="gray"
              onClick={limparFiltros}
              isDisabled={loading}
            >
              Limpar
            </Button>
            <Button
              leftIcon={<MdSearch />}
              colorScheme="green"
              bg="#00713D"
              _hover={{ bg: "#005a31" }}
              isLoading={loading}
              onClick={() => buscar(filtros)}
            >
              Filtrar
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Lista */}
      {loading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} height="200px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      ) : lista.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
          {lista.map((imob) => (
            <Flex
              key={imob.id}
              direction="column"
              bg="white"
              _dark={{ bg: "gray.800", borderColor: "gray.700" }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
              overflow="hidden"
              transition="all 0.3s"
              _hover={{
                transform: "translateY(-4px)",
                shadow: "xl",
                borderColor: "#00713D",
              }}
            >
              <Flex
                bgGradient="linear(to-r, #00713D, #005a31)"
                p={4}
                align="center"
                justify="space-between"
              >
                <Flex direction="column" flex={1} minW={0}>
                  <Text fontSize="lg" fontWeight="bold" color="white" noOfLines={1}>
                    {imob.fantasia}
                  </Text>
                  <Text fontSize="xs" color="whiteAlpha.800">
                    ID: {imob.id}
                  </Text>
                </Flex>
                <Badge
                  colorScheme={imob.status ? "green" : "red"}
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  {imob.status ? "Ativo" : "Inativo"}
                </Badge>
              </Flex>

              <Flex direction="column" p={4} gap={3} flex={1}>
                <Flex align="center" gap={2}>
                  <Icon as={MdBusiness} color="#00713D" boxSize={5} />
                  <Box flex={1} minW={0}>
                    <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                      Razão Social
                    </Text>
                    <Text fontSize="sm" fontWeight="600" noOfLines={1}>
                      {imob.razaosocial}
                    </Text>
                  </Box>
                </Flex>
                <Divider />
                <Flex align="center" gap={2}>
                  <Icon as={MdBadge} color="#00713D" boxSize={5} />
                  <Box flex={1}>
                    <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                      CNPJ
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {mask(imob.cnpj, ["99.999.999/9999-99"])}
                    </Text>
                  </Box>
                </Flex>
                <Divider />
                <Flex align="center" gap={2}>
                  <Icon as={MdPhone} color="#00713D" boxSize={5} />
                  <Box flex={1}>
                    <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                      Telefone
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {imob.tel
                        ? mask(imob.tel, ["(99) 9999-9999", "(99) 9 9999-9999"])
                        : "Não informado"}
                    </Text>
                  </Box>
                </Flex>
                <Divider />
                <Flex align="center" gap={2}>
                  <Icon as={MdPeople} color="#00713D" boxSize={5} />
                  <Box flex={1}>
                    <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                      Agentes vinculados
                    </Text>
                    <Text fontSize="sm" fontWeight="600">
                      {imob.colaboradores || 0}
                    </Text>
                  </Box>
                </Flex>
              </Flex>

              <Divider />
              <Flex p={3} gap={2} justifyContent="flex-end" bg="gray.50" _dark={{ bg: "gray.900" }}>
                <Tooltip label={imob.status ? "Desativar" : "Ativar"}>
                  <IconButton
                    aria-label={imob.status ? "Desativar" : "Ativar"}
                    icon={<MdPowerSettingsNew />}
                    size="sm"
                    colorScheme={imob.status ? "orange" : "green"}
                    variant="outline"
                    isLoading={acaoId === imob.id}
                    onClick={() => alternarStatus(imob)}
                  />
                </Tooltip>
                {isAdm && (
                  <Tooltip label="Excluir">
                    <IconButton
                      aria-label="Excluir"
                      icon={<MdDelete />}
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => setExcluirId(imob.id)}
                    />
                  </Tooltip>
                )}
                <Tooltip label="Editar">
                  <IconButton
                    aria-label="Editar"
                    icon={<MdEdit />}
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => abrirModal(imob.id)}
                  />
                </Tooltip>
              </Flex>
            </Flex>
          ))}
        </SimpleGrid>
      ) : (
        <Flex
          w="full"
          minH="300px"
          direction="column"
          align="center"
          justify="center"
          bg="gray.50"
          _dark={{ bg: "gray.800" }}
          borderRadius="lg"
          p={8}
          gap={4}
        >
          <Icon as={MdSearch} boxSize={16} color="gray.400" />
          <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
            Nenhuma imobiliária encontrada
          </Text>
        </Flex>
      )}

      <ImobiliariaFormModal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        imobiliariaId={editId}
        onSuccess={() => buscar(filtros)}
      />

      <AlertDialog
        isOpen={!!excluirId}
        leastDestructiveRef={cancelRef}
        onClose={() => setExcluirId(undefined)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir imobiliária
            </AlertDialogHeader>
            <AlertDialogBody>
              Essa ação não pode ser desfeita. Os agentes perdem o vínculo e os
              envelopes deixam de aparecer no NatoDoc.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setExcluirId(undefined)}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmarExclusao}
                ml={3}
                isLoading={!!excluirId && acaoId === excluirId}
              >
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
}
