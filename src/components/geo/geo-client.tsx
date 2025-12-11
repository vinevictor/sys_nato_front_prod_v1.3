"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Select,
  VStack,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Heading,
  StackDivider,
  Stack,
  Badge,
  Icon,
  Flex,
  useToast,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import {
  MdMap,
  MdLocationOn,
  MdPlace,
  MdPhone,
  MdPerson,
  MdInfoOutline,
  MdStorefront,
  MdNearMe, // Ícone novo para distância
} from "react-icons/md";
import { buscarProximas, getCidades } from "@/actions/geo/geoActions";

// --- TIPAGEM ---
interface Partner {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  responsavel?: string;
  valor?: string;
  obs?: string;
}

interface CityGroup {
  cidade: string;
  uf: string;
  distancia_km: number;
  parceiros: Partner[];
}

interface GeoClientProps {
  estados: { id: number; sigla: string; nome: string }[];
}

// --- SUB-COMPONENTE: CARD DA CIDADE ---
const CityCard = ({
  city,
  isClosest,
}: {
  city: CityGroup;
  isClosest: boolean;
}) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    city.parceiros[0]?.id.toString()
  );

  const currentPartner = useMemo(
    () =>
      city.parceiros.find((p) => p.id.toString() === selectedPartnerId) ||
      city.parceiros[0],
    [city.parceiros, selectedPartnerId]
  );

  const isVoucher = currentPartner?.valor
    ?.toString()
    .toUpperCase()
    .includes("VOUCHER");

  return (
    <Card
      borderTop="4px solid"
      borderColor={isClosest ? "#00713D" : "gray.300"}
      shadow="lg"
      bg="white"
      _dark={{ bg: "gray.800" }}
      transform={isClosest ? "scale(1.02)" : "none"}
      transition="all 0.2s"
    >
      <CardHeader pb={2}>
        {/* --- CABEÇALHO DO CARD COM DESTAQUE NA DISTÂNCIA --- */}
        <Flex justify="space-between" align="start" mb={3}>
          {/* Lado Esquerdo: Nome da Cidade e Badge de Proximidade */}
          <Box flex="1" pr={2}>
            {isClosest && (
              <Badge
                colorScheme="green"
                mb={2}
                variant="solid"
                px={2}
                py={0.5}
                borderRadius="full"
              >
                ★ Cidade Mais Próxima
              </Badge>
            )}
            <HStack align="flex-start" spacing={1}>
              <Icon
                as={MdPlace}
                color={isClosest ? "green.500" : "gray.400"}
                mt={1}
              />
              <Box>
                <Heading
                  size="md"
                  color="gray.700"
                  _dark={{ color: "white" }}
                  lineHeight="shorter"
                >
                  {city.cidade}
                </Heading>
                <Text fontSize="sm" fontWeight="bold" color="gray.400">
                  {city.uf}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box
            bg={isClosest ? "green.50" : "gray.50"}
            _dark={{ bg: isClosest ? "rgba(0, 113, 61, 0.2)" : "gray.700" }}
            px={3}
            py={2}
            borderRadius="lg"
            border="1px solid"
            borderColor={isClosest ? "green.200" : "gray.200"}
            textAlign="center"
            minW="80px"
          >
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="gray.500"
              textTransform="uppercase"
              mb={-1}
            >
              Distância
            </Text>
            <HStack justify="center" align="baseline" spacing={0}>
              <Text
                fontSize="2xl"
                fontWeight="800"
                color={isClosest ? "green.600" : "gray.700"}
                _dark={{ color: isClosest ? "green.300" : "white" }}
              >
                {city.distancia_km}
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="gray.500" ml={1}>
                km
              </Text>
            </HStack>
          </Box>
        </Flex>

        {/* --- SELETOR DE PARCEIROS --- */}
        {city.parceiros.length > 1 ? (
          <Box mt={3}>
            <Text fontSize="xs" mb={1} color="gray.500" fontWeight="medium">
              <Icon as={MdStorefront} mr={1} mb="-2px" />
              {city.parceiros.length} locais disponíveis nesta cidade:
            </Text>
            <Select
              size="sm"
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              bg="gray.50"
              borderColor="green.200"
              _focus={{ borderColor: "green.500" }}
              _dark={{ bg: "gray.700", borderColor: "gray.600" }}
              fontWeight="bold"
            >
              {city.parceiros.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </Select>
          </Box>
        ) : (
          // Nome do parceiro único
          <Box mt={2} borderTop="1px dashed" borderColor="gray.200" pt={2}>
            <Text fontSize="xs" color="gray.400" mb={1}>
              Local:
            </Text>
            <Heading size="sm" color="gray.700" _dark={{ color: "white" }}>
              {currentPartner.nome}
            </Heading>
          </Box>
        )}

        {/* Badge de Valor */}
        {currentPartner.valor && (
          <Flex mt={3}>
            <Badge
              colorScheme={isVoucher ? "purple" : "blue"}
              variant="subtle"
              fontSize="0.8em"
              px={2}
              py={1}
              borderRadius="md"
            >
              {isVoucher ? "Voucher" : `Valor: ${currentPartner.valor}`}
            </Badge>
          </Flex>
        )}
      </CardHeader>

      <CardBody pt={2}>
        <Stack
          divider={
            <StackDivider
              borderColor="gray.100"
              _dark={{ borderColor: "gray.700" }}
            />
          }
          spacing={3}
        >
          {/* --- ENDEREÇO --- */}
          <Box>
            <HStack mb={1}>
              <Icon as={MdLocationOn} color="gray.400" />
              <Text
                fontSize="xs"
                textTransform="uppercase"
                fontWeight="bold"
                color="gray.400"
              >
                Endereço
              </Text>
            </HStack>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.600"
              _dark={{ color: "gray.300" }}
            >
              {currentPartner.endereco || "Endereço não informado"}
            </Text>
          </Box>

          {/* --- CONTATO --- */}
          <Box>
            <HStack mb={1}>
              <Icon as={MdPhone} color="gray.400" />
              <Text
                fontSize="xs"
                textTransform="uppercase"
                fontWeight="bold"
                color="gray.400"
              >
                Contato
              </Text>
            </HStack>
            <Text
              fontSize="sm"
              color="gray.700"
              fontWeight="bold"
              _dark={{ color: "white" }}
            >
              {currentPartner.telefone || "Telefone não disponível"}
            </Text>
            {currentPartner.responsavel && (
              <HStack mt={1} spacing={1}>
                <Icon as={MdPerson} color="gray.400" boxSize={3} />
                <Text fontSize="xs" color="gray.500">
                  Resp: {currentPartner.responsavel}
                </Text>
              </HStack>
            )}
          </Box>

          {/* --- OBSERVAÇÕES --- */}
          {currentPartner.obs && (
            <Box
              bg="yellow.50"
              _dark={{ bg: "rgba(236, 201, 75, 0.15)" }}
              p={3}
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="yellow.400"
            >
              <HStack align="start">
                <Icon
                  as={MdInfoOutline}
                  color="yellow.600"
                  _dark={{ color: "yellow.300" }}
                  mt="3px"
                />
                <Text
                  fontSize="sm"
                  color="yellow.800"
                  _dark={{ color: "yellow.100" }}
                  lineHeight="tall"
                >
                  <Text as="span" fontWeight="bold">
                    Obs:{" "}
                  </Text>
                  {currentPartner.obs}
                </Text>
              </HStack>
            </Box>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function GeoClient({ estados = [] }: GeoClientProps) {
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const [cidades, setCidades] = useState<{ id: number; nome: string }[]>([]);
  const [selectedCidade, setSelectedCidade] = useState<string>("");
  const [resultados, setResultados] = useState<any>(null);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const toast = useToast();

  const handleEstadoChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const estadoId = e.target.value;
    setSelectedEstado(estadoId);
    setSelectedCidade("");
    setResultados(null);

    if (estadoId) {
      setLoadingCidades(true);
      const dados = await getCidades(Number(estadoId));
      setCidades(dados);
      setLoadingCidades(false);
    } else {
      setCidades([]);
    }
  };

  const handleBuscar = async () => {
    if (!selectedCidade) return;
    setLoadingBusca(true);

    const data = await buscarProximas(Number(selectedCidade));

    if (!data) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível conectar ao servidor.",
        status: "error",
      });
    } else {
      setResultados(data);
    }
    setLoadingBusca(false);
  };

  const selectStyles = {
    "> option": {
      background: "var(--chakra-colors-white)",
      color: "var(--chakra-colors-gray-800)",
    },
    _dark: {
      "> option": {
        background: "var(--chakra-colors-gray-700)",
        color: "var(--chakra-colors-white)",
      },
    },
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* --- FILTROS --- */}
      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        shadow="md"
        borderWidth="1px"
        borderColor="gray.100"
        _dark={{ borderColor: "gray.700", bg: "gray.800" }}
      >
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={5}
          alignItems="flex-end"
        >
          <Box>
            <Text
              mb={2}
              fontWeight="bold"
              color="gray.600"
              _dark={{ color: "gray.300" }}
            >
              Estado
            </Text>
            <Select
              placeholder="Selecione o UF"
              onChange={handleEstadoChange}
              value={selectedEstado}
              size="lg"
              bg="white"
              _dark={{ bg: "gray.700", borderColor: "gray.600" }}
              sx={selectStyles}
            >
              {estados.map((uf) => (
                <option key={uf.id} value={uf.id}>
                  {uf.nome} ({uf.sigla})
                </option>
              ))}
            </Select>
          </Box>

          <Box>
            <Text
              mb={2}
              fontWeight="bold"
              color="gray.600"
              _dark={{ color: "gray.300" }}
            >
              Cidade
            </Text>
            <Select
              placeholder={
                loadingCidades ? "Carregando..." : "Selecione a Cidade"
              }
              onChange={(e) => setSelectedCidade(e.target.value)}
              value={selectedCidade}
              isDisabled={!selectedEstado || loadingCidades}
              size="lg"
              bg="white"
              _dark={{ bg: "gray.700", borderColor: "gray.600" }}
              sx={selectStyles}
            >
              {cidades.map((cid) => (
                <option key={cid.id} value={cid.id}>
                  {cid.nome}
                </option>
              ))}
            </Select>
          </Box>

          <Button
            size="lg"
            colorScheme="green"
            bg="#00713D"
            _hover={{ bg: "#005f33" }}
            isLoading={loadingBusca}
            loadingText="Localizando..."
            onClick={handleBuscar}
            isDisabled={!selectedCidade}
            leftIcon={<MdMap />}
            w="full"
          >
            Localizar Unidade
          </Button>
        </SimpleGrid>
      </Box>

      {/* --- RESULTADOS --- */}
      {resultados && (
        <Box animation="fadeIn 0.5s">
          <Flex align="center" mb={6} gap={2}>
            <Icon as={MdPlace} color="#00713D" boxSize={6} />
            <Heading size="md" color="#023147" _dark={{ color: "white" }}>
              Unidades próximas a{" "}
              <Text as="span" color="#00713D">
                {resultados.cidade_cliente.nome} -{" "}
                {resultados.cidade_cliente.uf}
              </Text>
            </Heading>
          </Flex>

          {!resultados.unidades || resultados.unidades.length === 0 ? (
            <Flex
              bg="orange.50"
              _dark={{ bg: "orange.900" }}
              p={6}
              borderRadius="lg"
              align="center"
              justify="center"
              border="1px dashed"
              borderColor="orange.300"
            >
              <Text
                color="orange.700"
                _dark={{ color: "orange.200" }}
                fontWeight="medium"
              >
                Nenhuma unidade parceira encontrada nesta região.
              </Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {resultados.unidades.map(
                (cityGroup: CityGroup, index: number) => (
                  <CityCard
                    key={`${cityGroup.cidade}-${index}`}
                    city={cityGroup}
                    isClosest={index === 0}
                  />
                )
              )}
            </SimpleGrid>
          )}
        </Box>
      )}
    </VStack>
  );
}
