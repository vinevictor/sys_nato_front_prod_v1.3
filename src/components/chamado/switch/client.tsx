"use client";
import BtnChamado from "@/components/chamado/btn";
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
import { MdAdd, MdChatBubble } from "react-icons/md";
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

interface ChamadoSwitchClientProps {
  chamadosFiltrados: TypeChamado[];
  statusUnicos: string[];
  prioridadesUnicas: string[];
  searchParams: PageProps["searchParams"];
}

export default function ChamadoSwitchClient({
  chamadosFiltrados,
  statusUnicos,
  prioridadesUnicas,
  searchParams,
}: ChamadoSwitchClientProps) {
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
              <MdChatBubble size={24} color="#00713D" />
            </Box>
            <Heading
              fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
              size={{ base: "md", md: "lg" }}
              color="#023147"
              _dark={{ color: "gray.100" }}
            >
              Chamados
            </Heading>
          </Flex>

          {/* Botão Novo Chamado */}
          <Link href="/chamado/novo" style={{ textDecoration: "none" }}>
            <Button
              colorScheme="green"
              bg="#00713D"
              _hover={{ bg: "#005a31" }}
              _dark={{
                bg: "#00d672",
                color: "gray.900",
                _hover: { bg: "#00c060" },
              }}
              leftIcon={<MdAdd />}
              size={{ base: "md", md: "lg" }}
              borderRadius="lg"
            >
              Novo Chamado
            </Button>
          </Link>
        </Flex>

        {/* Filtros */}
        <FiltroChamados
          statusUnicos={statusUnicos}
          prioridadesUnicas={prioridadesUnicas}
        />

        {/* Lista de Chamados */}
        <VStack spacing={4} align="stretch">
          {chamadosFiltrados.length === 0 ? (
            <Box
              bg="white"
              _dark={{ bg: "gray.800" }}
              p={8}
              borderRadius="xl"
              shadow="lg"
              textAlign="center"
            >
              <Icon as={MdChatBubble} boxSize={12} color="gray.400" mb={4} />
              <Text
                fontSize="lg"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Nenhum chamado encontrado
              </Text>
            </Box>
          ) : (
            chamadosFiltrados.map((chamado: TypeChamado) => (
              <Box
                key={chamado.id}
                bg="white"
                _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                p={6}
                borderRadius="xl"
                shadow="lg"
                borderWidth="1px"
                borderColor="gray.200"
                _hover={{
                  shadow: "xl",
                  borderColor: "#00713D",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "start", md: "center" }}
                  gap={4}
                >
                  {/* Informações do Chamado */}
                  <VStack align="start" spacing={3} flex={1}>
                    <Flex align="center" gap={3} wrap="wrap">
                      <Heading
                        size="md"
                        color="#023147"
                        _dark={{ color: "gray.100" }}
                      >
                        {chamado.titulo}
                      </Heading>
                      <Badge
                        colorScheme={getStatusColor(chamado.status)}
                        px={3}
                        py={1}
                      >
                        {chamado.status}
                      </Badge>
                      <Badge
                        colorScheme={getPrioridadeColor(chamado.prioridade)}
                        px={3}
                        py={1}
                      >
                        {chamado.prioridade}
                      </Badge>
                    </Flex>

                    <Text
                      color="gray.600"
                      _dark={{ color: "gray.300" }}
                      noOfLines={2}
                    >
                      {chamado.descricao}
                    </Text>

                    <Flex align="center" gap={4} fontSize="sm" color="gray.500">
                      <Text>
                        Criado em:{" "}
                        {new Date(chamado.createAt).toLocaleDateString("pt-BR")}
                      </Text>
                      {chamado.user_nome && (
                        <Text>Por: {chamado.user_nome}</Text>
                      )}
                    </Flex>
                  </VStack>

                  {/* Ações */}
                  <Flex gap={3} align="center">
                    <Link
                      href={`/chamado/${chamado.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                        leftIcon={<MdChatBubble />}
                      >
                        Ver Detalhes
                      </Button>
                    </Link>

                    <BtnChamado chamado={chamado} />
                  </Flex>
                </Flex>
              </Box>
            ))
          )}
        </VStack>
      </VStack>
    </Container>
  );
}
