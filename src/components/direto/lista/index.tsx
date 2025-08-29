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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ImClock } from "react-icons/im";
import { InputComponentFilterHome } from "../imputs/input";
import { SelectComponentFilterHome } from "../imputs/select";
import { SelectPgComponent } from "../imputs/selectPg";
import { CardComponentHome } from "./card";
import { TableComponent } from "./table";

interface DadoCompomentListProps {
  dados: solictacao.SolicitacaoGetType | null;
  session: SessionNext.Server | null;
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
  const toast = useToast();

  const { data } = useHomeContex();

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
        gap={{ base: 2, lg: 6 }}
        w={{ base: "100%", lg: "80%" }}
        h={"100%"}
        px={4}
        justifyContent={"space-between"}
        py={3}
      >
        <Box display={{ base: "block", lg: "none" }}>
          <BugReport />
        </Box>

        <Flex
          flexDir={{ base: "column", lg: "row" }}
          justifyContent="center"
          alignItems="flex-end"
          gap={{ base: 2, lg: 4 }}
        >
          <Box w={{ base: "100%", lg: "5rem" }}>
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
          </Box>
          <Box w={{ base: "100%", lg: "20rem" }}>
            <InputComponentFilterHome
              type="text"
              value={Nome ?? ""}
              placeholder="Nome"
              onChange={(e) => setNome(e.target.value)}
            />
          </Box>
          <Box w={{ base: "100%", lg: "10rem" }}>
            <Select
              textColor={"#00713D"}
              _hover={{ borderColor: "#00613C" }}
              borderColor={"#00713D"}
              placeholder="Andamento"
              size="sm"
              borderRadius="1rem"
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
          <Box w={{ base: "100%", lg: "15rem" }}>
            <SelectComponentFilterHome
              Data={DataEmpreendimento}
              placeholder="Empreendimento"
              value={Empreendimento?.toString() ?? ""}
              onChange={(e) => setEmpreendimento(Number(e.target.value))}
            />
          </Box>
          <Box w={{ base: "100%", lg: "15rem" }}>
            <SelectComponentFilterHome
              Data={DataFinanceiro}
              placeholder="Financeira"
              value={Financeiro?.toString() ?? ""}
              onChange={(e) => setFinanceiro(Number(e.target.value))}
            />
          </Box>
          <Box w={{ base: "100%", lg: "auto" }}>
            <Button
              bg="#00713D"
              w={{ base: "100%", lg: "auto" }}
              textColor="white"
              variant="solid"
              _hover={{ bg: "#00631B" }}
              size="md"
              onClick={filtroPrimario}
              isLoading={IsLoading}
            >
              Filtrar
            </Button>
          </Box>
          <Box w={{ base: "100%", lg: "auto" }}>
            <Button
              bg="#00713D"
              w={{ base: "100%", lg: "auto" }}
              textColor="white"
              variant="solid"
              _hover={{ bg: "#00631B" }}
              size="md"
              onClick={HandleFilterBlank}
              isLoading={IsLoading}
            >
              Limpar
            </Button>
          </Box>
        </Flex>

        {/* Mostrar loading */}
        {IsLoading && <Loading />}

        {/* Mostrar dados quando existem */}
        {!IsLoading && ListaDados && ListaDados.length > 0 && (
          <>
            <Flex
              w={"full"}
              bg={"gray.50"}
              shadow={"lg"}
              borderRadius={"15px"}
              p={{ base: "10px", lg: "20px" }}
              alignContent={"center"}
              justifyContent={"space-evenly"}
              flexDir={"column"}
              display={{ base: "none", lg: "flex" }}
              border={"1px solid"}
              borderColor={"gray.200"}
            >
              <Table
                variant="simple"
                size="sm"
                bg={"gray.100"}
                borderRadius={"15px"}
              >
                <Thead>
                  <Tr>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      w={"17rem"}
                      textAlign="center"
                    >
                      FUNÇÕES
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      w={"5rem"}
                    >
                      ID
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                    >
                      NOME
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      w={"10rem"}
                      textAlign="center"
                    >
                      AGENDAMENTO
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      w={"8rem"}
                      textAlign="center"
                    >
                      PG
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      w={"10rem"}
                      textAlign="center"
                    >
                      DATA PG
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      w={"13rem"}
                      textAlign="center"
                    >
                      CONFIRMADO PG
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      w={"8rem"}
                      textAlign="center"
                    >
                      Andamento
                    </Th>
                    <Th
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      w={"8rem"}
                      fontSize={"22px"}
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
              <Flex
                w={"full"}
                justifyContent={"space-between"}
                alignItems={"center"}
                pt={3}
              >
                <Box>Total de registros: {Total}</Box>
                <Flex gap={2}>
                  paginas:
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

            <Flex
              display={{ base: "flex", lg: "none" }}
              w={"full"}
              flexDir={"column"}
              gap={3}
            >
              {ListaDados.map((item) => (
                <CardComponentHome
                  key={item.id}
                  dados={item}
                  session={session ?? null}
                />
              ))}
            </Flex>
          </>
        )}
      </Box>
    </>
  );
};
