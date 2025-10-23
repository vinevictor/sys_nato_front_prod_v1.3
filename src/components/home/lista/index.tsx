"use client";
import useHomeContex from "@/hook/useHomeContex";
import type { SessionServer } from "@/types/session";
import type { solictacao } from "@/types/solicitacao";
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
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ImClock } from "react-icons/im";
import {
  MdAccountBalance,
  MdBadge,
  MdBusiness,
  MdSearch,
  MdTimeline,
} from "react-icons/md";
import { SelectPgComponent } from "../imputs/selectPg";
import Loading from "@/app/loading";
import { CardComponent } from "./card";
import { TableComponent } from "./table";

interface DadoCompomentListProps {
  dados: solictacao.SolicitacaoGetType | null;
  session: SessionServer | null;
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
  session: SessionServer | null
) => {
  const filter = [];

  if (nome) filter.push(`nome=${nome}`);
  if (andamento) filter.push(`andamento=${andamento}`);
  if (Number(construtora) > 0) filter.push(`construtora=${construtora}`);
  if (Number(empreendimento) > 0)
    filter.push(`empreendimento=${empreendimento}`);
  if (Number(financeiro) > 0) filter.push(`financeiro=${financeiro}`);
  if (Number(id) > 0) filter.push(`id=${id}`);
  if (Number(pagina) > 0) filter.push(`pagina=${pagina}`);

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
  try {
    const resq = await fetch(`/api/construtora/getall`);

    // Check if response is ok
    if (!resq.ok) {
      console.error(
        "fetchConstrutoraAll failed:",
        resq.status,
        resq.statusText
      );
      return [];
    }

    // Check if response has content
    const text = await resq.text();
    if (!text) {
      console.warn("fetchConstrutoraAll: Empty response");
      return [];
    }

    // Try to parse JSON
    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      console.error("fetchConstrutoraAll: Invalid JSON response", parseError);
      return [];
    }
  } catch (error) {
    console.error("fetchConstrutoraAll error:", error);
    return [];
  }
};

const fetchEmpreendimentoAll = async () => {
  try {
    const resq = await fetch(`/api/empreendimento/getall`);

    if (!resq.ok) {
      console.error(
        "fetchEmpreendimentoAll failed:",
        resq.status,
        resq.statusText
      );
      return [];
    }

    const text = await resq.text();
    if (!text) {
      console.warn("fetchEmpreendimentoAll: Empty response");
      return [];
    }

    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      console.error(
        "fetchEmpreendimentoAll: Invalid JSON response",
        parseError
      );
      return [];
    }
  } catch (error) {
    console.error("fetchEmpreendimentoAll error:", error);
    return [];
  }
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
  const [Pagina, setPagina] = useState<number>(1);
  const [MesageError, setMesageError] = useState<string | null>(null);
  const [Total, setTotal] = useState<number>(0);
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const theme = useColorModeValue("light", "dark");

  // Cores responsivas ao tema
  const bgTable = useColorModeValue("gray.50", "gray.800");
  const borderTable = useColorModeValue("gray.200", "gray.600");
  const bgTableInner = useColorModeValue("gray.100", "gray.700");
  const borderBottomColor = useColorModeValue("gray.300", "gray.600");
  const textColorSecondary = useColorModeValue("gray.700", "gray.200");
  const filterBg = useColorModeValue("white", "gray.900");
  const filterBorder = useColorModeValue("gray.200", "gray.700");
  const filterTitleColor = useColorModeValue("#023147", "gray.100");
  const filterCaptionColor = useColorModeValue("gray.600", "gray.400");

  // Cores para botões e filtros (padrão do sistema)
  const buttonBg = useColorModeValue("#00713D", "#00d672");
  const buttonHoverBg = useColorModeValue("#005a31", "#00c060");
  const buttonColor = useColorModeValue("white", "gray.900");

  // Detecta se é mobile
  const [isMobile, setIsMobile] = useState(false);

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

  // Separa o useEffect em múltiplos para evitar re-renders desnecessários
  useEffect(() => {
    if (dados) {
      setListaDados(dados.data);
      setTotal(dados.total);
    }
  }, [dados]);

  useEffect(() => {
    if (data && data.data?.length > 0) {
      setListaDados(data.data);
      setTotal(data.total);
    }
  }, [data]);

  useEffect(() => {
    if (!session?.user) return;

    const loadData = async () => {
      if (session.user.hierarquia === "ADM") {
        const [construtoras, empreendimentos, financeiros] = await Promise.all([
          fetchConstrutoraAll(),
          fetchEmpreendimentoAll(),
          fetchFinanceiroAll(),
        ]);
        setDataConstrutora(construtoras);
        setDataEmpreendimento(empreendimentos);
        setDataFinanceiro(financeiros);
      } else {
        if (session.user.construtora.length > 0) {
          setDataConstrutora(session.user.construtora);
        }
        if (session.user.empreendimento.length > 0) {
          setDataEmpreendimento(session.user.empreendimento);
        }
        if (session.user.Financeira.length > 0) {
          setDataFinanceiro(session.user.Financeira);
        }
      }
    };

    loadData();
  }, [session?.user?.hierarquia, session?.user?.id]);

  const filtroPrimario = useCallback(async () => {
    setIsLoading(true);
    setPagina(1); // Reset para página 1 ao filtrar
    if (!ListaDados) return;
    const filtro = await FirlterData(
      {
        nome: Nome,
        andamento: Andamento,
        construtora: Construtora,
        empreendimento: Empreendimento,
        financeiro: Financeiro,
        id: Id,
        pagina: 1, // Sempre buscar primeira página ao filtrar
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
    setIsLoading(false);
  }, [
    Nome,
    Andamento,
    Construtora,
    Empreendimento,
    Financeiro,
    Id,
    session,
    ListaDados,
  ]);

  const HandleFilterBlank = useCallback(async () => {
    setIsLoading(true);
    setNome(null);
    setAndamento(null);
    setConstrutora(null);
    setEmpreendimento(null);
    setFinanceiro(null);
    setId(null);
    setPagina(1);
    const data = await FirlterData(
      {
        nome: null,
        andamento: null,
        construtora: null,
        empreendimento: null,
        financeiro: null,
        id: null,
        pagina: 1,
      },
      session
    );
    setListaDados(data.data);
    setTotal(data.total);
    setMesageError(null);
    setIsLoading(false);
    router.refresh();
  }, [session, router]);

  const NextPage = useCallback(
    async (page: number) => {
      setIsLoading(true);
      const data = await FirlterData(
        {
          nome: Nome,
          andamento: Andamento,
          construtora: Construtora,
          empreendimento: Empreendimento,
          financeiro: Financeiro,
          id: Id,
          pagina: page,
        },
        session
      );
      if (data?.data) {
        setListaDados(data.data);
        setTotal(data.total);
      }
      setIsLoading(false);
    },
    [Nome, Andamento, Construtora, Empreendimento, Financeiro, Id, session]
  );

  return (
    <>
      <Box
        bg={filterBg}
        border="1px solid"
        borderColor={filterBorder}
        borderRadius="lg"
        p={{ base: 4, md: 6 }}
        shadow="sm"
        mb={{ base: 5, md: 6 }}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={{ base: 4, md: 6 }}
        >
          <Box>
            <Heading
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="semibold"
              color={filterTitleColor}
            >
              Filtrar Solicitações
            </Heading>
            <Text
              mt={1}
              fontSize={{ base: "sm", md: "md" }}
              color={filterCaptionColor}
            >
              Utilize os campos abaixo para refinar os resultados.
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
                ID da Solicitação
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={MdBadge} color="gray.400" />
                </InputLeftElement>
                <Input
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
                color={filterTitleColor}
              >
                Nome do Cliente
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={MdSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Nome"
                  value={Nome ?? ""}
                  onChange={(e) => setNome(e.target.value.toUpperCase())}
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
                color={filterTitleColor}
              >
                Status (Andamento)
              </Text>
              <Select
                placeholder="Andamento"
                value={Andamento ?? ""}
                onChange={(e) => setAndamento(e.target.value)}
                icon={<MdTimeline />}
                bg="white"
                _dark={{
                  bg: "gray.800",
                  borderColor: "gray.600",
                  color: "gray.100",
                }}
                borderColor="gray.300"
                _hover={{ borderColor: "#00713D" }}
                _focus={{
                  borderColor: "#00713D",
                  boxShadow: "0 0 0 1px #00713D",
                }}
                sx={{
                  "& option": { bg: "white", color: "gray.800" },
                  "&:is([data-theme='dark']) option, .chakra-ui-dark & option":
                    { bg: "gray.800", color: "gray.100" },
                }}
              >
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
                Construtora
              </Text>
              <Select
                placeholder="Construtora"
                value={Construtora?.toString() ?? ""}
                onChange={(e) => setConstrutora(Number(e.target.value))}
                icon={<MdBusiness />}
                bg="white"
                _dark={{
                  bg: "gray.800",
                  borderColor: "gray.600",
                  color: "gray.100",
                }}
                borderColor="gray.300"
                _hover={{ borderColor: "#00713D" }}
                _focus={{
                  borderColor: "#00713D",
                  boxShadow: "0 0 0 1px #00713D",
                }}
                sx={{
                  "& option": { bg: "white", color: "gray.800" },
                  "&:is([data-theme='dark']) option, .chakra-ui-dark & option":
                    { bg: "gray.800", color: "gray.100" },
                }}
              >
                {DataConstrutora.map((item: any) => (
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
                Empreendimento
              </Text>
              <Select
                placeholder="Empreendimento"
                value={Empreendimento?.toString() ?? ""}
                onChange={(e) => setEmpreendimento(Number(e.target.value))}
                icon={<MdBusiness />}
                bg="white"
                _dark={{
                  bg: "gray.800",
                  borderColor: "gray.600",
                  color: "gray.100",
                }}
                borderColor="gray.300"
                _hover={{ borderColor: "#00713D" }}
                _focus={{
                  borderColor: "#00713D",
                  boxShadow: "0 0 0 1px #00713D",
                }}
                sx={{
                  "& option": { bg: "white", color: "gray.800" },
                  "&:is([data-theme='dark']) option, .chakra-ui-dark & option":
                    { bg: "gray.800", color: "gray.100" },
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
                Financeiro (CCA)
              </Text>
              <Select
                placeholder="Financeiro"
                value={Financeiro?.toString() ?? ""}
                onChange={(e) => setFinanceiro(Number(e.target.value))}
                icon={<MdAccountBalance />}
                bg="white"
                _dark={{
                  bg: "gray.800",
                  borderColor: "gray.600",
                  color: "gray.100",
                }}
                borderColor="gray.300"
                _hover={{ borderColor: "#00713D" }}
                _focus={{
                  borderColor: "#00713D",
                  boxShadow: "0 0 0 1px #00713D",
                }}
                sx={{
                  "& option": { bg: "white", color: "gray.800" },
                  "&:is([data-theme='dark']) option, .chakra-ui-dark & option":
                    { bg: "gray.800", color: "gray.100" },
                }}
              >
                {DataFinanceiro.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
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
                _dark={{ borderColor: "gray.600", _hover: { bg: "gray.700" } }}
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
                transition="all 0.2s"
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

      {/* Área de Resultados */}
      {IsLoading && <Loading />}
      {!IsLoading && (
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
              {ListaDados?.map((item) => (
                <CardComponent
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
                      w={{ base: "12rem", md: "15rem" }}
                    >
                      CONST - CCA
                    </Th>
                    <Th
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      p={{ base: "0.5rem", md: "0.8rem" }}
                      borderBottomColor={borderBottomColor}
                      w={{ base: "10rem", md: "13rem" }}
                    >
                      AGENDAMENTO
                    </Th>
                    <Th
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      p={{ base: "0.5rem", md: "0.8rem" }}
                      borderBottomColor={borderBottomColor}
                      w={{ base: "7rem", md: "8rem" }}
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
                  {ListaDados?.map((item) => (
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
      )}
    </>
  );
};
