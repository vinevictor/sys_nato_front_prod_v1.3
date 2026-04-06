"use client";
import Construtora from "@/components/construtora_compoment";
import { ConstrutoraTypeAllData } from "@/types/construtora";
import { Session } from "@/types/session";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
  useDisclosure,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { useState, useCallback } from "react";
import {
  MdAdd,
  MdBusiness,
  MdFilterAlt,
  MdSearch,
  MdClear,
} from "react-icons/md";
import ModalEditarConstrutora from "@/components/construtoraCard/modal";

export interface ConstrutoraProps {
  data: ConstrutoraTypeAllData[];
  session: Session.AuthUser & { token?: string }; // Garantindo acesso ao token
}

export default function ConstrutoraPage({ data, session }: ConstrutoraProps) {
  const [dadosFiltrados, setDadosFiltrados] =
    useState<ConstrutoraTypeAllData[]>(data);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Estados dos filtros
  const [filtros, setFiltros] = useState({
    id: "",
    razaosocial: "",
    fantasia: "",
    cnpj: "",
    status: "todos",
  });

  // Função disparada apenas pelo botão Filtrar ou ao Limpar
  const handleFiltrar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filtros.id) params.append("id", filtros.id);
      if (filtros.razaosocial)
        params.append("razaosocial", filtros.razaosocial);
      if (filtros.fantasia) params.append("fantasia", filtros.fantasia);
      if (filtros.cnpj) params.append("cnpj", filtros.cnpj.replace(/\D/g, ""));
      if (filtros.status !== "todos") params.append("status", filtros.status);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_STRAPI_API_URL
        }/construtora/search?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao buscar dados");

      const result = await response.json();
      setDadosFiltrados(result);
    } catch (error) {
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
  }, [filtros, session.token, toast]);

  // Limpa todos os filtros e restaura os dados originais
  const limparFiltros = () => {
    setFiltros({
      id: "",
      razaosocial: "",
      fantasia: "",
      cnpj: "",
      status: "todos",
    });
    setDadosFiltrados(data);
  };

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
          <Icon as={MdBusiness} boxSize={8} color="#00713D" />
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="#023147"
            _dark={{ color: "white" }}
          >
            Gerenciar Construtoras
          </Heading>
        </Flex>

        <Button
          leftIcon={<MdAdd />}
          colorScheme="green"
          bg="#00713D"
          _hover={{ bg: "#005a31" }}
          _dark={{ bg: "#00d672", _hover: { bg: "#00c060" } }}
          size={{ base: "md", md: "lg" }}
          onClick={onOpen}
        >
          Criar Nova Construtora
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
            placeholder="ID"
            type="number"
            value={filtros.id}
            onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
          />
          <Input
            placeholder="Razão Social"
            value={filtros.razaosocial}
            onChange={(e) =>
              setFiltros({ ...filtros, razaosocial: e.target.value })
            }
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
          />
          <Input
            placeholder="Nome Fantasia"
            value={filtros.fantasia}
            onChange={(e) =>
              setFiltros({ ...filtros, fantasia: e.target.value })
            }
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
          />
          <Input
            placeholder="CNPJ"
            value={filtros.cnpj}
            onChange={(e) => setFiltros({ ...filtros, cnpj: e.target.value })}
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
          />
          <Select
            value={filtros.status}
            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
            bg="gray.50"
            color="gray.700" // Cor do texto no modo claro
            _dark={{
              bg: "gray.700",
              color: "white", // Cor do texto no modo escuro
              borderColor: "gray.600",
            }}
            sx={{
              // Isso força os itens da lista (options) a terem cores visíveis
              "> option": {
                background: "white",
                color: "gray.700",
              },
              _dark: {
                "> option": {
                  background: "#2D3748", // gray.700 do Chakra
                  color: "white",
                },
              },
            }}
          >
            <option value="todos">Todos Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </Select>
        </SimpleGrid>

        <Flex mt={6} justify="space-between" align="center">
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            <strong>{dadosFiltrados.length}</strong> construtora(s)
            encontrada(s)
          </Text>

          <HStack spacing={3}>
            <Button
              leftIcon={<MdClear />}
              size="md"
              variant="outline"
              colorScheme="gray"
              onClick={limparFiltros}
              isDisabled={loading}
            >
              Limpar
            </Button>
            <Button
              leftIcon={<MdSearch />}
              size="md"
              colorScheme="green"
              bg="#00713D"
              _hover={{ bg: "#005a31" }}
              isLoading={loading}
              onClick={handleFiltrar}
            >
              Filtrar
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Lista de Construtoras */}
      <Box w="full">
        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} height="200px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : dadosFiltrados.length > 0 ? (
          <Construtora data={dadosFiltrados} session={session} />
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
              Nenhuma construtora encontrada
            </Text>
            <Button
              variant="outline"
              colorScheme="green"
              onClick={limparFiltros}
            >
              Ver Todas
            </Button>
          </Flex>
        )}
      </Box>

      <ModalEditarConstrutora isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
}
