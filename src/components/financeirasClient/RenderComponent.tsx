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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdAccountBalance,
  MdAdd,
  MdBadge,
  MdBusiness,
  MdCheckCircle,
  MdSearch,
} from "react-icons/md";

interface FinanceirasClientProps {
  data: any[];
  session: Session.SessionServer;
}

/**
 * Componente de página de financeiras (CCAs)
 *
 * Exibe lista de financeiras com filtros e opção de criar nova.
 * Possui layout responsivo e suporte completo a dark mode.
 *
 * @param data - Lista de financeiras
 * @returns Componente de página de financeiras
 */
export default function FinanceirasClient({ data, session }: FinanceirasClientProps) {
  const [financeiras, setFinanceiras] = useState<any[]>([]);
  const [dadosFiltrados, setDadosFiltrados] = useState<any[]>([]);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estados dos filtros
  const [filtroId, setFiltroId] = useState("");
  const [filtroRazaoSocial, setFiltroRazaoSocial] = useState("");
  const [filtroFantasia, setFiltroFantasia] = useState("");
  const [filtroCNPJ, setFiltroCNPJ] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  useEffect(() => {
    setFinanceiras(data);
    setDadosFiltrados(data);
  }, [data]);

  // Função de filtro
  useEffect(() => {
    let resultados = [...financeiras];

    // Filtro por ID
    if (filtroId) {
      resultados = resultados.filter((fin: any) =>
        fin.id.toString().includes(filtroId)
      );
    }

    // Filtro por Razão Social
    if (filtroRazaoSocial) {
      resultados = resultados.filter((fin: any) =>
        fin.razaosocial?.toLowerCase().includes(filtroRazaoSocial.toLowerCase())
      );
    }

    // Filtro por Fantasia
    if (filtroFantasia) {
      resultados = resultados.filter((fin: any) =>
        fin.fantasia?.toLowerCase().includes(filtroFantasia.toLowerCase())
      );
    }

    // Filtro por CNPJ
    if (filtroCNPJ) {
      resultados = resultados.filter((fin: any) =>
        fin.cnpj?.includes(filtroCNPJ.replace(/\D/g, ""))
      );
    }

    // Filtro por Status
    if (filtroStatus) {
      const statusBooleano = filtroStatus === "true";
      resultados = resultados.filter((fin: any) => fin.status === statusBooleano);
    }

    setDadosFiltrados(resultados);
  }, [
    filtroId,
    filtroRazaoSocial,
    filtroFantasia,
    filtroCNPJ,
    filtroStatus,
    financeiras,
  ]);

  return (
    <Container maxW="95%" py={4} px={6}>
      <VStack spacing={0} align="stretch" w="full">
        {/* Cabeçalho da Página */}
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
          flexDir={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
          _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
        >
          {/* Título com ícone */}
          <Flex align="center" gap={3}>
            <Icon
              as={MdAccountBalance}
              w={{ base: 8, md: 10 }}
              h={{ base: 8, md: 10 }}
              color="#00713D"
              _dark={{ color: "#00d672" }}
            />
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Gerenciar CCAs
              </Heading>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Visualize e gerencie as financeiras do sistema
              </Text>
            </Box>
          </Flex>

          {/* Botão Criar Financeira */}
          <Button
            leftIcon={<MdAdd />}
            colorScheme="green"
            bg="#00713D"
            size={{ base: "md", md: "lg" }}
            onClick={onOpen}
            transition="all 0.2s"
            w={{ base: "full", md: "auto" }}
            _hover={{
              bg: "#005a31",
              transform: "translateY(-2px)",
              shadow: "lg",
            }}
            _active={{ transform: "translateY(0)" }}
            _dark={{
              bg: "#00d672",
              color: "gray.900",
              _hover: { bg: "#00c060" },
            }}
          >
            Criar Nova Financeira
          </Button>
        </Flex>

        {/* Conteúdo da Página */}
        <VStack
          spacing={6}
          align="stretch"
          bg="white"
          _dark={{ bg: "gray.800" }}
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          borderTopRadius={0}
          shadow="lg"
          minH="400px"
        >
          {/* Filtros */}
          <Box
            w="full"
            bg="gray.50"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            _dark={{ bg: "gray.900", borderColor: "gray.700" }}
          >
            <Heading
              size="sm"
              mb={4}
              color="#023147"
              _dark={{ color: "gray.100" }}
            >
              Filtrar Financeiras
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3, xl: 5 }}
              spacing={4}
            >
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
                    placeholder="Buscar por ID"
                    value={filtroId}
                    onChange={(e) => setFiltroId(e.target.value)}
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

              {/* Filtro por Razão Social */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  Razão Social
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por razão social"
                    value={filtroRazaoSocial}
                    onChange={(e) => setFiltroRazaoSocial(e.target.value)}
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

              {/* Filtro por Fantasia */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  Nome Fantasia
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdBusiness} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por fantasia"
                    value={filtroFantasia}
                    onChange={(e) => setFiltroFantasia(e.target.value)}
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

              {/* Filtro por CNPJ */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  CNPJ
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdBadge} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por CNPJ"
                    value={filtroCNPJ}
                    onChange={(e) => setFiltroCNPJ(e.target.value)}
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
                  placeholder="Todos os status"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
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
                    "&:is([data-theme='dark']) option, .chakra-ui-dark &option":
                      {
                        bg: "gray.800",
                        color: "gray.100",
                      },
                  }}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </Select>
              </Box>
            </SimpleGrid>

            {/* Contador de resultados */}
            <Flex mt={4} justify="space-between" align="center">
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                {dadosFiltrados.length}{" "}
                {dadosFiltrados.length === 1
                  ? "financeira encontrada"
                  : "financeiras encontradas"}
              </Text>

              {(filtroId ||
                filtroRazaoSocial ||
                filtroFantasia ||
                filtroCNPJ ||
                filtroStatus) && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => {
                    setFiltroId("");
                    setFiltroRazaoSocial("");
                    setFiltroFantasia("");
                    setFiltroCNPJ("");
                    setFiltroStatus("");
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </Flex>
          </Box>

          {/* Lista de Financeiras */}
          <Box w="full">
            {dadosFiltrados.length > 0 ? (
              <Financeiras data={dadosFiltrados} session={session} />
            ) : financeiras.length > 0 ? (
              <Flex
                w="full"
                minH="300px"
                justifyContent="center"
                alignItems="center"
                bg="gray.50"
                _dark={{ bg: "gray.900" }}
                borderRadius="lg"
                p={8}
                flexDir="column"
                gap={4}
              >
                <Icon as={MdSearch} w={16} h={16} color="gray.400" />
                <Text
                  fontSize="lg"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                >
                  Nenhuma financeira encontrada com os filtros aplicados
                </Text>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={() => {
                    setFiltroId("");
                    setFiltroRazaoSocial("");
                    setFiltroFantasia("");
                    setFiltroCNPJ("");
                    setFiltroStatus("");
                  }}
                >
                  Limpar Filtros
                </Button>
              </Flex>
            ) : (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                spacing={6}
                w="full"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <Skeleton
                    key={index}
                    height="350px"
                    borderRadius="xl"
                    startColor="gray.200"
                    endColor="gray.700"
                  />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </VStack>
      </VStack>

      {/* Modal de Criação/Edição de Financeira */}
      <ModalEditarFinanceira isOpen={isOpen} onClose={onClose} />
    </Container>
  );
}
