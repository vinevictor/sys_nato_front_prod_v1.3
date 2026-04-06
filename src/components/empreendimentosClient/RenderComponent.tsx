"use client";
import { getEmpreendimentoFilterOptions } from "@/actions/empreendimento/service/empreendimento";
import Empreendimentos from "@/components/empreendimentoCard";
import { ModalCriarEmpreendimento } from "@/components/modal/ModalCriarEmpreendimento";
import { EmpreedimentoType } from "@/types/empreendimentos_fidAll";
import { Session } from "@/types/session";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
  useToast,
  VStack,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import {
  MdAdd,
  MdApartment,
  MdBadge,
  MdChevronLeft,
  MdChevronRight,
  MdSearch,
  MdClear,
} from "react-icons/md";

interface MetaData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UserProviderProps {
  dados: {
    data: EmpreedimentoType[];
    meta: MetaData;
  };
  session: Session.AuthUser & { token?: string }; // Adicionado para suportar o fetch no client
}

export default function EmpreendimentoPageClient({
  dados,
  session,
}: UserProviderProps) {
  const [empreendimentos, setEmpreendimentos] = useState<EmpreedimentoType[]>(
    dados?.data || []
  );
  const [meta, setMeta] = useState<MetaData>(
    dados?.meta || { total: 0, page: 1, limit: 12, totalPages: 0 }
  );
  const [loading, setLoading] = useState(false);

  // Estados dos filtros
  const [filtros, setFiltros] = useState({
    id: "",
    nome: "",
    cidade: "",
    estado: "",
    construtoraId: "",
    status: "",
  });

  // Dados Auxiliares para os Selects
  const [opcoesFiltro, setOpcoesFiltro] = useState({
    cidades: [],
    estados: [],
  });
  const [construtoraData, setConstrutoraData] = useState([]);
  const [estadoData, setEstadoData] = useState([]);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectStyles = {
    bg: "white",
    color: "gray.800",
    _dark: {
      bg: "gray.800",
      color: "white",
      borderColor: "gray.600",
    },
    sx: {
      option: {
        bg: "white",
        color: "gray.800",
      },
      _dark: {
        option: {
          bg: "#2D3748",
          color: "white",
        },
      },
    },
  };

  const fetchEmpreendimentos = useCallback(
    async (pageNumber = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", pageNumber.toString());
        params.append("limit", "12");

        if (filtros.id) params.append("id", filtros.id);
        if (filtros.nome) params.append("nome", filtros.nome);
        if (filtros.cidade) params.append("cidade", filtros.cidade);
        if (filtros.estado) params.append("estado", filtros.estado);
        if (filtros.construtoraId)
          params.append("construtoraId", filtros.construtoraId);
        if (filtros.status) params.append("status", filtros.status);

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_STRAPI_API_URL
          }/empreendimento/search?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Falha na busca");

        const result = await response.json();
        setEmpreendimentos(result.data);
        setMeta(result.meta);
      } catch (error) {
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível filtrar os empreendimentos.",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    },
    [filtros, session?.token, toast]
  );

  // Carregar dados auxiliares uma única vez
  useEffect(() => {
    const loadSelectData = async () => {
      try {
        const [resOptions, resConst, resState] = await Promise.all([
          getEmpreendimentoFilterOptions(),
          fetch("/api/construtora/getall").then((r) => r.json()),
          fetch("/api/country/estados").then((r) => r.json()),
        ]);

        setOpcoesFiltro(resOptions || { cidades: [], estados: [] });
        setConstrutoraData(resConst || []);
        setEstadoData(resState.data || []);
      } catch (e) {
        console.error("Erro ao carregar auxiliares", e);
      }
    };
    loadSelectData();
  }, []);

  const handleClearFilters = () => {
    setFiltros({
      id: "",
      nome: "",
      cidade: "",
      estado: "",
      construtoraId: "",
      status: "",
    });
    setEmpreendimentos(dados?.data || []);
    setMeta(dados?.meta || { total: 0, page: 1, limit: 12, totalPages: 0 });
  };

  return (
    <Container maxW="95%" py={4} px={6}>
      <VStack spacing={0} align="stretch" w="full">
        {/* Cabeçalho */}
        <Flex
          bg="white"
          borderBottomWidth="2px"
          borderBottomColor="#00713D"
          p={{ base: 4, md: 6 }}
          align="center"
          justify="space-between"
          borderRadius="xl"
          borderBottomRadius={0}
          shadow="lg"
          _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
        >
          <Flex align="center" gap={3}>
            <Icon
              as={MdApartment}
              w={10}
              h={10}
              color="#00713D"
              _dark={{ color: "#00d672" }}
            />
            <Box>
              <Heading size="lg" color="#023147" _dark={{ color: "gray.100" }}>
                Gerenciar Empreendimentos
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                Total de {meta.total} registros encontrados
              </Text>
            </Box>
          </Flex>
          <Button
            leftIcon={<MdAdd />}
            colorScheme="green"
            bg="#00713D"
            onClick={onOpen}
            _dark={{ bg: "#00d672", color: "gray.900" }}
          >
            Novo Empreendimento
          </Button>
        </Flex>

        <VStack
          spacing={6}
          align="stretch"
          bg="white"
          _dark={{ bg: "gray.800" }}
          p={6}
          borderRadius="xl"
          borderTopRadius={0}
          shadow="lg"
        >
          {/* Box de Filtros */}
          <Box
            w="full"
            bg="gray.50"
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            _dark={{ bg: "gray.900", borderColor: "gray.700" }}
          >
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4, xl: 7 }}
              spacing={4}
              alignItems="flex-end"
            >
              <VStack align="start" spacing={1}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  ID
                </Text>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={MdBadge} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="ID"
                    value={filtros.id}
                    onChange={(e) =>
                      setFiltros({ ...filtros, id: e.target.value })
                    }
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                  />
                </InputGroup>
              </VStack>

              <VStack align="start" spacing={1}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  Nome
                </Text>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={MdSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Nome"
                    value={filtros.nome}
                    onChange={(e) =>
                      setFiltros({ ...filtros, nome: e.target.value })
                    }
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                  />
                </InputGroup>
              </VStack>

              <VStack align="start" spacing={1}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  UF
                </Text>
                <Select
                  placeholder="UF"
                  value={filtros.estado}
                  onChange={(e) =>
                    setFiltros({ ...filtros, estado: e.target.value })
                  }
                  {...selectStyles}
                >
                  {opcoesFiltro.estados.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </Select>
              </VStack>

              <VStack align="start" spacing={1}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  Cidade
                </Text>
                <Select
                  placeholder="Cidade"
                  value={filtros.cidade}
                  onChange={(e) =>
                    setFiltros({ ...filtros, cidade: e.target.value })
                  }
                  {...selectStyles}
                >
                  {opcoesFiltro.cidades.map((cidade) => (
                    <option key={cidade} value={cidade}>
                      {cidade}
                    </option>
                  ))}
                </Select>
              </VStack>

              <VStack align="start" spacing={1}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  Construtora
                </Text>
                <Select
                  placeholder="Construtora"
                  value={filtros.construtoraId}
                  onChange={(e) =>
                    setFiltros({ ...filtros, construtoraId: e.target.value })
                  }
                  {...selectStyles}
                >
                  {construtoraData.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.fantasia}
                    </option>
                  ))}
                </Select>
              </VStack>

              <VStack align="start" spacing={1}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  Status
                </Text>
                <Select
                  placeholder="Status"
                  value={filtros.status}
                  onChange={(e) =>
                    setFiltros({ ...filtros, status: e.target.value })
                  }
                  {...selectStyles}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </Select>
              </VStack>

              <HStack spacing={2} w="full">
                <Button
                  colorScheme="red"
                  variant="ghost"
                  onClick={handleClearFilters}
                  flex={1}
                >
                  Limpar
                </Button>
                <Button
                  leftIcon={<MdSearch />}
                  colorScheme="green"
                  bg="#00713D"
                  onClick={() => fetchEmpreendimentos(1)}
                  isLoading={loading}
                  flex={1.5}
                >
                  Filtrar
                </Button>
              </HStack>
            </SimpleGrid>
          </Box>

          {/* Listagem */}
          <Box w="full" minH="400px">
            {loading ? (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                spacing={6}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} height="300px" borderRadius="xl" />
                ))}
              </SimpleGrid>
            ) : empreendimentos.length > 0 ? (
              <>
                <Empreendimentos
                  data={empreendimentos}
                  listConstrutora={construtoraData}
                  listEstado={estadoData}
                  fechar={onClose}
                />

                {/* Paginação */}
                <Flex justify="center" mt={10} gap={4} align="center">
                  <Button
                    leftIcon={<MdChevronLeft />}
                    onClick={() => fetchEmpreendimentos(meta.page - 1)}
                    isDisabled={meta.page === 1 || loading}
                    size="sm"
                  >
                    Anterior
                  </Button>
                  <Text fontWeight="bold" fontSize="sm">
                    Página {meta.page} de {meta.totalPages}
                  </Text>
                  <Button
                    rightIcon={<MdChevronRight />}
                    onClick={() => fetchEmpreendimentos(meta.page + 1)}
                    isDisabled={meta.page === meta.totalPages || loading}
                    size="sm"
                  >
                    Próxima
                  </Button>
                </Flex>
              </>
            ) : (
              <Flex flexDir="column" align="center" py={20}>
                <Icon as={MdSearch} w={12} h={12} color="gray.300" />
                <Text mt={4} fontSize="lg" color="gray.500">
                  Nenhum resultado encontrado.
                </Text>
                <Button
                  variant="link"
                  colorScheme="green"
                  mt={2}
                  onClick={handleClearFilters}
                >
                  Limpar filtros e ver todos
                </Button>
              </Flex>
            )}
          </Box>
        </VStack>
      </VStack>

      <ModalCriarEmpreendimento
        isOpen={isOpen}
        onClose={onClose}
        lista={construtoraData}
        listEstado={estadoData}
      />
    </Container>
  );
}
