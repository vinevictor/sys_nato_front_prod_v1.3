"use client";
import Loading from "@/app/loading";
import { SelectPgComponent } from "@/components/home/imputs/selectPg";
import { Session, SessionServer } from "@/types/session";
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
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdBadge, MdSearch } from "react-icons/md";
import { TableComponentNatosign } from "./lista";

interface DadoCompomentListProps {
  dados: natosign.NatosignGetType | null;
  session: Session.SessionServer | null;
}

const FirlterData = async (
  { nome, status, cca_id, id, pagina, data_inicio, data_fim }: any,
  session: Session.SessionServer | null
) => {
  const params = new URLSearchParams();
  if (nome) params.append("nome", nome);
  if (status) params.append("status", status);
  if (cca_id) params.append("cca_id", cca_id.toString());
  if (id) params.append("id", id);
  if (pagina) params.append("page", pagina.toString());
  if (data_inicio) params.append("data_inicio", data_inicio);
  if (data_fim) params.append("data_fim", data_fim);

  const URL = `/api/intelesign/list?${params.toString()}`;

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("FirlterData status:", response.status);
    return null;
  }
  return data;
};

const fetchFinanceiroAll = async () => {
  try {
    const resq = await fetch(`/api/financeira/getall`);

    if (!resq.ok) {
      console.error("fetchFinanceiroAll failed:", resq.status, resq.statusText);
      return [];
    }

    const text = await resq.text();
    if (!text) {
      console.warn("fetchFinanceiroAll: Empty response");
      return [];
    }

    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      console.error("fetchFinanceiroAll: Invalid JSON response", parseError);
      return [];
    }
  } catch (error) {
    console.error("fetchFinanceiroAll error:", error);
    return [];
  }
};

export const DadoCompomentListNatosign = ({
  dados,
  session,
}: DadoCompomentListProps) => {
  const cardBorderColor = useColorModeValue("gray.200", "gray.700");
  const filtersBg = useColorModeValue("gray.50", "gray.900");
  const tableWrapperBg = useColorModeValue("white", "gray.800");
  const infoTextColor = useColorModeValue("gray.600", "gray.300");
  const headerBg = useColorModeValue("gray.100", "gray.700");

  const [ListaDados, setListaDados] = useState<
    natosign.NatosignObjectType[] | null
  >(null);
  const [DataFinanceiro, setDataFinanceiro] = useState<any>([]);
  const [Total, setTotal] = useState<number>(0);
  const [IsLoading, setIsLoading] = useState<boolean>(false);

  const [nome, setNome] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [ccaId, setCcaId] = useState<number | null>(null);
  const [dataInicio, setDataInicio] = useState<string | null>(null);
  const [dataFim, setDataFim] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [pagina, setPagina] = useState<number>(1);

  useEffect(() => {
    if (dados) {
      setListaDados(dados.data);
      setTotal(dados.total);
    }

    if (session?.user) {
      (async () => {
        if (session.user.hierarquia === "ADM") {
          setDataFinanceiro(await fetchFinanceiroAll());
        } else if (session.user.Financeira) {
          setDataFinanceiro(session.user.Financeira);
        }
      })();
    }
  }, [dados, session]);

  const filtroPrimario = async () => {
    setIsLoading(true);
    const filtro = await FirlterData(
      {
        nome: nome,
        status: status,
        cca_id: ccaId,
        id: id,
        pagina: 1,
        data_inicio: dataInicio,
        data_fim: dataFim,
      },
      session
    );

    if (filtro && filtro.data && filtro.data.length > 0) {
      setListaDados(filtro.data);
      setTotal(filtro.total);
    } else {
      setListaDados(null);
      setTotal(0);
    }
    setPagina(1); // Reseta a página para 1 no estado
    setIsLoading(false);
  };

  const HandleFilterBlank = async () => {
    setIsLoading(true);
    setNome(null);
    setStatus(null);
    setCcaId(null);
    setId(null);
    setDataInicio(null);
    setDataFim(null);
    setPagina(1);

    const dadosIniciais = await FirlterData({}, session);
    if (dadosIniciais && dadosIniciais.data) {
      setListaDados(dadosIniciais.data);
      setTotal(dadosIniciais.total);
    }
    setIsLoading(false);
  };

  const irParaPagina = async (novaPagina: number) => {
    setIsLoading(true);
    setPagina(novaPagina); // Atualiza o estado da página atual

    const data = await FirlterData(
      {
        // Envia os filtros atuais junto com a nova página
        nome: nome,
        status: status,
        cca_id: ccaId,
        id: id,
        pagina: novaPagina,
        data_inicio: dataInicio,
        data_fim: dataFim,
      },
      session
    );

    if (data && data.data) {
      setListaDados(data.data);
      setTotal(data.total);
    }
    setIsLoading(false);
  };

  const temFiltrosAtivos = Boolean(
    nome || status || ccaId || id || dataInicio || dataFim
  );

  return (
    <VStack spacing={{ base: 5, md: 6 }} align="stretch" w="full">
      {/* Área de Filtros */}
      <Box
        w="full"
        bg={filtersBg}
        p={{ base: 4, md: 6 }}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={cardBorderColor}
      >
        <Heading size="sm" mb={4} color="#023147" _dark={{ color: "gray.100" }}>
          Filtrar Envelopes
        </Heading>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3, xl: 4, "2xl": 6 }}
          spacing={4}
        >
          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              mb={2}
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              ID do Envelope
            </Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={MdBadge} color="gray.400" />
              </InputLeftElement>
              <Input
                type="number"
                placeholder="Digite o ID"
                value={id ?? ""}
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

          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              mb={2}
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              Nome do Signatário
            </Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={MdSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Digite o nome"
                value={nome ?? ""}
                onChange={(e) => setNome(e.target.value)}
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
              placeholder="Selecione..."
              value={status ?? ""}
              onChange={(e) => setStatus(e.target.value)}
              bg="white"
              color="gray.800"
              borderColor="gray.300"
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
              <option value="done">Finalizado</option>
              <option value="waiting">Aguardando</option>
              <option value="signing">Assinando</option>
              <option value="rejected">Rejeitado</option>
            </Select>
          </Box>

          {session?.user.hierarquia === "ADM" && (
            <Box>
              <Text
                fontSize="sm"
                fontWeight="medium"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Financeira (CCA)
              </Text>
              <Select
                placeholder="Selecione..."
                value={ccaId?.toString() ?? ""}
                onChange={(e) => setCcaId(Number(e.target.value))}
                bg="white"
                color="gray.800"
                borderColor="gray.300"
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
                  "& option": { bg: "white", color: "gray.800" },
                  "&:is([data-theme='dark']) option, .chakra-ui-dark &option": {
                    bg: "gray.800",
                    color: "gray.100",
                  },
                }}
              >
                {DataFinanceiro.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.fantasia}
                  </option>
                ))}
              </Select>
            </Box>
          )}

          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              mb={2}
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              Data Início
            </Text>
            <Input
              type="date"
              value={dataInicio ?? ""}
              onChange={(e) => setDataInicio(e.target.value)}
              bg="white"
              borderColor="gray.300"
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
            />
          </Box>

          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              mb={2}
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              Data Fim
            </Text>
            <Input
              type="date"
              value={dataFim ?? ""}
              onChange={(e) => setDataFim(e.target.value)}
              bg="white"
              borderColor="gray.300"
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
            />
          </Box>
        </SimpleGrid>

        {/* Contador de resultados e botão de limpar filtros */}
        <Flex
          mt={4}
          justify="space-between"
          align="center"
          flexWrap="wrap"
          gap={3}
        >
          <Text fontSize="sm" color={infoTextColor}>
            {Total}{" "}
            {Total === 1 ? "envelope encontrado" : "envelopes encontrados"}
          </Text>

          <Flex gap={2}>
            <Button
              colorScheme="green"
              bg="#00713D"
              size="sm"
              onClick={filtroPrimario}
              _hover={{ bg: "#005a31" }}
              _dark={{
                bg: "#00d672",
                color: "gray.900",
                _hover: { bg: "#00c060" },
              }}
            >
              Filtrar
            </Button>
            {temFiltrosAtivos && (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={HandleFilterBlank}
              >
                Limpar Filtros
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Loading */}
      {IsLoading && <Loading />}

      {/* Tabela de Envelopes */}
      {!IsLoading && (
        <Box
          w="full"
          bg={tableWrapperBg}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={cardBorderColor}
          shadow="md"
          overflow="hidden"
        >
          <Box w="full" overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead bg={headerBg}>
                <Tr>
                  <Th
                    minW="80px"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    ID
                  </Th>
                  <Th
                    minW="220px"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Signatários
                  </Th>
                  <Th
                    minW="120px"
                    whiteSpace="nowrap"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Assinaturas
                  </Th>
                  <Th
                    minW="140px"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Status
                  </Th>
                  <Th
                    minW="160px"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Data criação
                  </Th>
                  <Th
                    minW="160px"
                    whiteSpace="nowrap"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Atualizado em
                  </Th>
                  <Th
                    minW="140px"
                    textAlign="center"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Funções
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {ListaDados && ListaDados.length > 0 ? (
                  ListaDados.map((item) => (
                    <TableComponentNatosign
                      key={item.UUID}
                      dados={item}
                      session={session ?? null}
                    />
                  ))
                ) : (
                  <Tr>
                    <Th colSpan={7}>
                      <Flex
                        w="full"
                        minH="200px"
                        justifyContent="center"
                        alignItems="center"
                        flexDir="column"
                        gap={4}
                        py={8}
                      >
                        <Text
                          fontSize="lg"
                          color="gray.600"
                          _dark={{ color: "gray.400" }}
                          textAlign="center"
                        >
                          {temFiltrosAtivos
                            ? "Nenhum envelope encontrado com os filtros aplicados"
                            : "Nenhum envelope cadastrado ainda."}
                        </Text>
                      </Flex>
                    </Th>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          {/* Paginação */}
          {ListaDados && ListaDados.length > 0 && (
            <Flex
              mt={{ base: 4, md: 5 }}
              px={{ base: 4, md: 6 }}
              pb={{ base: 4, md: 5 }}
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              gap={{ base: 3, md: 4 }}
              align={{ base: "flex-start", md: "center" }}
              bg="gray.50"
              _dark={{ bg: "gray.900" }}
            >
              <Text fontSize="sm" color={infoTextColor}>
                Total de registros: {Total}
              </Text>
              <Flex gap={3} align="center" wrap="wrap">
                <Text fontSize="sm" color={infoTextColor}>
                  Páginas:
                </Text>
                <SelectPgComponent
                  total={Total || 0}
                  ClientQtd={dados?.data.length || 0}
                  SelectPage={pagina}
                  setSelectPage={setPagina}
                  SetVewPage={irParaPagina}
                />
              </Flex>
            </Flex>
          )}
        </Box>
      )}
    </VStack>
  );
};
