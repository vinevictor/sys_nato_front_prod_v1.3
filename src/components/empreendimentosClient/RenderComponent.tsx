"use client";
import Empreendimentos from "@/components/empreendimentoCard";
import { ModalCriarEmpreendimento } from "@/components/modal/ModalCriarEmpreendimento";
import { EmpreedimentoType } from "@/types/empreendimentos_fidAll";
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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdAccountBalance,
  MdAdd,
  MdApartment,
  MdBadge,
  MdBusiness,
  MdCheckCircle,
  MdLocationCity,
  MdMap,
  MdSearch,
} from "react-icons/md";

interface UserProviderProps {
  dados: EmpreedimentoType[];
}

// Função para extrair cidades únicas
function extrairCidadesUnicas(empreendimentos: EmpreedimentoType[]) {
  const cidadesSet = new Set<string>();

  empreendimentos.forEach((emp) => {
    if (emp.cidade) {
      cidadesSet.add(emp.cidade);
    }
  });

  return Array.from(cidadesSet).sort();
}

// Função para extrair estados (UF) únicos
function extrairEstadosUnicos(empreendimentos: EmpreedimentoType[]) {
  const estadosSet = new Set<string>();

  empreendimentos.forEach((emp) => {
    if (emp.estado) {
      estadosSet.add(emp.estado);
    }
  });

  return Array.from(estadosSet).sort();
}

// Função para extrair construtoras únicas
function extrairConstrutorasUnicas(empreendimentos: EmpreedimentoType[]) {
  const construtorasMap = new Map();

  empreendimentos.forEach((emp) => {
    if (emp.construtora) {
      const construtora = emp.construtora;
      if (!construtorasMap.has(construtora.id)) {
        construtorasMap.set(construtora.id, {
          id: construtora.id,
          fantasia: construtora.fantasia,
        });
      }
    }
  });

  return Array.from(construtorasMap.values()).sort((a, b) =>
    a.fantasia.localeCompare(b.fantasia)
  );
}

// Função para extrair financeiros únicos
function extrairFinanceirosUnicos(empreendimentos: EmpreedimentoType[]) {
  const financeirosMap = new Map();

  empreendimentos.forEach((emp) => {
    if (emp.financeiros && Array.isArray(emp.financeiros)) {
      emp.financeiros.forEach((financeiro: any) => {
        if (financeiro && !financeirosMap.has(financeiro.id)) {
          financeirosMap.set(financeiro.id, {
            id: financeiro.id,
            fantasia: financeiro.fantasia,
          });
        }
      });
    }
  });

  return Array.from(financeirosMap.values()).sort((a, b) =>
    a.fantasia.localeCompare(b.fantasia)
  );
}

/**
 * Componente de página de empreendimentos
 *
 * Exibe lista de empreendimentos com filtros e opção de criar novo.
 * Possui layout responsivo e suporte completo a dark mode.
 *
 * @param dados - Lista de empreendimentos
 * @returns Componente de página de empreendimentos
 */
export default function EmpreendimentoPageClient({ dados }: UserProviderProps) {
  const [empreendimentos, setEmpreendimentos] = useState<EmpreedimentoType[]>(
    []
  );
  const [dadosFiltrados, setDadosFiltrados] = useState<EmpreedimentoType[]>([]);
  const router = useRouter();

  // Estados dos filtros
  const [filtroId, setFiltroId] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroConstrutora, setFiltroConstrutora] = useState("");
  const [filtroFinanceiro, setFiltroFinanceiro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [construtoraData, setConstrutoraData] = useState([]);
  const [estadoData, setEstadoData] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setEmpreendimentos(dados);
    setDadosFiltrados(dados);
  }, [dados]);

  const cidadesUnicas = extrairCidadesUnicas(empreendimentos);
  const estadosUnicos = extrairEstadosUnicos(empreendimentos);
  const construtorasUnicas = extrairConstrutorasUnicas(empreendimentos);
  const financeirosUnicos = extrairFinanceirosUnicos(empreendimentos);

  // Função de filtro
  useEffect(() => {
    let resultados = [...empreendimentos];

    // Filtro por ID
    if (filtroId) {
      resultados = resultados.filter((emp: EmpreedimentoType) =>
        emp.id.toString().includes(filtroId)
      );
    }

    // Filtro por Nome
    if (filtroNome) {
      resultados = resultados.filter((emp: EmpreedimentoType) =>
        emp.nome.toLowerCase().includes(filtroNome.toLowerCase())
      );
    }

    // Filtro por Cidade
    if (filtroCidade) {
      resultados = resultados.filter((emp: EmpreedimentoType) => emp.cidade === filtroCidade);  
    }

    // Filtro por Estado (UF)
    if (filtroEstado) {
      resultados = resultados.filter((emp: EmpreedimentoType) => emp.estado === filtroEstado);
    }

    // Filtro por Construtora
    if (filtroConstrutora) {
      resultados = resultados.filter(
        (emp: EmpreedimentoType) =>
          emp.construtora && emp.construtora.id.toString() === filtroConstrutora
      );
    }

    // Filtro por Financeiro
    if (filtroFinanceiro) {
      resultados = resultados.filter(
        (emp: EmpreedimentoType) =>
          emp.financeiros &&
          emp.financeiros.some(
            (item) => item.id.toString() === filtroFinanceiro
          )
      );
    }

    // Filtro por Status
    if (filtroStatus) {
      const statusBooleano = filtroStatus === "true";
      resultados = resultados.filter(
        (emp: EmpreedimentoType) => emp.status === statusBooleano
      );
    }

    setDadosFiltrados(resultados);
  }, [
    filtroId,
    filtroNome,
    filtroCidade,
    filtroEstado,
    filtroConstrutora,
    filtroFinanceiro,
    filtroStatus,
    empreendimentos,
  ]);

  const getConstrutora = async () => {
    try {
      const req = await fetch("/api/construtora/getall");
      const res = await req.json();
      setConstrutoraData(res);
    } catch (error: any) {
      console.log("🚀 ~ getConstrutora ~ error:", error);
      toast({
        title: "Erro",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const GetState = async () => {
    try {
      const req = await fetch("/api/country/estados");
      const res = await req.json();
      setEstadoData(res.data);
    } catch (error: any) {
      console.log("🚀 ~ getConstrutora ~ error:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao buscar estados",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getConstrutora();
    GetState();
  }, []);
  

  return (
    <Container maxW="95%" py={4} px={6}>
      <VStack spacing={0} align="stretch" w="full">
        {/* Cabeçalho da Página */}
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
          flexDir={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
          _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
        >
          {/* Título com ícone */}
          <Flex align="center" gap={3}>
            <Icon
              as={MdApartment}
              w={{ base: 8, md: 10 }}
              h={{ base: 8, md: 10 }}
              color="#00713D"
              _dark={{ color: "#00d672" }}
            />
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Gerenciar Empreendimentos
              </Heading>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Visualize e gerencie os empreendimentos do sistema
              </Text>
            </Box>
          </Flex>

          {/* Botão Criar Empreendimento */}
          <Button
            leftIcon={<MdAdd />}
            colorScheme="green"
            bg="#00713D"
            size={{ base: "md", md: "lg" }}
            onClick={onOpen}
            transition="all 0.2s"
            w={{ base: "full", md: "auto" }}
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
          >
            Criar Novo Empreendimento
          </Button>
        </Flex>

        {/* Conteúdo da Página */}
        <VStack
          spacing={6}
          align="stretch"
          bg="white"
          _dark={{ bg: "gray.800" }}
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          borderTopRadius={0}
          shadow="lg"
          minH="400px"
        >
          {/* Filtros */}
          <Box
            w="full"
            bg="gray.50"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            _dark={{ bg: "gray.900", borderColor: "gray.700" }}
          >
            <Heading
              size="sm"
              mb={4}
              color="#023147"
              _dark={{ color: "gray.100" }}
            >
              Filtrar Empreendimentos
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3, xl: 4, "2xl": 7 }}
              spacing={4}
            >
              {/* Filtro por ID */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  ID
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdBadge} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por ID"
                    value={filtroId}
                    onChange={(e) => setFiltroId(e.target.value)}
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
                    _hover={{ borderColor: "#00713D" }}
                    _focus={{
                      borderColor: "#00713D",
                      boxShadow: "0 0 0 1px #00713D",
                    }}
                  />
                </InputGroup>
              </Box>

              {/* Filtro por Nome */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  Nome
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por nome"
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
                    _hover={{ borderColor: "#00713D" }}
                    _focus={{
                      borderColor: "#00713D",
                      boxShadow: "0 0 0 1px #00713D",
                    }}
                  />
                </InputGroup>
              </Box>

              {/* Filtro por Estado (UF) */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  UF
                </Text>
                <Select
                  placeholder="Todos os estados"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  bg="white"
                  color="gray.800"
                  borderColor="gray.300"
                  icon={<MdMap />}
                  _hover={{ borderColor: "#00713D" }}
                  _focus={{
                    borderColor: "#00713D",
                    boxShadow: "0 0 0 1px #00713D",
                  }}
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "gray.100",
                  }}
                  sx={{
                    "& option": {
                      bg: "white",
                      color: "gray.800",
                    },
                    "&:is([data-theme='dark']) option, .chakra-ui-dark &option":
                      {
                        bg: "gray.800",
                        color: "gray.100",
                      },
                  }}
                >
                  {estadosUnicos.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </Select>
              </Box>

              {/* Filtro por Cidade */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  Cidade
                </Text>
                <Select
                  placeholder="Todas as cidades"
                  value={filtroCidade}
                  onChange={(e) => setFiltroCidade(e.target.value)}
                  bg="white"
                  color="gray.800"
                  borderColor="gray.300"
                  icon={<MdLocationCity />}
                  _hover={{ borderColor: "#00713D" }}
                  _focus={{
                    borderColor: "#00713D",
                    boxShadow: "0 0 0 1px #00713D",
                  }}
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "gray.100",
                  }}
                  sx={{
                    "& option": {
                      bg: "white",
                      color: "gray.800",
                    },
                    "&:is([data-theme='dark']) option, .chakra-ui-dark &option":
                      {
                        bg: "gray.800",
                        color: "gray.100",
                      },
                  }}
                >
                  {cidadesUnicas.map((cidade) => (
                    <option key={cidade} value={cidade}>
                      {cidade}
                    </option>
                  ))}
                </Select>
              </Box>

              {/* Filtro por Construtora */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  Construtora
                </Text>
                <Select
                  placeholder="Todas as construtoras"
                  value={filtroConstrutora}
                  onChange={(e) => setFiltroConstrutora(e.target.value)}
                  bg="white"
                  color="gray.800"
                  borderColor="gray.300"
                  icon={<MdBusiness />}
                  _hover={{ borderColor: "#00713D" }}
                  _focus={{
                    borderColor: "#00713D",
                    boxShadow: "0 0 0 1px #00713D",
                  }}
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "gray.100",
                  }}
                  sx={{
                    "& option": {
                      bg: "white",
                      color: "gray.800",
                    },
                    "&:is([data-theme='dark']) option, .chakra-ui-dark &option":
                      {
                        bg: "gray.800",
                        color: "gray.100",
                      },
                  }}
                >
                  {construtorasUnicas.map((construtora) => (
                    <option key={construtora.id} value={construtora.id}>
                      {construtora.fantasia}
                    </option>
                  ))}
                </Select>
              </Box>

              {/* Filtro por Financeiro */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  Financeiro
                </Text>
                <Select
                  placeholder="Todos os financeiros"
                  value={filtroFinanceiro}
                  onChange={(e) => setFiltroFinanceiro(e.target.value)}
                  bg="white"
                  color="gray.800"
                  borderColor="gray.300"
                  icon={<MdAccountBalance />}
                  _hover={{ borderColor: "#00713D" }}
                  _focus={{
                    borderColor: "#00713D",
                    boxShadow: "0 0 0 1px #00713D",
                  }}
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "gray.100",
                  }}
                  sx={{
                    "& option": {
                      bg: "white",
                      color: "gray.800",
                    },
                    "&:is([data-theme='dark']) option, .chakra-ui-dark &option":
                      {
                        bg: "gray.800",
                        color: "gray.100",
                      },
                  }}
                >
                  {financeirosUnicos.map((financeiro) => (
                    <option key={financeiro.id} value={financeiro.id}>
                      {financeiro.fantasia}
                    </option>
                  ))}
                </Select>
              </Box>

              {/* Filtro por Status */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  Status
                </Text>
                <Select
                  placeholder="Todos os status"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  bg="white"
                  color="gray.800"
                  borderColor="gray.300"
                  icon={<MdCheckCircle />}
                  _hover={{ borderColor: "#00713D" }}
                  _focus={{
                    borderColor: "#00713D",
                    boxShadow: "0 0 0 1px #00713D",
                  }}
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "gray.100",
                  }}
                  sx={{
                    "& option": {
                      bg: "white",
                      color: "gray.800",
                    },
                    "&:is([data-theme='dark']) option, .chakra-ui-dark &option":
                      {
                        bg: "gray.800",
                        color: "gray.100",
                      },
                  }}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </Select>
              </Box>
            </SimpleGrid>

            {/* Contador de resultados */}
            <Flex mt={4} justify="space-between" align="center">
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                {dadosFiltrados.length}{" "}
                {dadosFiltrados.length === 1
                  ? "empreendimento encontrado"
                  : "empreendimentos encontrados"}
              </Text>

              {(filtroId ||
                filtroNome ||
                filtroCidade ||
                filtroEstado ||
                filtroConstrutora ||
                filtroFinanceiro ||
                filtroStatus) && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => {
                    setFiltroId("");
                    setFiltroNome("");
                    setFiltroCidade("");
                    setFiltroEstado("");
                    setFiltroConstrutora("");
                    setFiltroFinanceiro("");
                    setFiltroStatus("");
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </Flex>
          </Box>

          {/* Lista de Empreendimentos */}
          <Box w="full">
            {dadosFiltrados.length > 0 ? (
              <Empreendimentos data={dadosFiltrados} listConstrutora={construtoraData} listEstado={estadoData} fechar={onClose} />
            ) : empreendimentos.length > 0 ? (
              <Flex
                w="full"
                minH="300px"
                justifyContent="center"
                alignItems="center"
                bg="gray.50"
                _dark={{ bg: "gray.900" }}
                borderRadius="lg"
                p={8}
                flexDir="column"
                gap={4}
              >
                <Icon as={MdSearch} w={16} h={16} color="gray.400" />
                <Text
                  fontSize="lg"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                >
                  Nenhum empreendimento encontrado com os filtros aplicados
                </Text>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={() => {
                    setFiltroId("");
                    setFiltroNome("");
                    setFiltroCidade("");
                    setFiltroEstado("");
                    setFiltroConstrutora("");
                    setFiltroFinanceiro("");
                  }}
                >
                  Limpar Filtros
                </Button>
              </Flex>
            ) : (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                spacing={6}
                w="full"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <Skeleton
                    key={index}
                    height="350px"
                    borderRadius="xl"
                    startColor="gray.200"
                    endColor="gray.700"
                  />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </VStack>
      </VStack>

      {/* Modal de Criação de Empreendimento */}
      <ModalCriarEmpreendimento
        isOpen={isOpen}
        onClose={onClose}
        lista={construtoraData}
        listEstado={estadoData}
      />
    </Container>
  );
}
