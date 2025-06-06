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
  dados: solictacao.SolicitacaoGetType | null;
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
      ? `/api/solicitacao/getall?${filter.join("&")}`
      : `/api/solicitacao/getall`;

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
};

const fetchConstrutoraAll = async () => {
  const resq = await fetch(`/api/construtora/getall`);
  const data = await resq.json();
  return data;
};

const fetchEmpreendimentoAll = async () => {
  const resq = await fetch(`/api/empreendimento/getall`);
  const data = await resq.json();
  return data;
};

const fetchFinanceiroAll = async () => {
  const resq = await fetch(`/api/financeira/getall`);
  const data = await resq.json();
  return data;
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

  const { data } = useHomeContex();

  useEffect(() => {
    console.log("data", dados);
    if (dados) {
      setListaDados(dados.data);
      setTotal(dados.total);
      setPagAtual(dados.pagina);
    }
    if (data) {
      if (data.data?.length > 0) {
        setListaDados(data.data);
        setTotal(data.total);
        setPagAtual(data.pagina);
      }
    }
    if (session?.user) {
      (async () => {
        if (session.user.hierarquia === "ADM") {
          setDataConstrutora(await fetchConstrutoraAll());
          setDataEmpreendimento(await fetchEmpreendimentoAll());
          setDataFinanceiro(await fetchFinanceiroAll());
        } else {
          session.user.construtora.length > 0 &&
            setDataConstrutora(session.user.construtora);
          session.user.empreendimento.length > 0 &&
            setDataEmpreendimento(session.user.empreendimento);
          session.user.Financeira.length > 0 &&
            setDataFinanceiro(session.user.Financeira);
        }
      })();
    }
  }, [data, dados, session]);

  const filtroPrimario = async () => {
    if (!ListaDados) return;
    const filtro = ListaDados.filter((item) => {
      item.nome.toLowerCase().includes(Nome?.toLowerCase() || "") &&
        item.andamento
          ?.toLowerCase()
          .includes(Andamento?.toLowerCase() || "") &&
        item.construtora?.id === Construtora &&
        item.empreendimento.id === Empreendimento &&
        item.financeiro.id === Financeiro &&
        item.id === Id;
    });
    if (filtro?.length !== 0) {
      setListaDados(filtro);
    } else {
      setListaDados(null);
      setMesageError("Nenhum dado encontrado");
    }
  };

  const filtroSecundario = async () => {
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

    if (filtro?.length !== 0) {
      setListaDados(filtro);
    } else {
      setListaDados(null);
      setMesageError("Nenhum dado encontrado no banco de dados");
    }
  };

  const HandleFilterBlank = async () => {
    setNome(null);
    setAndamento(null);
    setConstrutora(null);
    setEmpreendimento(null);
    setFinanceiro(null);
    setId(null);
    setPagina(null);
    setListaDados(
      await FirlterData(
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
      )
    );
    setMesageError(null);
  };

  const NextPage = async () => {
    if (Pagina === null) return;
    setListaDados(
      await FirlterData(
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
      )
    );
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
            <FormLabel textAlign={{ base: "left", "2xl": "center" }}>
              Id
            </FormLabel>
            <InputComponentFilterHome
              textAlign={"center"}
              type="number"
              value={Id ?? 0}
              onChange={(e) => setId(Number(e.target.value))}
            />
          </Box>
          <Box w={{ base: "100%", "2xl": "20rem" }}>
            <FormLabel textAlign={{ base: "left", "2xl": "center" }}>
              Nome
            </FormLabel>
            <InputComponentFilterHome
              type="text"
              value={Nome ?? ""}
              onChange={(e) => setNome(e.target.value)}
            />
          </Box>
          <Box w={{ base: "100%", "2xl": "10rem" }}>
            <FormLabel textAlign={{ base: "left", "2xl": "center" }}>
              Andamento
            </FormLabel>
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
              <option></option>
              <option value="VAZIO">VAZIO</option>
              <option value="INICIADO">INICIADO</option>
              <option value="APROVADO">APROVADO</option>
              <option value="EMITIDO">EMITIDO</option>
              <option value="REVOGADO">REVOGADO</option>
            </Select>
          </Box>
          <Box w={{ base: "100%", "2xl": "15rem" }}>
            <FormLabel textAlign={{ base: "left", "2xl": "center" }}>
              Empreendimento
            </FormLabel>
            <SelectComponentFilterHome
              Data={DataEmpreendimento}
              value={Empreendimento?.toString() ?? ""}
              onChange={(e) => setEmpreendimento(Number(e.target.value))}
            />
          </Box>
          <Box w={{ base: "100%", "2xl": "15rem" }}>
            <FormLabel textAlign={{ base: "left", "2xl": "center" }}>
              Financeiro
            </FormLabel>
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
            >
              Limpar
            </Button>
          </Box>
        </Flex>
        {ListaDados?.length === 0 && MesageError && (
          <>
            <Flex
              justifyContent="center"
              alignItems="center"
              w="100%"
              h="78vh"
              gap={8}
              p={4}
            >
              <Text>{MesageError}</Text>
              <Button
                w={{ base: "100%", "2xl": "auto" }}
                size="lg"
                colorScheme="green"
                onClick={filtroSecundario}
              >
                Busca Avançada
              </Button>
            </Flex>
          </>
        )}
        {ListaDados && (
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
                  {ListaDados?.map((item) => (
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
                    ClientQtd={dados?.data.length || 0}
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
              {ListaDados?.map((item) => (
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
