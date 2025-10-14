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
import { useEffect, useState } from "react";
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
  dados: UsuarioType[];
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
export default function UsuariosPage({ dados }: UserProviderProps) {
  const [Dados, setDados] = useState<UsuarioType[]>([]);
  const [dadosFiltrados, setDadosFiltrados] = useState<UsuarioType[]>([]);
  const router = useRouter();

  // Estados dos filtros
  const [filtroId, setFiltroId] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroConstrutora, setFiltroConstrutora] = useState("");
  const [filtroEmpreendimento, setFiltroEmpreendimento] = useState("");
  const [filtroFinanceiro, setFiltroFinanceiro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  useEffect(() => {
    setDados(dados);
    setDadosFiltrados(dados);
  }, [dados]);

  const construtorasUnicas = extrairConstrutorasUnicas(Dados);
  const financeirosUnicos = extrairFinanceirosUnicos(Dados);
  const empreendimentosUnicos = extrairEmpreendimentosUnicos(Dados);

  // Função de filtro
  useEffect(() => {
    let resultados = [...Dados];

    // Filtro por ID
    if (filtroId) {
      resultados = resultados.filter((usuario) =>
        usuario.id.toString().includes(filtroId)
      );
    }

    // Filtro por Nome
    if (filtroNome) {
      resultados = resultados.filter((usuario) =>
        usuario.nome.toLowerCase().includes(filtroNome.toLowerCase())
      );
    }

    // Filtro por Construtora
    if (filtroConstrutora) {
      resultados = resultados.filter((usuario) =>
        usuario.construtoras.some(
          (c) => c.construtora.id.toString() === filtroConstrutora
        )
      );
    }

    // Filtro por Empreendimento
    if (filtroEmpreendimento) {
      resultados = resultados.filter((usuario) =>
        usuario.empreendimentos.some(
          (e) => e.empreendimento.id.toString() === filtroEmpreendimento
        )
      );
    }

    // Filtro por Financeiro
    if (filtroFinanceiro) {
      resultados = resultados.filter((usuario) =>
        usuario.financeiros.some(
          (f) => f.financeiro.id.toString() === filtroFinanceiro
        )
      );
    }

    // Filtro por Status (Ativo/Inativo)
    if (filtroStatus) {
      const statusBooleano = filtroStatus === "true";
      resultados = resultados.filter((usuario) => usuario.status === statusBooleano);
    }

    setDadosFiltrados(resultados);
  }, [filtroId, filtroNome, filtroConstrutora, filtroEmpreendimento, filtroFinanceiro, filtroStatus, Dados]);

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
                    value={filtroEmpreendimento}
                    onChange={(e) => setFiltroEmpreendimento(e.target.value)}
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
              <Flex mt={4} justify="space-between" align="center">
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                >
                  {dadosFiltrados.length} {dadosFiltrados.length === 1 ? "usuário encontrado" : "usuários encontrados"}
                </Text>
                
                {(filtroId || filtroNome || filtroConstrutora || filtroEmpreendimento || filtroFinanceiro || filtroStatus) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => {
                      setFiltroId("");
                      setFiltroNome("");
                      setFiltroConstrutora("");
                      setFiltroEmpreendimento("");
                      setFiltroFinanceiro("");
                      setFiltroStatus("");
                    }}
                  >
                    Limpar Filtros
                  </Button>
                )}
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
                    onClick={() => {
                      setFiltroId("");
                      setFiltroNome("");
                      setFiltroConstrutora("");
                      setFiltroEmpreendimento("");
                      setFiltroFinanceiro("");
                      setFiltroStatus("");
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
          </UserProvider>
        </VStack>
      </VStack>
    </Container>
  );
}
