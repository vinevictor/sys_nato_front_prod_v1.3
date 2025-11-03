export const dynamic = "force-dynamic";

import MensagensChatDireto from "@/components/direto/mesage";
import Error404 from "@/components/Error404";
import FormSolicitacaoEdit from "@/components/form/solicitacao/edit";
import LogsComponent from "@/components/logsComponent";
import ListAlertas from "@/components/solicitacao/alert";
import SelectGov from "@/components/solicitacao/select_gov";
import { GetSessionServer } from "@/lib/auth_confg";
import RegisterProvider from "@/provider/RegisterProvider";
import { SolicitacaoIdType } from "@/types/solicitacao";
import { Box, Container, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { Suspense } from "react";

interface Props {
  params: {
    id: string;
  };
}

const requestData = async (id: number, token: string) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/${id}`;
  const request = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await request.json();
  if (!request.ok)
    return {
      error: true,
      message: data.message || "Solicitação não encontrada",
      data: null,
      status: request.status,
    };

  return {
    error: false,
    message: "Solicitação encontrada",
    data,
    status: request.status,
  };
};

const requestLogs = async (id: number, token: string) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/getlogs/${id}`;
  const request = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await request.json();
  if (!request.ok)
    return { error: true, message: "Solicitação não encontrada", data: null };
  return { error: false, message: "Logs encontrado", data };
};

const requestAlertas = async (id: number, token: string) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/alert/get/cadastro/${id}`;
  const request = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await request.json();
  if (!request.ok)
    return { error: true, message: "Solicitação não encontrada", data: null };
  return { error: false, message: "Alertas encontrado", data };
};

export default async function PageSolicitacoes({ params }: Props) {
  const { id } = params;
  const session = await GetSessionServer();
  if (!id) {
    return <Error404 />;
  }
  if (!session) {
    return <Error404 />;
  }
  const user = session.user;
  const data: SolicitacaoIdType = await requestData(+id, session?.token);
  const logs = await requestLogs(+id, session?.token);
  const alertas = await requestAlertas(+id, session?.token);
  if (data.status === 404) {
    return <Error404 />;
  }

  const isAdmin = user?.hierarquia === "ADM";
  const ContainerMesage = isAdmin ? "65vh" : "58%";
  const ContainerAlertas = isAdmin ? "52vh" : "60%";

  const AndamentoTxt = () => {
    if (data.data?.andamento === "EMITIDO") return "EMITIDO";
    if (data.data?.gov) {
      if (
        data.data?.andamento !== "APROVADO" &&
        data.data?.andamento !== "EMITIDO"
      )
        return "Atendido pelo GovBr";
    }
    if (data.data?.andamento === "EM EDICAO") return "";
    if (data.data?.andamento === "NOVA FC") return "INICIADO";
    if (data.data?.andamento === "REAGENDAMENTO") return "REAGENDADO";

    return data.data?.andamento;
  };

  const AprovacaoTxt = () => {
    const hora = data.data?.hr_aprovacao || "";
    const date = data.data?.dt_aprovacao || "";
    if (!hora || !date) return "";
    const dateFormatted = new Date(
      `${date.split("T")[0]}T${hora.split("T")[1]}`
    );
    return dateFormatted.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  };

  const AgendamentoTxt = () => {
    const hora = data.data?.hr_agendamento || "";
    const date = data.data?.dt_agendamento || "";
    if (!hora || !date) return "";
    const dateFormatted = new Date(
      `${date.split("T")[0]}T${hora.split("T")[1]}`
    );
    return dateFormatted.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  };

  return (
    <Container
      maxW="95%"
      mx="auto"
      px={{ base: 3, md: 6 }}
      py={{ base: 3, md: 6 }}
    >
      <RegisterProvider>
        {/* Cabeçalho interno com resumo da solicitação */}
        <Box mb={{ base: 4, md: 6 }}>
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 3, md: 4 }}
            align={{ md: "center" }}
            justify="space-between"
            wrap="wrap"
          >
            <Heading
              size={{ base: "md", md: "lg" }}
              color="gray.800"
              _dark={{ color: "gray.100" }}
            >
              Solicitação #{id}
            </Heading>
            <Flex
              w={{ base: "full", md: "auto" }}
              gap={{ base: 3, md: 8 }}
              direction={{ base: "column", md: "row" }}
              align={{ base: "flex-start", md: "center" }}
              bg="white"
              _dark={{ bg: "gray.800", boxShadow: "sm" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" } as any}
              rounded="lg"
              boxShadow="md"
              p={{ base: 3, md: 4 }}
              wrap="wrap"
            >
              {/* Coluna esquerda - datas e id */}
              <Box w={{ base: "full", md: "auto" }} minW={{ md: "320px" }}>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Criado Em:{" "}
                  {data?.data?.createdAt
                    ? `${data.data.createdAt
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")}, ${
                        data.data.createdAt.split("T")[1].split(".")[0]
                      }`
                    : "-"}
                </Text>
                {data?.data?.andamento !== "EMITIDO" &&
                  data.data?.andamento !== "APROVADO" && (
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color="gray.600"
                      _dark={{ color: "gray.300" }}
                    >
                      Agendado Em: {`${AgendamentoTxt()}`}
                    </Text>
                  )}
                {data?.data?.andamento === "EMITIDO" && (
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.600"
                    _dark={{ color: "gray.300" }}
                  >
                    Aprovado Em: {`${AprovacaoTxt()}`}
                  </Text>
                )}
                {data?.data?.andamento === "APROVADO" && (
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.600"
                    _dark={{ color: "gray.300" }}
                  >
                    Aprovado Em: {`${AprovacaoTxt()}`}
                  </Text>
                )}
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Id: {data?.data?.id ?? "-"}
                </Text>
              </Box>

              {/* Separador responsivo: horizontal no mobile, vertical no desktop */}
              <Divider display={{ base: "block", md: "none" }} my={2} />
              <Divider
                display={{ base: "none", md: "block" }}
                orientation="vertical"
                h="auto"
              />

              {/* Coluna direita - resumo */}
              <Box w={{ base: "full", md: "auto" }} minW={{ md: "320px" }}>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Corretor: {data?.data?.corretor?.nome || "-"}
                </Text>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Andamento: {AndamentoTxt() || ""}
                </Text>
                {session?.user?.hierarquia === "ADM" &&
                  data?.data?.andamento !== "EMITIDO" && (
                    <SelectGov isState={data?.data?.gov || false} />
                  )}
              </Box>
            </Flex>
          </Flex>
        </Box>
        <Divider mb={{ base: 4, md: 6 }} />

        {/* Layout principal - Stack vertical em mobile, horizontal em desktop */}
        <Flex
          direction="column"
          gap={{ base: 4, md: 6 }}
          maxW="full"
        >
          {/* Linha 1 - Formulário (65%) e Chat (35%) */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={{ base: 4, md: 6 }}
            w="full"
            align="stretch"
          >
            {/* Formulário - 65% */}
            {data.data && user && (
              <Box flex={{ base: "1", lg: "13" }}>
                <FormSolicitacaoEdit id={+id} data={data.data} session={user} />
              </Box>
            )}

            {/* Chat - 35% */}
            <Box
              flex={{ base: "1", lg: "7" }}
              minH={{ base: "360px", md: "420px" }}
              h={{ lg: ContainerMesage }}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="xl"
              shadow="lg"
              display="flex"
              flexDir="column"
              _dark={{ bg: "gray.800", borderColor: "gray.700", shadow: "md" }}
            >
                <MensagensChatDireto
                  Id={+id}
                  messages={data.data?.obs ?? []}
                  session={user}
                  disabled={
                    data.data?.andamento === "EMITIDO" ||
                    data.data?.andamento === "APROVADO"
                  }
                />
            </Box>
          </Flex>

          {/* Linha 2 - Logs (65%) e Alertas (35%) */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={{ base: 4, md: 6 }}
            w="full"
            align="stretch"
          >
            {/* Logs - 65% (somente ADM) */}
            {user?.hierarquia === "ADM" && (
              <Box
                flex={{ base: "1", lg: "13" }}
                minH={{ base: "280px", md: "340px" }}
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="xl"
                shadow="lg"
                overflowY="auto"
                _dark={{ bg: "gray.800", borderColor: "gray.700", shadow: "md" }}
              >
                <Suspense fallback={<LogsComponent logs={logs.data} />}>
                  <LogsComponent logs={logs.data} />
                </Suspense>
              </Box>
            )}

            {/* Alertas - 35% */}
            <Box
              flex={{ base: "1", lg: "7" }}
              minH={{ base: "280px", md: "340px" }}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="xl"
              shadow="lg"
              overflowY="auto"
              _dark={{ bg: "gray.800", borderColor: "gray.700", shadow: "md" }}
            >
              <ListAlertas
                id={+id}
                data={alertas.data}
                ContainerAlertas={ContainerAlertas}
              />
            </Box>
          </Flex>
        </Flex>
      </RegisterProvider>
    </Container>
  );
}
