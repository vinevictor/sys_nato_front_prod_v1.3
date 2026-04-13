"use client";
import Financeiras from "@/components/financeirasCard";
import { ModalEditarFinanceira } from "@/components/financeirasCard/modal";
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
  VStack,
  useDisclosure,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import {
  MdAccountBalance,
  MdAdd,
  MdBadge,
  MdBusiness,
  MdSearch,
  MdClear,
} from "react-icons/md";

interface FinanceirasClientProps {
  session: Session.SessionServer & { token?: string };
}

export default function FinanceirasClient({ session }: FinanceirasClientProps) {
  const [financeiras, setFinanceiras] = useState<any[]>([]);
  const [dadosFiltrados, setDadosFiltrados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBusca, setLoadingBusca] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [filtros, setFiltros] = useState({
    id: "",
    razaosocial: "",
    fantasia: "",
    cnpj: "",
    status: "",
  });

  const selectStyles = {
    bg: "white",
    color: "gray.800",
    _dark: { bg: "gray.800", color: "white", borderColor: "gray.600" },
    sx: {
      option: { bg: "white", color: "gray.800" },
      _dark: {
        option: { bg: "#2D3748", color: "white" },
      },
    },
  };

  const handleFiltrar = useCallback(async () => {
    setLoadingBusca(true);
    try {
      const params = new URLSearchParams();
      if (filtros.id) params.append("id", filtros.id);
      if (filtros.razaosocial)
        params.append("razaosocial", filtros.razaosocial);
      if (filtros.fantasia) params.append("fantasia", filtros.fantasia);
      if (filtros.cnpj) params.append("cnpj", filtros.cnpj.replace(/\D/g, ""));
      if (filtros.status) params.append("status", filtros.status);

      const response = await fetch(
        `/api/financeira/search?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );

      if (!response.ok) throw new Error();
      const result = await response.json();
      setDadosFiltrados(result);
    } catch (error) {
      toast({ title: "Erro ao buscar", status: "error" });
    } finally {
      setLoadingBusca(false);
    }
  }, [filtros, session?.token, toast]);

  const GetFinanceiras = async () => {
    setLoading(true);
    try {
      const req = await fetch("/api/financeira/getall");
      const res = await req.json();
      setFinanceiras(res);
      setDadosFiltrados(res);
    } catch (error) {
      toast({ title: "Erro ao carregar dados", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetFinanceiras();
  }, []);

  const limparFiltros = () => {
    setFiltros({ id: "", razaosocial: "", fantasia: "", cnpj: "", status: "" });
    setDadosFiltrados(financeiras);
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
              as={MdAccountBalance}
              w={10}
              h={10}
              color="#00713D"
              _dark={{ color: "#00d672" }}
            />
            <Box>
              <Heading size="lg" color="#023147" _dark={{ color: "gray.100" }}>
                Gerenciar CCAs
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                Controle as financeiras do sistema
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
            Criar Nova Financeira
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
          {/* Filtros */}
          <Box
            w="full"
            bg="gray.50"
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            _dark={{ bg: "gray.900", borderColor: "gray.700" }}
          >
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3, xl: 5 }}
              spacing={4}
              alignItems="flex-end"
            >
              <Box>
                <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
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
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
                  Razão Social
                </Text>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={MdSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Razão Social"
                    value={filtros.razaosocial}
                    onChange={(e) =>
                      setFiltros({ ...filtros, razaosocial: e.target.value })
                    }
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                  />
                </InputGroup>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
                  Fantasia
                </Text>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={MdBusiness} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Fantasia"
                    value={filtros.fantasia}
                    onChange={(e) =>
                      setFiltros({ ...filtros, fantasia: e.target.value })
                    }
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                  />
                </InputGroup>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
                  CNPJ
                </Text>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={MdBadge} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="CNPJ"
                    value={filtros.cnpj}
                    onChange={(e) =>
                      setFiltros({ ...filtros, cnpj: e.target.value })
                    }
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                  />
                </InputGroup>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
                  Status
                </Text>
                <Select
                  placeholder="Todos"
                  value={filtros.status}
                  onChange={(e) =>
                    setFiltros({ ...filtros, status: e.target.value })
                  }
                  {...selectStyles}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </Select>
              </Box>
            </SimpleGrid>

            <Flex mt={4} justify="space-between" align="center">
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                <strong>{dadosFiltrados.length}</strong> CCA(s) encontrada(s)
              </Text>
              <HStack spacing={3}>
                <Button
                  leftIcon={<MdClear />}
                  variant="ghost"
                  colorScheme="red"
                  size="sm"
                  onClick={limparFiltros}
                >
                  Limpar
                </Button>
                <Button
                  leftIcon={<MdSearch />}
                  colorScheme="green"
                  bg="#00713D"
                  size="sm"
                  isLoading={loadingBusca}
                  onClick={handleFiltrar}
                >
                  Filtrar
                </Button>
              </HStack>
            </Flex>
          </Box>

          {/* Listagem */}
          <Box w="full">
            {loading ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height="300px" borderRadius="xl" />
                ))}
              </SimpleGrid>
            ) : dadosFiltrados.length > 0 ? (
              <Financeiras data={dadosFiltrados} session={session} />
            ) : (
              <Flex flexDir="column" align="center" py={10}>
                <Icon as={MdSearch} w={12} h={12} color="gray.300" />
                <Text mt={2} color="gray.500">
                  Nenhum resultado encontrado.
                </Text>
              </Flex>
            )}
          </Box>
        </VStack>
      </VStack>
      <ModalEditarFinanceira isOpen={isOpen} onClose={onClose} />
    </Container>
  );
}
