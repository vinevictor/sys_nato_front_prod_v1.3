"use client";

import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { JSX } from "react";

interface CidadeProxima {
  cidade: string;
  cidadesProximas: string;
}

const cidades: CidadeProxima[] = [
  {
    cidade: "Ribeirão Preto/SP",
    cidadesProximas: "Jardinópolis / Luiz Antonio",
  },
  { cidade: "Serrana/SP", cidadesProximas: "-" },
  { cidade: "Botucatu/SP", cidadesProximas: "-" },
  { cidade: "Sorocaba/SP", cidadesProximas: "Itu" },
  { cidade: "Franca/SP", cidadesProximas: "-" },
  { cidade: "Votuporanga/SP", cidadesProximas: "-" },
  { cidade: "Ibitinga/SP", cidadesProximas: "Tabatinga" },
  { cidade: "São Carlos/SP", cidadesProximas: "Araraquara" },
  { cidade: "Araçatuba/SP", cidadesProximas: "-" },
  { cidade: "Piracicaba/SP", cidadesProximas: "-Santa Barbara d'Oeste/SP" },
  { cidade: "Birigui/SP", cidadesProximas: "Penápolis / Avanhandava" },
  {
    cidade: "São José do Rio Preto/SP",
    cidadesProximas: "Bálsamo / Bady Bassitt",
  },
  { cidade: "Presidente Prudente/SP", cidadesProximas: "-" },
  { cidade: "Sinop/MT", cidadesProximas: "-" },
  { cidade: "Taubaté/SP", cidadesProximas: "Caçapava" },
  { cidade: "Araraquara/SP", cidadesProximas: "-" },
  { cidade: "Assis/SP", cidadesProximas: "-" },
];

// Esta função exibe uma tabela responsiva com cidades e respectivas cidades próximas,
// aplicando estilos adaptáveis ao tema claro/escuro e permitindo rolagem para listas extensas.
export default function CidadesProximasTable(): JSX.Element {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Box
      w="full"
      bg={isDark ? "gray.900" : "white"}
      borderWidth="1px"
      borderRadius="md"
      borderColor={isDark ? "gray.700" : "rgba(187, 187, 187, 0.22)"}
      boxShadow={isDark ? "dark-lg" : "md"}
      p={{ base: 2, md: 4 }}
      overflow="hidden"
    >
      <Text
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="semibold"
        color={isDark ? "gray.100" : "#1A202C"}
        mb={{ base: 2, md: 3 }}
      >
        Cidades com Atendimento Presencial
      </Text>

      <TableContainer
        maxH={{ base: "auto", lg: "420px" }}
        overflowY="auto"
        borderRadius="md"
        borderWidth="1px"
        borderColor={isDark ? "gray.700" : "gray.200"}
      >
        <Table variant="simple" size="sm">
          <Thead
            bg={isDark ? "gray.800" : "gray.100"}
            position="sticky"
            top={0}
            zIndex={1}
          >
            <Tr>
              <Th
                color={isDark ? "gray.100" : "#1A202C"}
                fontSize={{ base: "sm", md: "md" }}
              >
                Cidade
              </Th>
              <Th
                color={isDark ? "gray.100" : "#1A202C"}
                fontSize={{ base: "sm", md: "md" }}
              >
                Cidades Próximas
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {cidades.map((item) => (
              <Tr
                key={item.cidade}
                borderBottomWidth="1px"
                borderColor={isDark ? "gray.700" : "gray.200"}
                _hover={{ bg: isDark ? "gray.800" : "gray.50" }}
              >
                <Td
                  fontSize={{ base: "xs", md: "sm" }}
                  color={isDark ? "gray.300" : "gray.700"}
                  fontWeight="medium"
                >
                  {item.cidade}
                </Td>
                <Td
                  fontSize={{ base: "xs", md: "sm" }}
                  color={isDark ? "gray.300" : "gray.700"}
                >
                  {item.cidadesProximas || "-"}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
