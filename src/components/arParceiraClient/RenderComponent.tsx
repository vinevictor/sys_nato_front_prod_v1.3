"use client";

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
  Card,
  CardBody,
  Badge,
  HStack,
  StackDivider,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // <--- Importante para recarregar dados
import {
  MdAdd,
  MdFilterAlt,
  MdSearch,
  MdStorefront,
  MdPlace,
  MdPhone,
  MdPerson,
  MdEdit,
} from "react-icons/md";
import ModalEditarArParceira from "../arParceiraCard/modal";

// --- TIPAGEM ---
export interface ArParceiraType {
  id: number;
  status: boolean;
  ac?: string;
  nome: string;
  responsavel?: string;
  telefone?: string;
  valor?: string;
  endereco?: string;
  obs?: string;
  cidade?: {
    id: number;
    nome: string;
    estado?: {
      sigla: string;
      nome: string;
      id: number;
    };
  };
}

export interface ArParceiraPageProps {
  data: ArParceiraType[];
  session: any;
}

export default function ArParceiraClientPage({
  data,
  session,
}: ArParceiraPageProps) {
  const router = useRouter();
  const [parceiras, setParceiras] = useState<ArParceiraType[]>([]);
  const [dadosFiltrados, setDadosFiltrados] = useState<ArParceiraType[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<number | undefined>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estados dos filtros
  const [filtros, setFiltros] = useState({
    buscaGeral: "",
    cidade: "",
    ac: "",
    status: "todos",
  });

  useEffect(() => {
    setParceiras(data);
    setDadosFiltrados(data);
    setLoading(false);
  }, [data]);

  // --- LÓGICA DE FILTRAGEM ---
  useEffect(() => {
    let resultado = [...parceiras];

    if (filtros.buscaGeral) {
      const termo = filtros.buscaGeral.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          (p.responsavel && p.responsavel.toLowerCase().includes(termo))
      );
    }

    if (filtros.cidade) {
      const termoCidade = filtros.cidade.toLowerCase();
      resultado = resultado.filter((p) =>
        p.cidade?.nome.toLowerCase().includes(termoCidade)
      );
    }

    if (filtros.ac) {
      resultado = resultado.filter((p) =>
        p.ac?.toLowerCase().includes(filtros.ac.toLowerCase())
      );
    }

    if (filtros.status !== "todos") {
      const isAtivo = filtros.status === "ativo";
      resultado = resultado.filter((p) => p.status === isAtivo);
    }

    setDadosFiltrados(resultado);
  }, [filtros, parceiras]);

  const limparFiltros = () => {
    setFiltros({
      buscaGeral: "",
      cidade: "",
      ac: "",
      status: "todos",
    });
  };

  // --- HANDLERS DO MODAL ---

  const handleNovo = () => {
    setSelectedId(undefined);
    onOpen();
  };

  const handleEditar = (id: number) => {
    setSelectedId(id);
    onOpen();
  };

  const handleSuccessModal = () => {
    onClose();
    setLoading(true);
    router.refresh();
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
      {/* --- CABEÇALHO --- */}
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
          <Icon as={MdStorefront} boxSize={8} color="#00713D" />
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="#023147"
            _dark={{ color: "white" }}
          >
            Gestão de AR Parceiras
          </Heading>
        </Flex>

        <Button
          leftIcon={<MdAdd />}
          colorScheme="green"
          bg="#00713D"
          _hover={{ bg: "#005a31" }}
          onClick={handleNovo}
          size={{ base: "md", md: "lg" }}
        >
          Nova Parceira
        </Button>
      </Flex>

      {/* --- BOX DE FILTROS --- */}
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
            Filtros
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Input
            placeholder="Buscar por Nome ou Responsável"
            value={filtros.buscaGeral}
            onChange={(e) =>
              setFiltros({ ...filtros, buscaGeral: e.target.value })
            }
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
          />
          <Input
            placeholder="Filtrar por Cidade"
            value={filtros.cidade}
            onChange={(e) => setFiltros({ ...filtros, cidade: e.target.value })}
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
          />
          <Select
            placeholder="Selecione a AC"
            value={filtros.ac}
            onChange={(e) => setFiltros({ ...filtros, ac: e.target.value })}
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
          >
            <option value="SOLUTI">SOLUTI</option>
            <option value="ACD">AC ACD</option>
            <option value="MAXIMUS">MAXIMUS</option>
            <option value="CERTITOP">CERTITOP</option>
          </Select>
          <Select
            value={filtros.status}
            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
          >
            <option value="todos">Todos Status</option>
            <option value="ativo">Ativa</option>
            <option value="inativo">Inativa</option>
          </Select>
        </SimpleGrid>

        <Flex mt={4} justify="space-between" align="center">
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            <strong>{dadosFiltrados.length}</strong> parceira(s) encontrada(s)
          </Text>
          {(filtros.buscaGeral ||
            filtros.cidade ||
            filtros.ac ||
            filtros.status !== "todos") && (
            <Button
              size="sm"
              variant="outline"
              colorScheme="gray"
              onClick={limparFiltros}
            >
              Limpar Filtros
            </Button>
          )}
        </Flex>
      </Box>

      {/* --- LISTAGEM --- */}
      <Box w="full">
        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} height="200px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : dadosFiltrados.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {dadosFiltrados.map((item) => (
              <Card
                key={item.id}
                shadow="md"
                _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
                transition="all 0.2s"
                borderTop="4px solid"
                borderColor={item.status ? "green.500" : "red.400"}
                bg="white"
                _dark={{ bg: "gray.800" }}
              >
                <CardBody>
                  <Flex justify="space-between" mb={2}>
                    <Badge colorScheme={item.status ? "green" : "red"}>
                      {item.status ? "ATIVA" : "INATIVA"}
                    </Badge>
                    {item.ac && <Badge colorScheme="purple">{item.ac}</Badge>}
                  </Flex>

                  <Heading
                    size="md"
                    mb={2}
                    noOfLines={1}
                    title={item.nome}
                    color="gray.700"
                    _dark={{ color: "white" }}
                  >
                    {item.nome}
                  </Heading>

                  <Stack
                    divider={<StackDivider />}
                    spacing={2}
                    fontSize="sm"
                    color="gray.600"
                    _dark={{ color: "gray.300" }}
                  >
                    <HStack>
                      <Icon as={MdPlace} color="green.500" />
                      <Text noOfLines={1}>
                        {item.cidade?.nome} - {item.cidade?.estado?.sigla}
                      </Text>
                    </HStack>

                    <HStack>
                      <Icon as={MdPerson} color="blue.400" />
                      <Text noOfLines={1}>{item.responsavel || "N/D"}</Text>
                    </HStack>

                    <HStack>
                      <Icon as={MdPhone} color="orange.400" />
                      <Text>{item.telefone || "N/D"}</Text>
                    </HStack>
                  </Stack>

                  <Button
                    mt={4}
                    w="full"
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<MdEdit />}
                    onClick={() => handleEditar(item.id)}
                  >
                    Detalhes / Editar
                  </Button>
                </CardBody>
              </Card>
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
              Nenhum registro encontrado.
            </Text>
            <Button
              variant="outline"
              colorScheme="green"
              onClick={limparFiltros}
            >
              Limpar Filtros
            </Button>
          </Flex>
        )}
      </Box>

      {/* --- MODAL DE EDIÇÃO/CRIAÇÃO --- */}
      <ModalEditarArParceira
        isOpen={isOpen}
        onClose={onClose}
        parceiraId={selectedId}
        onSuccess={handleSuccessModal}
      />
    </VStack>
  );
}
