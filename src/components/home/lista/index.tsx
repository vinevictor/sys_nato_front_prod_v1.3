"use client";
import { BugReport } from "@/components/bug";
import useHomeContex from "@/hook/useHomeContex";
import { SessionServer } from "@/types/session";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Select,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ImClock } from "react-icons/im";
import { InputComponentFilterHome } from "../imputs/input";
import { SelectComponentFilterHome } from "../imputs/select";
import { SelectPgComponent } from "../imputs/selectPg";
import { TableComponent } from "./table";
import { BtnListNow } from "../imputs/BtnListNow";
import BtnAlertList from "../imputs/BtnAlertList";
import { useRouter } from "next/navigation";

interface DadoCompomentListProps {
  dados: solictacao.SolicitacaoGetType | null;
  session: SessionNext.Server | null;
}

interface FirlterDataProps {
  nome: string | null;
  andamento: string | null;
  construtora: number | null;
  empreendimento: number | null;
  financeiro: number | null;
  id: number | null;
  pagina?: number | null;
}

const FirlterData = async (
  {
    nome,
    andamento,
    construtora,
    empreendimento,
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
  Number(empreendimento) > 0 && filter.push(`empreendimento=${empreendimento}`);
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
  const data = await user.json();
  if (!user.ok) {
    console.error("FirlterData status:", user.status);
    return null;
  }
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
  const router = useRouter();
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data } = useHomeContex();

  useEffect(() => {
    if (dados) {
      setListaDados(dados.data);
      setTotal(dados.total);
    }
    if (data) {
      if (data.data?.length > 0) {
        setListaDados(data.data);
        setTotal(data.total);
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
    const filtro = await FirlterData(
      {
        nome: Nome,
        andamento: Andamento,
        construtora: Construtora,
        empreendimento: Empreendimento,
        financeiro: Financeiro,
        id: Id,
      },
      session
    );
    if (filtro?.total !== 0) {
      setListaDados(filtro.data);
      setTotal(filtro.total);
    } else {
      setListaDados(null);
      setMesageError("Nenhum dado encontrado");
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
    const data = await FirlterData(
      {
        nome: Nome,
        andamento: Andamento,
        construtora: Construtora,
        empreendimento: Empreendimento,
        financeiro: Financeiro,
        id: Id,
        pagina: null,
      },
      session
    );
    setListaDados(data.data);
    setMesageError(null);
    window.location.reload();
  };

  const NextPage = async () => {
    if (Pagina === null) return;
    const data = await FirlterData(
      {
        nome: Nome,
        andamento: Andamento,
        construtora: Construtora,
        empreendimento: Empreendimento,
        financeiro: Financeiro,
        id: Id,
        pagina: Pagina,
      },
      session
    );
    setListaDados(data.data);
    setPagina(Pagina);
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
        <Button
          display={{ base: "inline-flex", xl: "none" }}
          onClick={onOpen}
          m={4}
          size="sm"
          variant="outline"
          px={6}
          py={4}
          fontSize="md"
          fontWeight="bold"
          borderRadius="lg"
          border="1px solid green"
          color="green"
          _hover={{ bg: "green.50" }}
          alignSelf="flex-start"
        >
          Chamados - Alertas - Now
        </Button>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Chamados - Alertas - Now</DrawerHeader>
            <DrawerBody>
              <Box mb={4}>
                <BugReport />
              </Box>
              <Flex w="full" gap={2} flexDir="column">
                {session?.user.role?.now && (
                  <BtnListNow session={session.user} />
                )}
                {session?.user.role?.alert && (
                  <BtnAlertList session={session.user} />
                )}
                <Button
                  w="full"
                  color="white"
                  textAlign="center"
                  p="8px"
                  bg="blue.500"
                  fontWeight="bold"
                  borderRadius="md"
                  fontSize="1rem"
                  _hover={{ bg: "blue.600" }}
                  onClick={() => {
                    router.push("/chamado");
                    onClose();
                  }}
                >
                  Chamados
                </Button>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Flex
          flexDir={{ base: "column", xl: "row" }}
          justifyContent="center"
          
          gap={{ base: 2, xl: 4 }}
        >
          <Flex flexWrap="wrap" gap={4} justifyContent="flex-start" w="full">
            <Box w={{ base: "48%", md: "20%", xl: "5rem" }}>
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

            <Box w={{ base: "48%", md: "40%", xl: "20rem" }}>
              <InputComponentFilterHome
                type="text"
                value={Nome ?? ""}
                onChange={(e) => setNome(e.target.value.toUpperCase())}
              />
            </Box>

            <Box w={{ base: "48%", md: "20%", xl: "10rem" }}>
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

            <Box w={{ base: "48%", md: "30%", xl: "13rem" }}>
              <SelectComponentFilterHome
                Data={DataConstrutora}
                place="Construtora"
                value={Construtora?.toString() ?? ""}
                onChange={(e) => setConstrutora(Number(e.target.value))}
              />
            </Box>

            <Box w={{ base: "48%", md: "30%", xl: "15rem" }}>
              <SelectComponentFilterHome
                Data={DataEmpreendimento}
                place="Empreendimento"
                value={Empreendimento?.toString() ?? ""}
                onChange={(e) => setEmpreendimento(Number(e.target.value))}
              />
            </Box>

            <Box w={{ base: "48%", md: "30%", xl: "15rem" }}>
              <SelectComponentFilterHome
                Data={DataFinanceiro}
                place="Financeiro"
                value={Financeiro?.toString() ?? ""}
                onChange={(e) => setFinanceiro(Number(e.target.value))}
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
                <Th fontSize={"lg"} p={"0.8rem"} borderBottomColor={"gray.300"}>
                  NOME
                </Th>
                <Th
                  fontSize={"lg"}
                  p={"0.8rem"}
                  borderBottomColor={"gray.300"}
                  w={"15rem"}
                >
                  CONST - CCA
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
                SelectPage={Pagina || 1}
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
