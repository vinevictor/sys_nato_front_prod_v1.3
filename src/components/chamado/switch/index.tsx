import BtnChamado from "@/components/chamado/btn";
import { GetSessionServer } from "@/lib/auth_confg";
import {
  Badge,
  Box,
  Button,
  Code,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { MdAdd, MdChatBubble, MdSearch } from "react-icons/md";
import FiltroChamados from "../filtro/filtroChamado";

interface TypeChamado {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  departamento: string;
  prioridade: string;
  dth_qru: string;
  idUser: number;
  solicitacaoId: number;
  temp: any[];
  chat: any[];
  images: any[];
  createAt: string;
  updatedAt?: string;
  user_nome?: string;
}

interface PageProps {
  searchParams: {
    id?: string;
    busca?: string;
    status?: string;
    prioridade?: string;
    departamento?: string;
  };
}

async function getChamados(session: any, filtros: PageProps["searchParams"]) {
  const params = new URLSearchParams(filtros as any);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/chamado?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("getChamados status:", response.status);
    return [];
  }
  return response.json();
}

async function getChamadosAllOptions(session: any): Promise<TypeChamado[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/chamado`,
    {
      headers: { Authorization: `Bearer ${session?.token}` },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("getChamadosAllOptions status:", response.status);
    return [];
  }

  const data = await response.json();
  return data ?? [];
}

// Função para definir cor do badge de status
function getStatusColor(status: string) {
  switch (status) {
    case "ABERTO":
      return "blue";
    case "EM_ANDAMENTO":
      return "yellow";
    case "LV2":
      return "purple";
    case "CONCLUIDO":
      return "green";
    default:
      return "gray";
  }
}

// Função para definir cor do badge de prioridade
function getPrioridadeColor(prioridade: string) {
  switch (prioridade?.toUpperCase()) {
    case "ALTA":
      return "red";
    case "MEDIA":
      return "orange";
    case "BAIXA":
      return "green";
    default:
      return "gray";
  }
}

export default async function ChamadoSwitch({
  searchParams,
}: {
  searchParams: PageProps["searchParams"];
}) {
  const session = await GetSessionServer();

  const chamadosFiltrados = session
    ? await getChamados(session, searchParams)
    : [];

  const todosChamadosParaOpcoes = session
    ? await getChamadosAllOptions(session)
    : [];

  const statusUnicos: string[] = [
    ...new Set(todosChamadosParaOpcoes.map((c: TypeChamado) => c.status)),
  ].filter(Boolean);

  const prioridadesUnicas: string[] = [
    ...new Set(todosChamadosParaOpcoes.map((c: TypeChamado) => c.prioridade)),
  ].filter(Boolean);

  return (
    <Container
      maxW={{ base: "100%", sm: "95%", md: "96%", lg: "98%" }}
      py={{ base: 4, md: 5, lg: 6 }}
      px={{ base: 3, sm: 4, md: 5, lg: 6 }}
    >
      <VStack spacing={{ base: 5, md: 6, lg: 8 }} align="stretch" w="full">
        {/* Cabeçalho da Página */}
        <Flex
          bg="white"
          _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
          borderBottomWidth="2px"
          borderBottomColor="#00713D"
          p={{ base: 4, sm: 5, md: 6 }}
          align="center"
          justify="space-between"
          wrap="wrap"
          gap={{ base: 3, md: 4 }}
          borderRadius={{ base: "md", md: "lg", xl: "xl" }}
          borderBottomRadius={0}
          shadow={{ base: "sm", md: "md", lg: "lg" }}
          flexDir={{ base: "column", md: "row" }}
        >
          {/* Título com ícone */}
          <Flex align="center" gap={{ base: 2, md: 3 }}>
            <Box
              p={{ base: 1.5, md: 2 }}
              bg="green.50"
              _dark={{ bg: "green.900" }}
              borderRadius="md"
              display={{ base: "none", sm: "block" }}
            >
              <MdChatBubble size={32} color="#00713D" />
            </Box>
            <Box>
              <Heading
                fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Chamados de Suporte
              </Heading>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="gray.600"
                _dark={{ color: "gray.400" }}
                display={{ base: "none", sm: "block" }}
              >
                Gerencie e acompanhe seus chamados
              </Text>
            </Box>
          </Flex>

          {/* Botão Criar Chamado */}
          <Button
            as={Link}
            href="/chamado/novo"
            leftIcon={<MdAdd />}
            colorScheme="green"
            bg="#00713D"
            size={{ base: "md", md: "lg" }}
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
            Novo Chamado
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
          <FiltroChamados
            statusUnicos={statusUnicos}
            prioridadesUnicas={prioridadesUnicas}
          />

          {/* Contador de resultados */}
          <Flex justify="space-between" align="center" px={2}>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.600"
              _dark={{ color: "gray.400" }}
            >
              {chamadosFiltrados.length}{" "}
              {chamadosFiltrados.length === 1
                ? "chamado encontrado"
                : "chamados encontrados"}
            </Text>
          </Flex>

          <Divider borderColor="gray.300" _dark={{ borderColor: "gray.600" }} />

          {/* Lista de Chamados */}
          <Box w="full">
            {chamadosFiltrados.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {chamadosFiltrados.map((item: TypeChamado) => (
                  <Box
                    key={item.id}
                    bg="white"
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                    overflow="hidden"
                    transition="all 0.3s"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: "xl",
                      borderColor: "#00713D",
                    }}
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.700",
                      _hover: {
                        borderColor: "#00d672",
                      },
                    }}
                  >
                    <Box p={{ base: 4, md: 5 }}>
                      <Flex
                        justifyContent="space-between"
                        alignItems="start"
                        gap={4}
                        flexDir={{ base: "column", md: "row" }}
                      >
                        {/* Informações do Chamado */}
                        <Flex flexDir="column" gap={3} flex="1">
                          {/* Título e Badges */}
                          <Flex gap={2} alignItems="center" flexWrap="wrap">
                            <Heading
                              size={{ base: "sm", md: "md" }}
                              color="#023147"
                              _dark={{ color: "gray.100" }}
                            >
                              {item.titulo}
                            </Heading>
                            <Badge
                              colorScheme={getStatusColor(item.status)}
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              {item.status}
                            </Badge>
                            <Badge
                              colorScheme={getPrioridadeColor(item.prioridade)}
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              {item.prioridade?.toUpperCase()}
                            </Badge>
                          </Flex>

                          {/* Informações adicionais */}
                          <Flex gap={2} flexWrap="wrap" alignItems="center">
                            <Text
                              fontSize="sm"
                              color="gray.600"
                              _dark={{ color: "gray.400" }}
                            >
                              Solicitante: {item.user_nome}
                            </Text>
                            <Text color="gray.400">•</Text>
                            <Text
                              fontSize="sm"
                              color="gray.600"
                              _dark={{ color: "gray.400" }}
                            >
                              Departamento: {item.departamento}
                            </Text>
                          </Flex>

                          {/* Metadados */}
                          <Flex gap={3} flexWrap="wrap">
                            <Code
                              fontSize="xs"
                              colorScheme="gray"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              ID: {item.id}
                            </Code>
                            <Code
                              fontSize="xs"
                              colorScheme="gray"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Aberto em:{" "}
                              {new Date(item.createAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </Code>
                            {item.updatedAt && (
                              <Code
                                fontSize="xs"
                                colorScheme="gray"
                                px={2}
                                py={1}
                                borderRadius="md"
                              >
                                Atualizado:{" "}
                                {new Date(item.updatedAt).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </Code>
                            )}
                          </Flex>
                        </Flex>

                        {/* Botões de Ação */}
                        <Flex
                          gap={2}
                          flexShrink={0}
                          flexDir={{ base: "row", md: "column", lg: "row" }}
                          w={{ base: "full", md: "auto" }}
                        >
                          <BtnChamado name="Editar" id={item.id} type="edit" />
                          <BtnChamado
                            name="Excluir"
                            id={item.id}
                            type="delete"
                          />
                        </Flex>
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </VStack>
            ) : (
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
                  textAlign="center"
                >
                  Nenhum chamado encontrado
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  _dark={{ color: "gray.500" }}
                  textAlign="center"
                >
                  Tente ajustar os filtros ou criar um novo chamado
                </Text>
                <Button
                  as={Link}
                  href="/chamado/novo"
                  leftIcon={<MdAdd />}
                  colorScheme="green"
                  bg="#00713D"
                  _hover={{ bg: "#005a31" }}
                  _dark={{
                    bg: "#00d672",
                    color: "gray.900",
                    _hover: { bg: "#00c060" },
                  }}
                >
                  Criar Primeiro Chamado
                </Button>
              </Flex>
            )}
          </Box>
        </VStack>
      </VStack>
    </Container>
  );
}
