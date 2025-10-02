"use client";
import { SessionServer } from "@/types/session";
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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { InputComponentFilterHome } from "@/components/home/imputs/input";
import { SelectComponentFilterHome } from "@/components/home/imputs/select";
import { SelectPgComponent } from "@/components/home/imputs/selectPg";
import { TableComponentNatosign } from "./lista";
import useHomeNatosignContex from "@/hook/useHomeNatosignContext";

interface DadoCompomentListProps {
  dados: natosign.NatosignGetType | null;
  session: SessionNext.Server | null;
}

const FirlterData = async (
  { nome, status, cca_id, id, pagina, data_inicio, data_fim }: any,
  session: SessionServer | SessionNext.Server | null
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
  const router = useRouter();
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
  const [pagina, setPagina] = useState<number | null>(1);

  const { data } = useHomeNatosignContex();

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

  return (
    <>
      <Box
        display={"flex"}
        flexDir={"column"}
        gap={{ base: 2, xl: 6 }}
        w={{ base: "100%", xl: "80%" }}
        h={"100%"}
        px={4}
        py={3}
      >
        <Flex w="full" justifyContent={"end"}>
          <Button
            bg="blue.500"
            color="white"
            w={{ base: "100%", xl: "auto" }}
            _hover={{ bg: "blue.600" }}
            onClick={() => router.push("/natosign/create")}
          >
            Criar envelope
          </Button>
        </Flex>
        <Flex
          flexDir={{ base: "column", xl: "row" }}
          justifyContent="center"
          gap={{ base: 2, xl: 4 }}
        >
          <Flex flexWrap="wrap" gap={4} justifyContent="flex-start" w="full">
            <Box w={{ base: "48%", md: "20%", xl: "10rem" }}>
              <InputComponentFilterHome
                textAlign={"start"}
                type="number"
                placeholder="ID do Envelope"
                value={id ?? ""}
                onChange={(e) => setId(e.target.value)}
              />
            </Box>

            <Box w={{ base: "48%", md: "40%", xl: "20rem" }}>
              <InputComponentFilterHome
                placeholder="Nome do Signatário"
                value={nome ?? ""}
                onChange={(e) => setNome(e.target.value)}
              />
            </Box>

            <Box w={{ base: "48%", md: "20%", xl: "10rem" }}>
              <Select
                textColor={"#00713D"}
                _hover={{ borderColor: "#00613C" }}
                borderColor={"#00713D"}
                placeholder="Status"
                size="sm"
                borderRadius="1rem"
                value={status ?? ""}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="done">Finalizado</option>
                <option value="waiting">Aguardando</option>
                <option value="signing">Assinando</option>
                <option value="rejected">Rejeitado</option>
              </Select>
            </Box>

            {session?.user.hierarquia === "ADM" && (
              <Box w={{ base: "48%", md: "30%", xl: "15rem" }}>
                <SelectComponentFilterHome
                  Data={DataFinanceiro}
                  place="Financeira (CCA)"
                  value={ccaId?.toString() ?? ""}
                  onChange={(e) => setCcaId(Number(e.target.value))}
                />
              </Box>
            )}

            <Box w={{ base: "48%", md: "30%", xl: "15rem" }}>
              <InputComponentFilterHome
                type="date"
                value={dataInicio ?? ""}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </Box>
            <Box w={{ base: "48%", md: "30%", xl: "15rem" }}>
              <InputComponentFilterHome
                type="date"
                value={dataFim ?? ""}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </Box>
          </Flex>

          <Box w={{ base: "100%", xl: "auto" }}>
            <Button
              bg="#00713D"
              w={{ base: "100%", xl: "auto" }}
              textColor="white"
              variant="solid"
              _hover={{ bg: "#00631B" }}
              size="md"
              onClick={filtroPrimario}
            >
              Filtrar
            </Button>
          </Box>
          <Box w={{ base: "100%", xl: "auto" }}>
            <Button
              bg="#00713D"
              w={{ base: "100%", xl: "auto" }}
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

        {IsLoading && <Loading />}
        {!IsLoading && (
          <Flex
            w={"full"}
            bg={"gray.50"}
            shadow={"lg"}
            borderRadius={"15px"}
            p={{ base: "10px", xl: "20px" }}
            alignContent={"center"}
            justifyContent={"space-evenly"}
            flexDir={"column"}
            border={"1px solid"}
            borderColor={"gray.200"}
          >
            <Box
              w="full"
              overflowX="auto" // <<< A MÁGICA ACONTECE AQUI
              bg={"gray.50"}
              shadow={"lg"}
              borderRadius={"15px"}
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
                      minW={"80px"}
                    >
                      ID
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      minW={"200px"}
                    >
                      SIGNATÁRIOS
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      minW={"120px"}
                    >
                      STATUS
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      minW={"150px"}
                    >
                      DATA CRIAÇÃO
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      minW={"150px"}
                      whiteSpace="nowrap"
                    >
                      ATUALIZADO EM
                    </Th>
                    <Th
                      fontSize={"lg"}
                      p={"0.8rem"}
                      borderBottomColor={"gray.300"}
                      minW={"130px"}
                      textAlign="center"
                    >
                      FUNÇÕES
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {ListaDados?.map((item) => (
                    <TableComponentNatosign
                      key={item.UUID}
                      dados={item}
                      session={session ?? null}
                    />
                  ))}
                </Tbody>
              </Table>
            </Box>
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
                  SelectPage={pagina || 1}
                  setSelectPage={setPagina}
                  SetVewPage={irParaPagina}
                />
              </Flex>
            </Flex>
          </Flex>
        )}
      </Box>
    </>
  );
};
