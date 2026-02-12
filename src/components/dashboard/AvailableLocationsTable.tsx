"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Flex,
  Icon,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

export default function AvailableLocationsTable({ token }: { token: string }) {
  const [unidades, setUnidades] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const titleColor = useColorModeValue("#023147", "white");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/geo/todas-unidades`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setUnidades(data || []);
      } catch (e) {
        console.error("Erro ao carregar unidades");
      } finally {
        setLoading(false);
      }
    };
    fetchUnidades();
  }, [token]);

  const filteredData = unidades.filter(
    (item) =>
      item.nome.toLowerCase().includes(filter.toLowerCase()) ||
      item.cidade_nome.toLowerCase().includes(filter.toLowerCase()) ||
      item.estado_sigla.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="xl"
      shadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      transition="all 0.2s"
    >
      {/* Cabeçalho da Tabela */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ md: "center" }}
        mb={6}
        gap={4}
      >
        <Flex align="center" gap={2}>
          <Icon as={FaBuilding} color="#00d672" boxSize={5} />
          <Heading size="md" color={titleColor}>
            Rede de Atendimento Presencial
          </Heading>
        </Flex>

        <InputGroup maxW={{ md: "300px" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Filtrar cidade ou parceiro..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            borderRadius="lg"
          />
        </InputGroup>
      </Flex>

      {/* Container com Scroll Vertical */}
      <Box
        overflowY="auto"
        maxH="400px"
        borderRadius="lg"
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "#CBD5E0",
            borderRadius: "24px",
          },
        }}
      >
        <Table variant="simple" size="sm" layout="fixed">
          <Thead
            position="sticky"
            top={0}
            bg={headerBg}
            zIndex={1}
            boxShadow="sm"
          >
            <Tr>
              {/* <Th color="gray.500" w="30%">
                Unidade / Parceiro
              </Th> */}
              <Th color="gray.500" w="25%">
                Localização
              </Th>
              <Th color="gray.500" w="35%">
                Endereço
              </Th>
              <Th color="gray.500" w="10%">
                Status
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((unidade) => (
              <Tr
                key={unidade.id}
                _hover={{ bg: hoverBg }}
                transition="background 0.2s"
              >
                {/* <Td
                  fontWeight="bold"
                  color="#00713D"
                  _dark={{ color: "#00d672" }}
                >
                  <Text isTruncated>{unidade.nome}</Text>
                </Td> */}
                <Td>
                  <Flex align="center" gap={1}>
                    <Icon as={FaMapMarkerAlt} color="red.400" boxSize={3} />
                    <Text fontSize="xs" isTruncated>
                      {unidade.cidade_nome} - {unidade.estado_sigla}
                    </Text>
                  </Flex>
                </Td>
                <Td fontSize="xs" color="gray.500">
                  <Text noOfLines={1}>{unidade.endereco}</Text>
                </Td>
                <Td>
                  <Badge
                    colorScheme="green"
                    variant="subtle"
                    borderRadius="full"
                    px={2}
                  >
                    Ativo
                  </Badge>
                </Td>
              </Tr>
            ))}
            {filteredData.length === 0 && !loading && (
              <Tr>
                <Td colSpan={4} textAlign="center" py={10} color="gray.500">
                  Nenhuma unidade encontrada para este filtro.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
