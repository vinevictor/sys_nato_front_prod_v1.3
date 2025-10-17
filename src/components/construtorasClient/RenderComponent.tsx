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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdAdd, MdBusiness, MdFilterAlt, MdSearch } from "react-icons/md";
import ModalEditarConstrutora from "@/components/construtoraCard/modal";

export interface ConstrutoraProps {
  data: ConstrutoraTypeAllData[];
  session: Session.AuthUser
}

export default function ConstrutoraPage({ data, session }: ConstrutoraProps) {
  const [construtoras, setConstrutoras] = useState<ConstrutoraTypeAllData[]>([]);
  const [dadosFiltrados, setDadosFiltrados] = useState<ConstrutoraTypeAllData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estados dos filtros
  const [filtros, setFiltros] = useState({
    id: "",
    razaosocial: "",
    fantasia: "",
    cnpj: "",
    status: "todos",
  });

  // Carrega dados iniciais
  useEffect(() => {
    setConstrutoras(data);
    setDadosFiltrados(data);
    setLoading(false);
  }, [data]);

  // Aplica filtros
  useEffect(() => {
    let resultado = [...construtoras];

    if (filtros.id) {
      resultado = resultado.filter((c) => c.id.toString() === filtros.id);
    }

    if (filtros.razaosocial) {
      resultado = resultado.filter((c) =>
        c.razaosocial.toLowerCase().includes(filtros.razaosocial.toLowerCase())
      );
    }

    if (filtros.fantasia) {
      resultado = resultado.filter((c) =>
        c.fantasia.toLowerCase().includes(filtros.fantasia.toLowerCase())
      );
    }

    if (filtros.cnpj) {
      const cnpjFiltro = filtros.cnpj.replace(/\D/g, "");
      resultado = resultado.filter((c) =>
        c.cnpj.replace(/\D/g, "").includes(cnpjFiltro)
      );
    }

    if (filtros.status !== "todos") {
      const statusBool = filtros.status === "ativo";
      resultado = resultado.filter((c) => c.status === statusBool);
    }

    setDadosFiltrados(resultado);
  }, [filtros, construtoras]);

  // Limpa todos os filtros
  const limparFiltros = () => {
    setFiltros({
      id: "",
      razaosocial: "",
      fantasia: "",
      cnpj: "",
      status: "todos",
    });
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
          <Text fontWeight="600" fontSize="lg" color="gray.700" _dark={{ color: "gray.200" }}>
            Filtros
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
            _dark={{ bg: "gray.700" }}
          >
            <option value="todos">Todos Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </Select>
        </SimpleGrid>

        <Flex mt={4} justify="space-between" align="center">
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            <strong>{dadosFiltrados.length}</strong> construtora(s) encontrada(s)
          </Text>
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={limparFiltros}
          >
            Limpar Filtros
          </Button>
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
        ) : construtoras.length > 0 ? (
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
              Nenhuma construtora encontrada com os filtros aplicados
            </Text>
            <Button
              variant="outline"
              colorScheme="green"
              onClick={limparFiltros}
            >
              Limpar Filtros
            </Button>
          </Flex>
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
            <Icon as={MdBusiness} boxSize={16} color="gray.400" />
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
              Nenhuma construtora cadastrada
            </Text>
            <Button
              leftIcon={<MdAdd />}
              colorScheme="green"
              onClick={onOpen}
            >
              Criar Primeira Construtora
            </Button>
          </Flex>
        )}
      </Box>

      {/* Modal de Criação/Edição */}
      <ModalEditarConstrutora isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
}
