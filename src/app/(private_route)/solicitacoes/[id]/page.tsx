import MensagensChatDireto from "@/components/direto/mesage";
import Error404 from "@/components/Error404";
import FormSolicitacaoEdit from "@/components/form/solicitacao/edit";
import LogsComponent from "@/components/logsComponent";
import ListAlertas from "@/components/solicitacao/alert";
import SelectGov from "@/components/solicitacao/select_gov";
import { GetSessionServer } from "@/lib/auth_confg";
import RegisterProvider from "@/provider/RegisterProvider";
import { Flex, Box, Container, Text, Heading, Divider } from "@chakra-ui/react";
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
  const user = session?.user;
  const data = await requestData(+id, session?.token);
  const logs = await requestLogs(+id, session?.token);
  const alertas = await requestAlertas(+id, session?.token);
  if (data.status === 404) {
    return <Error404 />;
  }

  const isAdmin = user?.hierarquia === "ADM";
  const ContainerMesage = isAdmin ? "65vh" : "58%";
  const ContainerAlertas = isAdmin ? "52vh" : "60%";

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
          >
            <Heading size={{ base: "md", md: "lg" }}>Solicitação #{id}</Heading>
            <Flex
              w={{ base: "full", md: "auto" }}
              gap={{ base: 3, md: 8 }}
              direction={{ base: "column", md: "row" }}
              align={{ base: "flex-start", md: "center" }}
              bg="white"
              _dark={{ bg: "gray.800" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" } as any}
              rounded="lg"
              boxShadow="sm"
              p={{ base: 3, md: 4 }}
            >
              {/* Coluna esquerda - datas e id */}
              <Box minW={{ md: "320px" }}>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
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
                {data?.data?.updatedAt && (
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                    Atualizado Em:{" "}
                    {`${data.data.updatedAt
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}, ${
                      data.data.updatedAt.split("T")[1].split(".")[0]
                    }`}
                  </Text>
                )}
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
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
              <Box minW={{ md: "320px" }}>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                  Corretor: {data?.data?.corretor?.nome || "-"}
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                  Andamento: {data?.data?.andamento || "-"}
                </Text>
                {session?.user?.hierarquia === "ADM" &&
                  data?.data?.andamento !== "EMITIDO" && (
                    <SelectGov isState={data?.data?.gov} />
                  )}
              </Box>
            </Flex>
          </Flex>
        </Box>
        <Divider mb={{ base: 4, md: 6 }} />

        {/* Layout principal - Stack vertical em mobile, horizontal em desktop */}
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 4, md: 6 }}
          // minH="calc(100vh - 160px)"
          h="67vh"
          maxW="full"
          align="stretch"
        >
          {/* Seção do formulário */}
          <Box
            flex={{ base: "1", lg: "3" }}
            w={{ base: "full", lg: "auto" }}
            minW={0} // Permite que o flex item encolha
            display="flex"
            flexDir="column"
          >
            {data.data && (
              <FormSolicitacaoEdit id={+id} data={data.data} session={user} />
            )}
            {/* Logs abaixo do formulário (somente ADM) */}
            {user?.hierarquia === "ADM" && (
              <Box mt={{ base: 4, md: 6 }}>
                <Box
                  bg="white"
                  _dark={{ bg: "gray.800" }}
                  borderWidth="1px"
                  borderColor={{ base: "gray.200", _dark: "gray.700" } as any}
                  rounded="lg"
                  boxShadow="sm"
                  p={{ base: 3, md: 5 }}
                >
                  <Suspense fallback={<LogsComponent logs={logs.data} />}>
                    <LogsComponent logs={logs.data} />
                  </Suspense>
                </Box>
              </Box>
            )}
          </Box>

          {/* Seção lateral - Chat e Alertas */}
          <Flex
            flex={{ base: "1", lg: "2" }}
            direction="column"
            gap={{ base: 4, md: 6 }}
            w={{ base: "full", lg: "auto" }}
            minW={0}
            maxW={{ base: "full", lg: "520px" }}
            position={{ base: "static", lg: "sticky" }}
            top={{ lg: 4 }}
            h="full"
          >
            {/* Chat */}
            <Box
              flex="1"
              minH={{ base: "480px", md: "460px", lg: ContainerMesage }}
              maxH={{ base: "auto", lg: "none" }}
              bg="white"
              _dark={{ bg: "gray.800" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" } as any}
              rounded="lg"
              boxShadow="sm"
              p={{ base: 3, md: 4 }}
            >
              <MensagensChatDireto
                Id={+id}
                messages={data.data?.obs ?? []}
                session={user}
              />
            </Box>

            {/* Alertas */}
            <Box
              flex="2"
              minH={{ base: "300px", md: "360px" }}
              maxH={{ base: "auto", lg: "none" }}
              mb={2}
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
