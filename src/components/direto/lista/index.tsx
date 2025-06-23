"use client";
import { BugReport } from "@/components/bug";
import useHomeContex from "@/hook/useHomeContex";
import { SessionServer } from "@/types/session";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Select,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ImClock } from "react-icons/im";
import { InputComponentFilterHome } from "../imputs/input";
import { SelectComponentFilterHome } from "../imputs/select";
import { SelectPgComponent } from "../imputs/selectPg";
import { CardComponentHome } from "./card";
import { TableComponent } from "./table";

interface DadoCompomentListProps {
  dados: solictacao.SolicitacaoGetType | solictacao.SolicitacaoObjectType[] | null;
  session: SessionNext.Server | null;
}

interface FirlterDataProps {
  nome: string | null;
  andamento: string | null;
  construtora: number | null;
  empreedimento: number | null;
  financeiro: number | null;
  id: number | null;
  pagina: number | null;
}

const FirlterData = async (
  {
    nome,
    andamento,
    construtora,
    empreedimento,
    financeiro,
    id,
    pagina,
  }: FirlterDataProps,
  session: SessionServer | SessionNext.Server | null
) => {
  const filter = [];

  nome && filter.push(`nome=${nome}`);
  andamento && filter.push(`andamento=${andamento}`);
  Number(construtora) > 0 && filter.push(`construtora=${construtora}`);
  Number(empreedimento) > 0 && filter.push(`empreedimento=${empreedimento}`);
  Number(financeiro) > 0 && filter.push(`financeiro=${financeiro}`);
  Number(id) > 0 && filter.push(`id=${id}`);
  Number(pagina) > 0 && filter.push(`pagina=${pagina}`);

  const URL =
    filter.length > 0
      ? `/api/direto/get?${filter.join("&")}`
      : `/api/direto/get`;

  try {
    const user = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      cache: "no-store",
    });

    if (!user.ok) {
      console.error("FirlterData status:", user.status);
      return null;
    }
    const data = await user.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
};

const fetchConstrutoraAll = async () => {
  try {
    const resq = await fetch(`/api/construtora/getall`);
    const data = await resq.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar construtoras:", error);
    return [];
  }
};

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
  if (dados && typeof dados === 'object' && Array.isArray(dados.data)) {
    return dados.data;
  }
  return [];
};

// Função helper para extrair informações de paginação
const extractPaginationInfo = (dados: any) => {
  if (dados && typeof dados === 'object' && !Array.isArray(dados)) {
    return {
      total: dados.total || 0,
      pagina: dados.pagina || 1
    };
  }
  return { total: 0, pagina: 1 };
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
  const [Construtora, setConstrutora] = useState<number | null>(null);
  const [DataConstrutora, setDataConstrutora] = useState<any>([]);
  const [Empreendimento, setEmpreendimento] = useState<number | null>(null);
  const [DataEmpreendimento, setDataEmpreendimento] = useState<any>([]);
  const [Financeiro, setFinanceiro] = useState<number | null>(null);
  const [DataFinanceiro, setDataFinanceiro] = useState<any>([]);
  const [Id, setId] = useState<number | null>(null);
  const [Pagina, setPagina] = useState<number | null>(null);
  const [MesageError, setMesageError] = useState<string | null>(null);
  const [Total, setTotal] = useState<number>(0);
  const [PagAtual, setPagAtual] = useState<number>(0);
  const [Loading, setLoading] = useState<boolean>(false);

  const { data } = useHomeContex();

  useEffect(() => {
    // Inicializar dados usando as funções helper
    const dadosArray = extractDataArray(dados) || extractDataArray(data);

    if (dadosArray.length > 0) {
      setListaDados(dadosArray);

      // Tentar extrair informações de paginação dos dados originais
      const paginationInfo = extractPaginationInfo(dados) || extractPaginationInfo(data);
      setTotal(paginationInfo.total || dadosArray.length);
      setPagAtual(paginationInfo.pagina);
      setMesageError(null);
    } else {
      setListaDados(null);
      setMesageError("Nenhum dado encontrado");
    }

    // Carregar dados auxiliares
    if (session?.user) {
      (async () => {
        try {
          if (session?.user?.hierarquia === "ADM") {
            const [construtoras, empreendimentos, financeiras] = await Promise.all([
              fetchConstrutoraAll(),
              fetchEmpreendimentoAll(),
              fetchFinanceiroAll()
            ]);
            setDataConstrutora(construtoras || []);
            setDataEmpreendimento(empreendimentos || []);
            setDataFinanceiro(financeiras || []);
          } else {
            setDataConstrutora(session?.user?.construtora || []);
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
    // Usar dados originais para filtrar
    const dadosOriginais = extractDataArray(dados) || extractDataArray(data);

    if (dadosOriginais.length === 0) {
      setMesageError("Nenhum dado disponível para filtrar");
      return;
    }

    const filtro = dadosOriginais.filter((item) => {
      const nomeMatch = !Nome || item.nome.toLowerCase().includes(Nome.toLowerCase());
      const andamentoMatch = !Andamento || item.andamento?.toLowerCase().includes(Andamento.toLowerCase());
      const construtoraMatch = !Construtora || item.construtora?.id === Construtora;
      const empreendimentoMatch = !Empreendimento || item.empreendimento?.id === Empreendimento;
      const financeiroMatch = !Financeiro || item.financeiro?.id === Financeiro;
      const idMatch = !Id || item.id === Id;

      return nomeMatch && andamentoMatch && construtoraMatch && empreendimentoMatch && financeiroMatch && idMatch;
    });

    if (filtro.length > 0) {
      setListaDados(filtro);
      setTotal(filtro.length);
      setMesageError(null);
    } else {
      setListaDados([]);
      setMesageError("Nenhum dado encontrado com os filtros aplicados");
    }
  };

  const filtroSecundario = async () => {
    setLoading(true);
    try {
      const filtro = await FirlterData(
        {
          nome: Nome,
          andamento: Andamento,
          construtora: Construtora,
          empreedimento: Empreendimento,
          financeiro: Financeiro,
          id: Id,
          pagina: Pagina,
        },
        session
      );

      if (filtro) {
        const dadosArray = extractDataArray(filtro);
        const paginationInfo = extractPaginationInfo(filtro);

        if (dadosArray.length > 0) {
          setListaDados(dadosArray);
          setTotal(paginationInfo.total || dadosArray.length);
          setPagAtual(paginationInfo.pagina);
          setMesageError(null);
        } else {
          setListaDados([]);
          setMesageError("Nenhum dado encontrado no banco de dados");
        }
      } else {
        setListaDados([]);
        setMesageError("Erro ao realizar busca avançada");
      }
    } catch (error) {
      console.error("Erro na busca avançada:", error);
      setMesageError("Erro ao realizar busca avançada");
    } finally {
      setLoading(false);
    }
  };

  const HandleFilterBlank = async () => {
    setLoading(true);
    try {
      setNome(null);
      setAndamento(null);
      setConstrutora(null);
      setEmpreendimento(null);
      setFinanceiro(null);
      setId(null);
      setPagina(null);

      const result = await FirlterData(
        {
          nome: null,
          andamento: null,
          construtora: null,
          empreedimento: null,
          financeiro: null,
          id: null,
          pagina: null,
        },
        session
      );

      if (result) {
        const dadosArray = extractDataArray(result);
        const paginationInfo = extractPaginationInfo(result);

        setListaDados(dadosArray);
        setTotal(paginationInfo.total || dadosArray.length);
        setPagAtual(paginationInfo.pagina);
      } else {
        // Restaurar dados originais
        const dadosOriginais = extractDataArray(dados) || extractDataArray(data);
        const paginationOriginal = extractPaginationInfo(dados) || extractPaginationInfo(data);

        setListaDados(dadosOriginais);
        setTotal(paginationOriginal.total || dadosOriginais.length);
        setPagAtual(paginationOriginal.pagina);
      }
      setMesageError(null);
    } catch (error) {
      console.error("Erro ao limpar filtros:", error);
    } finally {
      setLoading(false);
    }
  };

  const NextPage = async () => {
    if (Pagina === null) return;

    setLoading(true);
    try {
      const result = await FirlterData(
        {
          nome: null,
          andamento: null,
          construtora: null,
          empreedimento: null,
          financeiro: null,
          id: null,
          pagina: Pagina,
        },
        session
      );

      if (result) {
        const dadosArray = extractDataArray(result);
        const paginationInfo = extractPaginationInfo(result);

        setListaDados(dadosArray);
        setTotal(paginationInfo.total || dadosArray.length);
        setPagAtual(paginationInfo.pagina);
      }
    } catch (error) {
      console.error("Erro ao navegar para próxima página:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDir={"column"}
        gap={{ base: 2, "2xl": 6 }}
        w={{ base: "100%", "2xl": "80%" }}
        h={"100%"}
        px={4}
        justifyContent={"space-between"}
        py={3}
      >
        <Box display={{ base: "block", "2xl": "none" }}>
          <BugReport />
        </Box>

        <Flex
          flexDir={{ base: "column", "2xl": "row" }}
          justifyContent="center"
          alignItems="flex-end"
          gap={{ base: 2, "2xl": 4 }}
        >
          <Box w={{ base: "100%", "2xl": "5rem" }}>
            
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
          <Box w={{ base: "100%", "2xl": "20rem" }}>
            
            <InputComponentFilterHome
              type="text"
              value={Nome ?? ""}
              placeholder="Nome"
              onChange={(e) => setNome(e.target.value)}
            />
          </Box>
          <Box w={{ base: "100%", "2xl": "10rem" }}>
          
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
          <Box w={{ base: "100%", "2xl": "15rem" }}>
            
            <SelectComponentFilterHome
              Data={DataEmpreendimento}
              value={Empreendimento?.toString() ?? ""}
              onChange={(e) => setEmpreendimento(Number(e.target.value))}
            />
          </Box>
          <Box w={{ base: "100%", "2xl": "15rem" }}>
            
            <SelectComponentFilterHome
              Data={DataFinanceiro}
              value={Financeiro?.toString() ?? ""}
              onChange={(e) => setFinanceiro(Number(e.target.value))}
            />
          </Box>
          <Box w={{ base: "100%", "2xl": "auto" }}>
            <Button
              bg="#00713D"
              w={{ base: "100%", "2xl": "auto" }}
              textColor="white"
              variant="solid"
              _hover={{ bg: "#00631B" }}
              size="md"
              onClick={filtroPrimario}
              isLoading={Loading}
            >
              Filtrar
            </Button>
          </Box>
          <Box w={{ base: "100%", "2xl": "auto" }}>
            <Button
              bg="#00713D"
              w={{ base: "100%", "2xl": "auto" }}
              textColor="white"
              variant="solid"
              _hover={{ bg: "#00631B" }}
              size="md"
              onClick={HandleFilterBlank}
              isLoading={Loading}
            >
              Limpar
            </Button>
          </Box>
        </Flex>

        {/* Mostrar loading */}
        {Loading && (
          <Flex
            justifyContent="center"
            alignItems="center"
            w="100%"
            h="200px"
          >
            <Text>Carregando...</Text>
          </Flex>
        )}

        {/* Mostrar erro quando não há dados */}
        {!Loading && (!ListaDados || ListaDados.length === 0) && MesageError && (
          <Flex
            justifyContent="center"
            alignItems="center"
            w="100%"
            h="78vh"
            gap={8}
            p={4}
            flexDirection="column"
          >
            <Text fontSize="lg" textAlign="center">{MesageError}</Text>
            <Button
              w={{ base: "100%", "2xl": "auto" }}
              size="lg"
              colorScheme="green"
              onClick={filtroSecundario}
              isLoading={Loading}
            >
              Busca Avançada
            </Button>
          </Flex>
        )}

        {/* Mostrar dados quando existem */}
        {!Loading && ListaDados && ListaDados.length > 0 && (
          <>
            <Flex
              w={"full"}
              bg={"gray.50"}
              shadow={"lg"}
              borderRadius={"15px"}
              p={{ base: "10px", "2xl": "20px" }}
              alignContent={"center"}
              justifyContent={"space-evenly"}
              flexDir={"column"}
              display={{ base: "none", "2xl": "flex" }}
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
                      w={"13rem"}
                    >
                      AGENDAMENTO
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      w={"8rem"}
                    >
                      Andamento
                    </Th>
                    <Th
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      w={"5rem"}
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
              display={{ base: "flex", "2xl": "none" }}
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