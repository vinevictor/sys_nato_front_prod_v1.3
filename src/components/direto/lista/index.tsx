"use client";
import useHomeContex from "@/hook/useHomeContex";
import {
  Box,
  Button,
  Flex,
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
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ImClock } from "react-icons/im";
import { SelectPgComponent } from "../imputs/selectPg";
import { CardComponentHome } from "./card";
import { TableComponent } from "./table";
import { TableRowsSkeleton, CardSkeleton } from "./skeleton";
import { Session } from "@/types/session";
import { solictacao } from "@/types/solicitacao";
import {
  MdAccountBalance,
  MdBadge,
  MdBusiness,
  MdSearch,
  MdTimeline,
} from "react-icons/md";

interface DadoCompomentListProps {
  dados: solictacao.SolicitacaoGetType | null;
  session: Session.SessionServer | null;
}

const fetchEmpreendimentoAll = async () => {
  try {
    const resq = await fetch(`/api/empreendimento/getall`);
    const data = await resq.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar empreendimentos:", error);
    return [];
  }
};

const fetchFinanceiroAll = async () => {
  try {
    const resq = await fetch(`/api/financeira/getall`);
    const data = await resq.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar financeiras:", error);
    return [];
  }
};

const RequestDataBlank = async () => {
  try {
    const req = await fetch(`/api/direto/findAll`);
    const data = await req.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
};

const RequestDataFilter = async (filter: {
  id?: number;
  nome?: string;
  andamento?: string;
  empreendimento?: number;
  financeiro?: number;
  pagina?: number;
  pg_andamento?: string;
}) => {
  try {
    const params: Record<string, string> = {};
    if (filter.id !== undefined && filter.id !== null)
      params.id = String(filter.id);
    if (filter.nome) params.nome = String(filter.nome);
    if (filter.andamento) params.andamento = String(filter.andamento);
    if (filter.empreendimento !== undefined && filter.empreendimento !== null)
      params.empreendimento = String(filter.empreendimento);
    if (filter.financeiro !== undefined && filter.financeiro !== null)
      params.financeiro = String(filter.financeiro);
    if (filter.pagina !== undefined && filter.pagina !== null)
      params.pagina = String(filter.pagina);
    if (filter.pg_andamento) params.pg_andamento = filter.pg_andamento;

    const req = await fetch(
      `/api/direto/findAll?${new URLSearchParams(params).toString()}`
    );
    const data = await req.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
};

export const DadoCompomentList = ({
  dados,
  session,
}: DadoCompomentListProps) => {
  const [ListaDados, setListaDados] = useState<
    solictacao.SolicitacaoObjectType[]
  >([]);
  const [Nome, setNome] = useState<string | null>(null);
  const [Andamento, setAndamento] = useState<string | null>(null);
  const [Empreendimento, setEmpreendimento] = useState<number | null>(null);
  const [DataEmpreendimento, setDataEmpreendimento] = useState<any>([]);
  const [Financeiro, setFinanceiro] = useState<number | null>(null);
  const [DataFinanceiro, setDataFinanceiro] = useState<any>([]);
  const [Id, setId] = useState<number | null>(null);
  const [Pagina, setPagina] = useState<number>(1);
  const [Total, setTotal] = useState<number>(0);
  const [PagAtual, setPagAtual] = useState<number>(1);
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [ShowSkeleton, setShowSkeleton] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  // AJUSTADO: Inicialização limpa como string vazia para o Select do Chakra responder nativamente
  const [PgFilter, setPgFilter] = useState<string>("");

  const toast = useToast();

  const bgTable = useColorModeValue("gray.50", "gray.800");
  const borderTable = useColorModeValue("gray.200", "gray.600");
  const bgTableInner = useColorModeValue("gray.100", "gray.700");
  const borderBottomColor = useColorModeValue("gray.300", "gray.600");
  const textColorSecondary = useColorModeValue("gray.700", "gray.200");
  const filterBg = useColorModeValue("white", "gray.900");
  const filterBorder = useColorModeValue("gray.200", "gray.700");
  const filterTitleColor = useColorModeValue("#023147", "gray.100");
  const filterCaptionColor = useColorModeValue("gray.600", "gray.400");

  const buttonBg = useColorModeValue("#00713D", "#00d672");
  const buttonHoverBg = useColorModeValue("#005a31", "#00c060");
  const buttonColor = useColorModeValue("white", "gray.900");

  const { data } = useHomeContex();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (IsLoading) {
      timer = setTimeout(() => {
        setShowSkeleton(true);
      }, 2000);
    } else {
      setShowSkeleton(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [IsLoading]);

  useEffect(() => {
    setListaDados(dados?.data || []);
    setTotal(dados?.total || 0);
    setPagAtual(dados?.pagina || 1);
    setPagina(dados?.pagina || 1);
    if (session?.user) {
      (async () => {
        try {
          if (session?.user?.hierarquia === "ADM") {
            const [empreendimentos, financeiras] = await Promise.all([
              fetchEmpreendimentoAll(),
              fetchFinanceiroAll(),
            ]);
            setDataEmpreendimento(empreendimentos || []);
            setDataFinanceiro(financeiras || []);
          } else {
            setDataEmpreendimento(session?.user?.empreendimento || []);
            setDataFinanceiro(session?.user?.Financeira || []);
          }
        } catch (error) {
          console.error("Erro ao carregar dados auxiliares:", error);
        }
      })();
    }
  }, [data, dados, session]);

  const filtroPrimario = async () => {
    try {
      setIsLoading(true);

      if (
        !Id &&
        !Nome &&
        Andamento === null &&
        !Empreendimento &&
        !Financeiro &&
        PgFilter === ""
      ) {
        toast({
          title: "Nenhum filtro selecionado.",
          description:
            "Por favor, selecione pelo menos um filtro para realizar a busca.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const andamentoParaApi = Andamento === "TODOS" ? null : Andamento;

      const data = await RequestDataFilter({
        ...(Id && { id: Id }),
        ...(Nome && { nome: Nome }),
        ...(andamentoParaApi && { andamento: andamentoParaApi }),
        ...(Empreendimento && { empreendimento: Empreendimento }),
        ...(Financeiro && { financeiro: Financeiro }),
        ...(PgFilter !== "" && { pg_andamento: PgFilter }),
      });
      setListaDados(data.data);
      setTotal(data.total);
      setPagAtual(data.pagina);
      setPagina(data.pagina);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const HandleFilterBlank = async () => {
    setIsLoading(true);
    try {
      setNome(null);
      setAndamento(null);
      setEmpreendimento(null);
      setFinanceiro(null);
      setId(null);
      setPgFilter("");
      setPagina(1);
      const data = await RequestDataBlank();
      setListaDados(data.data);
      setTotal(data.total);
      setPagAtual(data.pagina);
      setPagina(data.pagina);
    } catch (error) {
      console.error("Erro ao limpar filtros:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const NextPage = async () => {
    try {
      setIsLoading(true);
      const data = await RequestDataFilter({
        pagina: Pagina,
      });
      setListaDados(data.data);
      setTotal(data.total);
      setPagAtual(data.pagina);
      setPagina(data.pagina);
    } catch (error) {
      console.error("Erro ao navegar para próxima página:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDir={"column"}
        gap={{ base: 2, md: 3, xl: 4 }}
        w="full"
        h="full"
        px={{ base: 2, md: 3 }}
        py={{ base: 2, md: 3 }}
      >
        {/* Bloco de Filtros */}
        <Box
          bg={filterBg}
          border="1px solid"
          borderColor={filterBorder}
          borderRadius="lg"
          p={{ base: 4, md: 6 }}
          shadow="sm"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
            align={{ base: "flex-start", md: "center" }}
            gap={{ base: 4, md: 6 }}
          >
            <Box>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="semibold"
                color={filterTitleColor}
              >
                FILTRAR SOLICITAÇÕES DIRETAS
              </Text>
              <Text
                mt={1}
                fontSize={{ base: "sm", md: "md" }}
                color={filterCaptionColor}
              >
                Utilize os campos abaixo para refinar os resultados
                apresentados.
              </Text>
            </Box>
          </Flex>

          <Box mt={{ base: 4, md: 6 }}>
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, xl: 6 }}
              spacing={{ base: 3, md: 4 }}
            >
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color={filterTitleColor}
                >
                  ID DA SOLICITAÇÃO
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdBadge} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="number"
                    placeholder="Digite o ID"
                    value={Id?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      if (value === "") {
                        setId(null);
                      } else if (!isNaN(Number(value)) && Number(value) > 0) {
                        setId(Number(value));
                      }
                    }}
                    bg="white"
                    borderColor="gray.300"
                    color="#023147"
                    _hover={{ borderColor: "#00713D" }}
                    _focus={{
                      borderColor: "#00713D",
                      boxShadow: "0 0 0 1px #00713D",
                    }}
                    _placeholder={{ color: "gray.500" }}
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.600",
                      color: "gray.100",
                      _hover: { borderColor: "#00d672" },
                      _focus: {
                        borderColor: "#00d672",
                        boxShadow: "0 0 0 1px #00d672",
                      },
                      _placeholder: { color: "gray.400" },
                    }}
                  />
                </InputGroup>
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color={filterTitleColor}
                >
                  NOME DA SOLICITAÇÃO
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Digite o nome"
                    value={Nome ?? ""}
                    onChange={(e) => setNome(e.target.value.toUpperCase())}
                    bg="white"
                    borderColor="gray.300"
                    color="#023147"
                    _hover={{ borderColor: "#00713D" }}
                    _focus={{
                      borderColor: "#00713D",
                      boxShadow: "0 0 0 1px #00713D",
                    }}
                    _placeholder={{ color: "gray.500" }}
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.600",
                      color: "gray.100",
                      _hover: { borderColor: "#00d672" },
                      _focus: {
                        borderColor: "#00d672",
                        boxShadow: "0 0 0 1px #00d672",
                      },
                      _placeholder: { color: "gray.400" },
                    }}
                  />
                </InputGroup>
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color={filterTitleColor}
                >
                  STATUS (ANDAMENTO)
                </Text>
                <Select
                  placeholder="Selecione..."
                  value={Andamento ?? ""}
                  onChange={(e) => setAndamento(e.target.value)}
                  bg="white"
                  color="#023147"
                  borderColor="gray.300"
                  icon={<MdTimeline />}
                  _hover={{ borderColor: "#00713D" }}
                  _focus={{
                    borderColor: "#00713D",
                    boxShadow: "0 0 0 1px #00713D",
                  }}
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "gray.100",
                    _hover: { borderColor: "#00d672" },
                    _focus: {
                      borderColor: "#00d672",
                      boxShadow: "0 0 0 1px #00d672",
                    },
                  }}
                >
                  <option value="TODOS">Todos</option>
                  <option value="VAZIO">VAZIO</option>
                  <option value="INICIADO">INICIADO</option>
                  <option value="APROVADO">APROVADO</option>
                  <option value="EMITIDO">EMITIDO</option>
                  <option value="REVOGADO">REVOGADO</option>
                </Select>
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color={filterTitleColor}
                >
                  EMPREENDIMENTO
                </Text>
                <Select
                  placeholder="Selecione..."
                  value={Empreendimento?.toString() ?? ""}
                  onChange={(e) => setEmpreendimento(Number(e.target.value))}
                  bg="white"
                  color="#023147"
                  borderColor="gray.300"
                  icon={<MdBusiness />}
                  _hover={{ borderColor: "#00713D" }}
                  _focus={{
                    borderColor: "#00713D",
                    boxShadow: "0 0 0 1px #00713D",
                  }}
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "gray.100",
                    _hover: { borderColor: "#00d672" },
                    _focus: {
                      borderColor: "#00d672",
                      boxShadow: "0 0 0 1px #00d672",
                    },
                  }}
                >
                  {DataEmpreendimento.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color={filterTitleColor}
                >
                  FINANCEIRO (CCA)
                </Text>
                <Select
                  placeholder="Selecione..."
                  value={Financeiro?.toString() ?? ""}
                  onChange={(e) => setFinanceiro(Number(e.target.value))}
                  bg="white"
                  color="#023147"
                  borderColor="gray.300"
                  icon={<MdAccountBalance />}
                  _hover={{ borderColor: "#00713D" }}
                  _focus={{
                    borderColor: "#00713D",
                    boxShadow: "0 0 0 1px #00713D",
                  }}
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "gray.100",
                    _hover: { borderColor: "#00d672" },
                    _focus: {
                      borderColor: "#00d672",
                      boxShadow: "0 0 0 1px #00d672",
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

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color={filterTitleColor}
                >
                  STATUS PAGAMENTO (PG)
                </Text>
                <Select
                  placeholder="Todos"
                  value={PgFilter}
                  onChange={(e) => setPgFilter(e.target.value)}
                  bg="white"
                  color="#023147"
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
                    _hover: { borderColor: "#00d672" },
                    _focus: {
                      borderColor: "#00d672",
                      boxShadow: "0 0 0 1px #00d672",
                    },
                  }}
                >
                  <option value="PAGO">PAGO</option>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="DEVOLUCAO">DEVOLUÇÃO</option>
                </Select>
              </Box>
            </SimpleGrid>

            <Flex
              justifyContent="space-between"
              alignItems="center"
              gap={3}
              mt={{ base: 5, md: 6 }}
              wrap="wrap"
            >
              <Text fontSize="sm" color={filterCaptionColor}>
                {Total}{" "}
                {Total === 1 ? "registro encontrado" : "registros encontrados"}
              </Text>
              <Flex gap={3} wrap="wrap">
                <Button
                  variant="outline"
                  colorScheme="gray"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.500", bg: "gray.100" }}
                  _dark={{
                    borderColor: "gray.600",
                    _hover: { bg: "gray.700" },
                  }}
                  minW="140px"
                  size="sm"
                  onClick={HandleFilterBlank}
                  isLoading={IsLoading}
                >
                  Limpar filtros
                </Button>
                <Button
                  bg={buttonBg}
                  color={buttonColor}
                  minW="140px"
                  borderRadius="md"
                  size="sm"
                  _hover={{
                    bg: buttonHoverBg,
                    transform: "translateY(-1px)",
                    shadow: "md",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  onClick={filtroPrimario}
                  isLoading={IsLoading}
                >
                  Filtrar
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Box>

        {/* Estrutura da Tabela */}
        <Flex
          w="full"
          bg={bgTable}
          shadow="lg"
          borderRadius="15px"
          p={{ base: "10px", md: "15px", xl: "20px" }}
          flexDir="column"
          border="1px solid"
          borderColor={borderTable}
        >
          {isMobile ? (
            <Box w="full">
              {ShowSkeleton ? (
                <CardSkeleton />
              ) : ListaDados && ListaDados.length > 0 ? (
                ListaDados.map((item) => (
                  <CardComponentHome
                    key={item.id}
                    dados={item}
                    session={session ?? null}
                  />
                ))
              ) : null}
            </Box>
          ) : (
            <Box overflowX="auto" w="full">
              <Table
                variant="simple"
                size="sm"
                bg={bgTableInner}
                borderRadius="15px"
              >
                <Thead>
                  <Tr>
                    <Th
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      p={{ base: "0.5rem", md: "0.8rem" }}
                      borderBottomColor={borderBottomColor}
                      w={{ base: "12rem", md: "17rem" }}
                      textAlign="center"
                    >
                      FUNÇÕES
                    </Th>
                    <Th
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      p={{ base: "0.5rem", md: "0.8rem" }}
                      borderBottomColor={borderBottomColor}
                      w={{ base: "4rem", md: "5rem" }}
                    >
                      ID
                    </Th>
                    <Th
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      p={{ base: "0.5rem", md: "0.8rem" }}
                      borderBottomColor={borderBottomColor}
                    >
                      NOME
                    </Th>
                    <Th
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      p={{ base: "0.5rem", md: "0.8rem" }}
                      borderBottomColor={borderBottomColor}
                      w={{ base: "10rem", md: "12rem" }}
                    >
                      CCA
                    </Th>
                    <Th
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      p={{ base: "0.5rem", md: "0.8rem" }}
                      borderBottomColor={borderBottomColor}
                      w={{ base: "10rem", md: "13rem" }}
                      textAlign="center"
                    >
                      AGENDAMENTO
                    </Th>
                    <Th
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      p={{ base: "0.5rem", md: "0.8rem" }}
                      borderBottomColor={borderBottomColor}
                      w={{ base: "8rem", md: "10rem" }}
                      textAlign="center"
                    >
                      PG
                    </Th>
                    <Th
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      p={{ base: "0.5rem", md: "0.8rem" }}
                      borderBottomColor={borderBottomColor}
                      w={{ base: "7rem", md: "8rem" }}
                      textAlign="center"
                    >
                      ANDAMENTO
                    </Th>
                    <Th
                      p={{ base: "0.5rem", md: "0.8rem" }}
                      borderBottomColor={borderBottomColor}
                      w={{ base: "4rem", md: "5rem" }}
                      fontSize={{ base: "18px", md: "22px" }}
                    >
                      <Flex justifyContent="center">
                        <ImClock />
                      </Flex>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {ShowSkeleton ? (
                    <TableRowsSkeleton />
                  ) : ListaDados && ListaDados.length > 0 ? (
                    ListaDados.map((item) => (
                      <TableComponent
                        key={item.id}
                        dados={item}
                        session={session ?? null}
                      />
                    ))
                  ) : null}
                </Tbody>
              </Table>
            </Box>
          )}

          {/* Footer de Paginação */}
          <Flex
            w="full"
            justifyContent={{ base: "center", md: "space-between" }}
            alignItems="center"
            pt={3}
            flexDir={{ base: "column", md: "row" }}
            gap={{ base: 2, md: 0 }}
          >
            <Box fontSize={{ base: "sm", md: "md" }} color={textColorSecondary}>
              Total de registros: {Total}
            </Box>
            <Flex
              gap={2}
              alignItems="center"
              fontSize={{ base: "sm", md: "md" }}
            >
              <Box color={textColorSecondary}>Páginas:</Box>
              <SelectPgComponent
                total={Total || 0}
                ClientQtd={ListaDados?.length || 0}
                SelectPage={Pagina}
                setSelectPage={setPagina}
                SetVewPage={NextPage}
              />
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};
