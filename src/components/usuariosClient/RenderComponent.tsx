"use client";
import Usuarios from "@/components/usuarios_component";
import UserProvider from "@/provider/UserProvider";
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
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { 
  MdPersonAdd, 
  MdPeople, 
  MdSearch, 
  MdBadge,
  MdBusiness,
  MdApartment,
  MdAccountBalance,
  MdCheckCircle
} from "react-icons/md";
import { useRouter } from "next/navigation";

export interface UserProviderProps {
  dados: UsuarioType[] | { data: UsuarioType[] };
}

/**
 * Normaliza a estrutura recebida garantindo sempre um array de usuários.
 * Aceita tanto um array direto quanto objetos no formato { data: UsuarioType[] }.
 */
function normalizarUsuarios(dados: UserProviderProps["dados"]): UsuarioType[] {
  if (Array.isArray(dados)) {
    return dados;
  }

  if (dados && Array.isArray(dados.data)) {
    return dados.data;
  }

  return [];
}

type UsuarioType = {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  hierarquia: string;
  cargo: string;
  status: boolean;
  createdAt: string;
  construtoras: {
    construtora: {
      id: number;
      fantasia: string;
    };
  }[];
  empreendimentos: {
    empreendimento: {
      id: number;
      nome: string;
    };
  }[];
  financeiros: {
    financeiro: {
      id: number;
      fantasia: string;
    };
  }[];
};

// Função para extrair construtoras únicas
function extrairConstrutorasUnicas(usuarios: UsuarioType[]) {
  const construtorasMap = new Map();

  usuarios.forEach((usuario) => {
    usuario.construtoras.forEach((item) => {
      const construtora = item.construtora;
      if (!construtorasMap.has(construtora.id)) {
        construtorasMap.set(construtora.id, {
          id: construtora.id,
          fantasia: construtora.fantasia,
        });
      }
    });
  });

  return Array.from(construtorasMap.values());
}

// Função para extrair financeiros únicos
function extrairFinanceirosUnicos(usuarios: UsuarioType[]) {
  const financeirosMap = new Map();

  usuarios.forEach((usuario) => {
    usuario.financeiros.forEach((item) => {
      const financeiro = item.financeiro;
      if (!financeirosMap.has(financeiro.id)) {
        financeirosMap.set(financeiro.id, {
          id: financeiro.id,
          fantasia: financeiro.fantasia,
        });
      }
    });
  });

  return Array.from(financeirosMap.values());
}

// Função para extrair empreendimentos únicos
function extrairEmpreendimentosUnicos(usuarios: UsuarioType[]) {
  const empreendimentosMap = new Map();
  
  usuarios.forEach(usuario => {
    usuario.empreendimentos.forEach(item => {
      const empreendimento = item.empreendimento;
      if (!empreendimentosMap.has(empreendimento.id)) {
        empreendimentosMap.set(empreendimento.id, {
          id: empreendimento.id,
          nome: empreendimento.nome
        });
      }
    });
  });
  
  return Array.from(empreendimentosMap.values());
}

/**
 * Componente de página de usuários
 *
 * Exibe lista de usuários do sistema com filtros e opção de criar novo usuário.
 * Possui layout responsivo e suporte completo a dark mode.
 *
 * @param dados - Lista de usuários
 * @returns Componente de página de usuários
 */
type FiltrosUsuarios = {
  id: string;
  nome: string;
  construtora: string;
  empreendimento: string;
  financeiro: string;
  status: string;
};

const FILTROS_PADRAO: FiltrosUsuarios = {
  id: "",
  nome: "",
  construtora: "",
  empreendimento: "",
  financeiro: "",
  status: "",
};

export default function UsuariosPage({ dados }: UserProviderProps) {
  const [Dados, setDados] = useState<UsuarioType[]>([]);
  const [dadosFiltrados, setDadosFiltrados] = useState<UsuarioType[]>([]);
  const router = useRouter();

  // Apenas filtros digitados - SEM estado de filtros aplicados
  const [filtros, setFiltros] = useState<FiltrosUsuarios>(FILTROS_PADRAO);

  // Atualiza os filtros - APENAS armazena o valor, SEM processar nada
  const atualizarFiltro = (campo: keyof FiltrosUsuarios, valor: string) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const usuariosNormalizados = useMemo(() => normalizarUsuarios(dados), [dados]);

  // Inicializa os dados quando o componente monta
  useEffect(() => {
    setDados(usuariosNormalizados);
    setDadosFiltrados(usuariosNormalizados);
  }, [usuariosNormalizados]);

  // Listas únicas - calculadas apenas uma vez
  const construtorasUnicas = useMemo(() => extrairConstrutorasUnicas(Dados), [Dados]);
  const financeirosUnicos = useMemo(() => extrairFinanceirosUnicos(Dados), [Dados]);
  const empreendimentosUnicos = useMemo(() => extrairEmpreendimentosUnicos(Dados), [Dados]);

  // APLICA OS FILTROS - SÓ executa quando o usuário clica no botão
  const aplicarFiltros = () => {
    let resultados = [...Dados];

    if (filtros.id) {
      resultados = resultados.filter((usuario) =>
        usuario.id.toString().includes(filtros.id)
      );
    }

    if (filtros.nome) {
      resultados = resultados.filter((usuario) =>
        usuario.nome.toLowerCase().includes(filtros.nome.toLowerCase())
      );
    }

    if (filtros.construtora) {
      resultados = resultados.filter((usuario) =>
        usuario.construtoras.some(
          (c) => c.construtora.id.toString() === filtros.construtora
        )
      );
    }

    if (filtros.empreendimento) {
      resultados = resultados.filter((usuario) =>
        usuario.empreendimentos.some(
          (e) => e.empreendimento.id.toString() === filtros.empreendimento
        )
      );
    }

    if (filtros.financeiro) {
      resultados = resultados.filter((usuario) =>
        usuario.financeiros.some(
          (f) => f.financeiro.id.toString() === filtros.financeiro
        )
      );
    }

    if (filtros.status) {
      const statusBooleano = filtros.status === "true";
      resultados = resultados.filter(
        (usuario) => usuario.status === statusBooleano
      );
    }

    setDadosFiltrados(resultados);
  };

  // Limpa todos os filtros
  const limparFiltros = () => {
    setFiltros({ ...FILTROS_PADRAO });
    setDadosFiltrados(Dados);
  };

  return (
    <Container maxW="95%" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
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
              as={MdPeople}
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
                Gerenciar Usuários
              </Heading>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Visualize e gerencie os usuários do sistema
              </Text>
            </Box>
          </Flex>

          {/* Botão Criar Usuário */}
          <Button
            leftIcon={<MdPersonAdd />}
            colorScheme="green"
            bg="#00713D"
            size={{ base: "md", md: "lg" }}
            onClick={() => router.push("/usuarios/cadastrar")}
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
            Criar Novo Usuário
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
          <UserProvider>
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
                Filtrar Usuários
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 6 }} spacing={4}>
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
                      value={filtros.id}
                      onChange={(e) => atualizarFiltro("id", e.target.value)}
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
                      value={filtros.nome}
                      onChange={(e) => atualizarFiltro("nome", e.target.value)}
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
                    value={filtros.construtora}
                    onChange={(e) => atualizarFiltro("construtora", e.target.value)}
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
                      color: "gray.100"
                    }}
                    sx={{
                      "& option": {
                        bg: "white",
                        color: "gray.800",
                      },
                      "&:is([data-theme='dark']) option, .chakra-ui-dark &option": {
                        bg: "gray.800",
                        color: "gray.100",
                      }
                    }}
                  >
                    {construtorasUnicas.map((construtora) => (
                      <option key={construtora.id} value={construtora.id}>
                        {construtora.fantasia}
                      </option>
                    ))}
                  </Select>
                </Box>

                {/* Filtro por Empreendimento */}
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb={2}
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Empreendimento
                  </Text>
                  <Select
                    placeholder="Todos os empreendimentos"
                    value={filtros.empreendimento}
                    onChange={(e) =>
                      atualizarFiltro("empreendimento", e.target.value)
                    }
                    bg="white"
                    color="gray.800"
                    borderColor="gray.300"
                    icon={<MdApartment />}
                    _hover={{ borderColor: "#00713D" }}
                    _focus={{
                      borderColor: "#00713D",
                      boxShadow: "0 0 0 1px #00713D",
                    }}
                    _dark={{ 
                      bg: "gray.800", 
                      borderColor: "gray.600",
                      color: "gray.100"
                    }}
                    sx={{
                      "& option": {
                        bg: "white",
                        color: "gray.800",
                      },
                      "&:is([data-theme='dark']) option, .chakra-ui-dark &option": {
                        bg: "gray.800",
                        color: "gray.100",
                      }
                    }}
                  >
                    {empreendimentosUnicos.map((empreendimento) => (
                      <option key={empreendimento.id} value={empreendimento.id}>
                        {empreendimento.nome}
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
                    value={filtros.financeiro}
                    onChange={(e) => atualizarFiltro("financeiro", e.target.value)}
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
                      color: "gray.100"
                    }}
                    sx={{
                      "& option": {
                        bg: "white",
                        color: "gray.800",
                      },
                      "&:is([data-theme='dark']) option, .chakra-ui-dark &option": {
                        bg: "gray.800",
                        color: "gray.100",
                      }
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
                    value={filtros.status}
                    onChange={(e) => atualizarFiltro("status", e.target.value)}
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
                      color: "gray.100"
                    }}
                    sx={{
                      "& option": {
                        bg: "white",
                        color: "gray.800",
                      },
                      "&:is([data-theme='dark']) option, .chakra-ui-dark &option": {
                        bg: "gray.800",
                        color: "gray.100",
                      }
                    }}
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </Select>
                </Box>
              </SimpleGrid>

              {/* Contador de resultados */}
              <Flex
                mt={4}
                justify="space-between"
                align={{ base: "stretch", md: "center" }}
                flexDir={{ base: "column", md: "row" }}
                gap={2}
              >
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                >
                  {dadosFiltrados.length} {dadosFiltrados.length === 1 ? "usuário encontrado" : "usuários encontrados"}
                </Text>
                <Flex
                  gap={2}
                  flexDir={{ base: "column", md: "row" }}
                  align={{ base: "stretch", md: "center" }}
                >
                  <Button
                    size="sm"
                    leftIcon={<MdSearch />}
                    colorScheme="green"
                    bg="#00713D"
                    color="white"
                    onClick={aplicarFiltros}
                    transition="all 0.2s"
                    _hover={{
                      bg: "#005a31",
                      transform: "translateY(-1px)",
                      shadow: "md",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    _dark={{
                      bg: "#00d672",
                      color: "gray.900",
                      _hover: { bg: "#00c060" },
                    }}
                  >
                    Aplicar Filtros
                  </Button>
                  {(filtros.id ||
                    filtros.nome ||
                    filtros.construtora ||
                    filtros.empreendimento ||
                    filtros.financeiro ||
                    filtros.status) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={limparFiltros}
                    >
                      Limpar Filtros
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Box>

            {/* Lista de Usuários */}
            <Box w="full">
              {dadosFiltrados.length > 0 ? (
                <Usuarios data={dadosFiltrados} />
              ) : Dados.length > 0 ? (
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
                    Nenhum usuário encontrado com os filtros aplicados
                  </Text>
                  <Button
                    colorScheme="green"
                    variant="outline"
                    onClick={limparFiltros}
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
          </UserProvider>
        </VStack>
      </VStack>
    </Container>
  );
}
