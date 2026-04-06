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
} from "@chakra-ui/react";
import {
  MdMap,
  MdLocationOn,
  MdPlace,
  MdPhone,
  MdInfoOutline,
  MdStorefront,
} from "react-icons/md";
import { buscarProximas, getCidades } from "@/actions/geo/geoActions";

// --- ESTILO GLOBAL ---
const GlobalSelectStyles = () => (
  <style jsx global>{`
    .chakra-ui-dark option {
      background-color: #2d3748 !important; /* gray.700 */
      color: white !important;
    }
    .chakra-ui-light option {
      background-color: white !important;
      color: #2d3748 !important;
    }
  `}</style>
);

// --- ESTILO PARA O COMPONENTE SELECT ---
const selectStyles = {
  color: "gray.800",
  bg: "gray.50",
  _dark: {
    color: "white",
    bg: "gray.700",
    borderColor: "gray.600",
    _hover: {
      borderColor: "gray.500",
    },
  },
  // Estilização das options via SX (para navegadores que aceitam)
  option: {
    color: "gray.800",
    bg: "white",
  },
};

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
        <Flex justify="space-between" align="start" mb={3}>
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
            _dark={{ bg: "gray.700" }}
            px={3}
            py={2}
            borderRadius="lg"
            border="1px solid"
            borderColor={isClosest ? "green.200" : "gray.600"}
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
                color={isClosest ? "green.600" : "white"}
              >
                {city.distancia_km}
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="gray.500" ml={1}>
                km
              </Text>
            </HStack>
          </Box>
        </Flex>

        {city.parceiros.length > 1 ? (
          <Box mt={3}>
            <Text fontSize="xs" mb={1} color="gray.500" fontWeight="medium">
              <Icon as={MdStorefront} mr={1} mb="-2px" />
              {city.parceiros.length} locais disponíveis:
            </Text>
            <Select
              size="sm"
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              sx={selectStyles}
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
          <Box mt={2} borderTop="1px dashed" borderColor="gray.200" pt={2}>
            <Text fontSize="xs" color="gray.400" mb={1}>
              Local:
            </Text>
            <Heading size="sm" color="gray.700" _dark={{ color: "white" }}>
              {currentPartner.nome}
            </Heading>
          </Box>
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
              {currentPartner.endereco || "Não informado"}
            </Text>
          </Box>

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
              {currentPartner.telefone || "Não disponível"}
            </Text>
          </Box>

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
                <Icon as={MdInfoOutline} color="yellow.600" mt="3px" />
                <Text
                  fontSize="sm"
                  color="yellow.800"
                  _dark={{ color: "yellow.100" }}
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
      toast({ title: "Erro na busca", status: "error" });
    } else {
      setResultados(data);
    }
    setLoadingBusca(false);
  };

  return (
    <VStack spacing={8} align="stretch">
      <GlobalSelectStyles />

      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        shadow="md"
        borderWidth="1px"
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
            onClick={handleBuscar}
            isDisabled={!selectedCidade}
            leftIcon={<MdMap />}
            w="full"
          >
            Localizar Unidade
          </Button>
        </SimpleGrid>
      </Box>

      {/* Resultados (Mapeamento dos Cards) */}
      {resultados && (
        <Box>
          <Flex align="center" mb={6} gap={2}>
            <Icon as={MdPlace} color="#00713D" boxSize={6} />
            <Heading size="md" _dark={{ color: "white" }}>
              Unidades próximas a{" "}
              <Text as="span" color="#00713D">
                {resultados.cidade_cliente.nome}
              </Text>
            </Heading>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {resultados.unidades?.map((cityGroup: CityGroup, index: number) => (
              <CityCard key={index} city={cityGroup} isClosest={index === 0} />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
}
