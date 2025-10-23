"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import {
  MdBadge,
  MdCheckCircle,
  MdPriorityHigh,
} from "react-icons/md";

type FormFilterType = {
  busca?: string;
  id?: string;
  status?: string;
  prioridade?: string;
};

interface FiltroChamadosProps {
  statusUnicos: string[];
  prioridadesUnicas: string[];
  Search: (formFilter: FormFilterType) => void;
}

export default function FiltroChamados({
  statusUnicos,
  prioridadesUnicas,
  Search,
}: FiltroChamadosProps) {
  const [busca, setBusca] = useState('');
  const [id, setId] = useState('');
  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('');

  const handleFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busca) Search({ busca });
    if (id) Search({ id });
    if (status) Search({ status });
    if (prioridade) Search({ prioridade });
  };

  const handleClear = () => {
    setBusca("");
    setId("");
    setStatus("");
    setPrioridade("");
  };

  const temFiltrosAtivos = busca || id || status || prioridade;

  return (
    <Box
      w="full"
      bg="gray.50"
      p={{ base: 4, md: 6 }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
    >
      <Heading size="sm" mb={4} color="#023147" _dark={{ color: "gray.100" }}>
        Filtrar Chamados
      </Heading>

      <form onSubmit={handleFilter}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          {/* Filtro por Busca */}
          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              mb={2}
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              Buscar
            </Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon color="gray.400" />
              </InputLeftElement>
              <Input
                name="busca"
                placeholder="Buscar por termo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                bg="white"
                _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                borderColor="gray.300"
                _hover={{ borderColor: "#00713D" }}
                _focus={{
                  borderColor: "#00713D",
                  boxShadow: "0 0 0 1px #00713D",
                }}
              />
            </InputGroup>
          </Box>

          {/* Filtro por ID */}
          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              mb={2}
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              ID
            </Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={MdBadge} color="gray.400" />
              </InputLeftElement>
              <Input
                name="id"
                placeholder="ID do chamado"
                value={id}
                onChange={(e) => setId(e.target.value)}
                bg="white"
                _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                borderColor="gray.300"
                _hover={{ borderColor: "#00713D" }}
                _focus={{
                  borderColor: "#00713D",
                  boxShadow: "0 0 0 1px #00713D",
                }}
              />
            </InputGroup>
          </Box>

          {/* Filtro por Status */}
          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              mb={2}
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              Status
            </Text>
            <Select
              name="status"
              placeholder="Todos os status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              bg="white"
              color="gray.800"
              borderColor="gray.300"
              icon={<MdCheckCircle />}
              _hover={{ borderColor: "#00713D" }}
              _focus={{
                borderColor: "#00713D",
                boxShadow: "0 0 0 1px #00713D",
              }}
              _dark={{
                bg: "gray.800",
                borderColor: "gray.600",
                color: "gray.100",
              }}
              sx={{
                "& option": {
                  bg: "white",
                  color: "gray.800",
                },
                "&:is([data-theme='dark']) option, .chakra-ui-dark &option": {
                  bg: "gray.800",
                  color: "gray.100",
                },
              }}
            >
              {statusUnicos.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Box>

          {/* Filtro por Prioridade */}
          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              mb={2}
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              Prioridade
            </Text>
            <Select
              name="prioridade"
              placeholder="Todas as prioridades"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
              bg="white"
              color="gray.800"
              borderColor="gray.300"
              icon={<MdPriorityHigh />}
              _hover={{ borderColor: "#00713D" }}
              _focus={{
                borderColor: "#00713D",
                boxShadow: "0 0 0 1px #00713D",
              }}
              _dark={{
                bg: "gray.800",
                borderColor: "gray.600",
                color: "gray.100",
              }}
              sx={{
                "& option": {
                  bg: "white",
                  color: "gray.800",
                },
                "&:is([data-theme='dark']) option, .chakra-ui-dark &option": {
                  bg: "gray.800",
                  color: "gray.100",
                },
              }}
            >
              {prioridadesUnicas.map((p) => (
                <option key={p} value={p}>
                  {p.toUpperCase()}
                </option>
              ))}
            </Select>
          </Box>
        </SimpleGrid>

        {/* Botões de Ação */}
        <Flex mt={4} gap={4} justify="flex-end" flexWrap="wrap">
          {temFiltrosAtivos && (
            <Button
              type="button"
              onClick={handleClear}
              size="md"
              variant="ghost"
              colorScheme="red"
            >
              Limpar Filtros
            </Button>
          )}
          <Button
            type="submit"
            colorScheme="green"
            bg="#00713D"
            size="md"
            _hover={{ bg: "#005a31" }}
            _dark={{
              bg: "#00d672",
              color: "gray.900",
              _hover: { bg: "#00c060" },
            }}
          >
            Aplicar Filtros
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
