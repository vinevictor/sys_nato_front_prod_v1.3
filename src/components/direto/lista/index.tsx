"use client";
import Loading from "@/app/loading";
import { BugReport } from "@/components/bug";
import useHomeContex from "@/hook/useHomeContex";
import {
  Box,
  Button,
  Flex,
  Select,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ImClock } from "react-icons/im";
import { InputComponentFilterHome } from "../imputs/input";
import { SelectComponentFilterHome } from "../imputs/select";
import { SelectPgComponent } from "../imputs/selectPg";
import { CardComponentHome } from "./card";
import { TableComponent } from "./table";
import { Session } from "@/types/session";
import { solictacao } from "@/types/solicitacao";

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

// Função helper para extrair dados do objeto/array
const extractDataArray = (dados: any): solictacao.SolicitacaoObjectType[] => {
  if (Array.isArray(dados)) {
    return dados;
  }
  if (dados && typeof dados === "object" && Array.isArray(dados.data)) {
    return dados.data;
  }
  return [];
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
    solictacao.SolicitacaoObjectType[] | null
  >(null);
  const [Nome, setNome] = useState<string | null>(null);
  const [Andamento, setAndamento] = useState<string | null>(null);
  const [Empreendimento, setEmpreendimento] = useState<number | null>(null);
  const [DataEmpreendimento, setDataEmpreendimento] = useState<any>([]);
  const [Financeiro, setFinanceiro] = useState<number | null>(null);
  const [DataFinanceiro, setDataFinanceiro] = useState<any>([]);
  const [Id, setId] = useState<number | null>(null);
  const [Pagina, setPagina] = useState<number | null>(null);
  const [Total, setTotal] = useState<number>(0);
  const [PagAtual, setPagAtual] = useState<number>(0);
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [IsGeralLoading, setIsGeralLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const toast = useToast();

  // Cores responsivas ao tema
  const theme = useColorModeValue('light', 'dark');
  const bgTable = useColorModeValue("gray.50", "gray.800");
  const borderTable = useColorModeValue("gray.200", "gray.600");
  const bgTableInner = useColorModeValue("gray.100", "gray.700");
  const borderBottomColor = useColorModeValue("gray.300", "gray.600");
  const textColorSecondary = useColorModeValue("gray.700", "gray.200");

  const { data } = useHomeContex();

  // Detecta o tamanho da tela
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsGeralLoading(true);
    setListaDados(dados?.data || []);
    setTotal(dados?.total || 0);
    setPagAtual(dados?.pagina || 0);
    // Carregar dados auxiliares
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
    setIsGeralLoading(false);
  }, [data, dados, session]);

  const filtroPrimario = async () => {
    try {
      setIsLoading(true);
      if (!Id && !Nome && !Andamento && !Empreendimento && !Financeiro) {
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
      const data = await RequestDataFilter({
        ...(Id && { id: Id }),
        ...(Nome && { nome: Nome }),
        ...(Andamento && { andamento: Andamento }),
        ...(Empreendimento && { empreendimento: Empreendimento }),
        ...(Financeiro && { financeiro: Financeiro }),
      });
      setListaDados(data.data);
      setTotal(data.total);
      setPagAtual(data.pagina);
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
      setPagina(null);
      const data = await RequestDataBlank();
      setListaDados(data.data);
      setTotal(data.total);
      setPagAtual(data.pagina);
    } catch (error) {
      console.error("Erro ao limpar filtros:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const NextPage = async () => {
    if (Pagina === null) return;
    try {
      setIsLoading(true);
      const data = await RequestDataFilter({
        pagina: Pagina,
      });
      setListaDados(data.data);
      setTotal(data.total);
      setPagAtual(data.pagina);
    } catch (error) {
      console.error("Erro ao navegar para próxima página:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (IsGeralLoading) {
    return <Loading />;
  }

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
        <Flex
          flexDir={{ base: "column", xl: "row" }}
          justifyContent="center"
          gap={{ base: 2, md: 3 }}
          alignItems={{ base: "stretch", xl: "flex-start" }}
        >
          <Flex
            flexWrap="wrap"
            gap={{ base: 2, md: 3 }}
            justifyContent="flex-start"
            w="full"
          >
            <Box w={{ base: "100%", md: "15%", xl: "5rem" }} minW="80px">
              {theme === "light" ? (
                <InputComponentFilterHome
                  textAlign={"start"}
                  type="number"
                  placeholder="ID"
                  value={Id?.toString() || ""}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    if (value === "") {
                      setId(null);
                    } else if (!isNaN(Number(value)) && Number(value) > 0) {
                      setId(Number(value));
                    }
                  }}
                />
              ) : (
                <InputComponentFilterHome
                  textAlign={"start"}
                  type="number"
                  placeholder="ID"
                  _dark={{
                    borderColor: "#00d672",
                    textColor: "white",
                  }}
                  _placeholder={{
                    color: "white",
                  }}
                  value={Id?.toString() || ""}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    if (value === "") {
                      setId(null);
                    } else if (!isNaN(Number(value)) && Number(value) > 0) {
                      setId(Number(value));
                    }
                  }}
                />
              )}
            </Box>

            <Box w={{ base: "100%", md: "30%", xl: "20rem" }} minW="200px">
             {theme === 'light' ? (
                <InputComponentFilterHome
                  textAlign={"start"}
                  type="text"
                  placeholder="Nome"
                  value={Nome ?? ""}
                  onChange={(e) => setNome(e.target.value.toUpperCase())}
                />
              ) : (
                <InputComponentFilterHome
                  textAlign={"start"}
                  type="text"
                  placeholder="Nome"
                  _dark={{
                    borderColor: "#00d672",
                    textColor: "white",
                  }}
                  _placeholder={{
                    color: "white",
                  }}
                  value={Nome ?? ""}
                  onChange={(e) => setNome(e.target.value.toUpperCase())}
                />
              )}
            </Box>
            <Box
              w={{ base: "100%", sm: "48%", md: "20%", xl: "10rem" }}
              minW="120px"
            >
              <Select
                textColor={"#00713D"}
                _hover={{ borderColor: "#00613C" }}
                borderColor={"#00713D"}
                placeholder="Andamento"
                size="sm"
                _dark={{
                  borderColor: "#00d672",
                  textColor: "white",
                }}
                borderRadius="0.5rem"
                value={Andamento ?? ""}
                onChange={(e) => setAndamento(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="VAZIO">VAZIO</option>
                <option value="INICIADO">INICIADO</option>
                <option value="APROVADO">APROVADO</option>
                <option value="EMITIDO">EMITIDO</option>
                <option value="REVOGADO">REVOGADO</option>
              </Select>
            </Box>

            <Box
              w={{ base: "100%", sm: "48%", md: "30%", xl: "15rem" }}
              minW="180px"
            >
              <SelectComponentFilterHome
                Data={DataEmpreendimento}
                placeholder="Empreendimento"
                value={Empreendimento?.toString() ?? ""}
                onChange={(e) => setEmpreendimento(Number(e.target.value))}
              />
            </Box>

            <Box
              w={{ base: "100%", sm: "48%", md: "30%", xl: "15rem" }}
              minW="150px"
            >
              <SelectComponentFilterHome
                Data={DataFinanceiro}
                placeholder="Financeiro"
                value={Financeiro?.toString() ?? ""}
                onChange={(e) => setFinanceiro(Number(e.target.value))}
              />
            </Box>
          </Flex>

          <Flex
            gap={{ base: 2, md: 3 }}
            w={{ base: "full", xl: "auto" }}
            flexDir={{ base: "row", xl: "row" }}
          >
            <Button
              bg={theme === "dark" ? "#00d672" : "#00713D"}
              flex={{ base: 1, xl: "none" }}
              minW={{ xl: "120px" }}
              borderRadius="0.5rem"
              color="white"
              size="sm"
              _hover={{ bg: theme === "dark" ? "#00b85d" : "#00631B" }}
              onClick={filtroPrimario}
              isLoading={IsLoading}
            >
              Filtrar
            </Button>
            <Button
              bg={theme === "dark" ? "#00d672" : "#00713D"}
              flex={{ base: 1, xl: "none" }}
              minW={{ xl: "120px" }}
              borderRadius="0.5rem"
              color="white"
              size="sm"
              _hover={{ bg: theme === "dark" ? "#00b85d" : "#00631B" }}
              onClick={HandleFilterBlank}
              isLoading={IsLoading}
            >
              Limpar
            </Button>
          </Flex>
        </Flex>

        {/* Mostrar loading */}
        {IsLoading && <Loading />}

        {/* Mostrar dados quando existem */}
        {!IsLoading && ListaDados && ListaDados.length > 0 && (
          <>
            <Flex
              w="full"
              bg={bgTable}
              shadow="lg"
              borderRadius="15px"
              p={{ base: "10px", md: "15px", xl: "20px" }}
              alignContent="center"
              justifyContent="space-evenly"
              flexDir="column"
              border="1px solid"
              borderColor={borderTable}
            >
              {/* Renderização condicional: Cards para mobile, Tabela para desktop */}
              {isMobile ? (
                // Cards para mobile
                <Box w="full">
                  {ListaDados.map((item) => (
                    <CardComponentHome
                      key={item.id}
                      dados={item}
                      session={session ?? null}
                    />
                  ))}
                </Box>
              ) : (
                // Tabela para desktop
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
                          w={{ base: "10rem", md: "13rem" }}
                          textAlign="center"
                        >
                          AGENDAMENTO
                        </Th>
                        <Th
                          fontSize={{ base: "sm", md: "md", lg: "lg" }}
                          p={{ base: "0.5rem", md: "0.8rem" }}
                          borderBottomColor={borderBottomColor}
                          w={{ base: "7rem", md: "8rem" }}
                          textAlign="center"
                        >
                          PG
                        </Th>
                        <Th
                          fontSize={{ base: "sm", md: "md", lg: "lg" }}
                          p={{ base: "0.5rem", md: "0.8rem" }}
                          borderBottomColor={borderBottomColor}
                          w={{ base: "9rem", md: "10rem" }}
                          textAlign="center"
                        >
                          DATA PG
                        </Th>
                        <Th
                          fontSize={{ base: "sm", md: "md", lg: "lg" }}
                          p={{ base: "0.5rem", md: "0.8rem" }}
                          borderBottomColor={borderBottomColor}
                          w={{ base: "11rem", md: "13rem" }}
                          textAlign="center"
                        >
                          CONFIRMADO PG
                        </Th>
                        <Th
                          fontSize={{ base: "sm", md: "md", lg: "lg" }}
                          p={{ base: "0.5rem", md: "0.8rem" }}
                          borderBottomColor={borderBottomColor}
                          w={{ base: "7rem", md: "8rem" }}
                          textAlign="center"
                        >
                          Andamento
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
                      {ListaDados.map((item) => (
                        <TableComponent
                          key={item.id}
                          dados={item}
                          session={session ?? null}
                        />
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}

              {/* Footer com paginação */}
              <Flex
                w="full"
                justifyContent={{ base: "center", md: "space-between" }}
                alignItems="center"
                pt={3}
                flexDir={{ base: "column", md: "row" }}
                gap={{ base: 2, md: 0 }}
              >
                <Box
                  fontSize={{ base: "sm", md: "md" }}
                  color={textColorSecondary}
                >
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
                    ClientQtd={ListaDados.length || 0}
                    SelectPage={PagAtual}
                    setSelectPage={setPagina}
                    SetVewPage={NextPage}
                  />
                </Flex>
              </Flex>
            </Flex>
          </>
        )}
      </Box>
    </>
  );
};
