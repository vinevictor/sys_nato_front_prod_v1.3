import Loading from "@/app/loading";
import MensagensChatDireto from "@/components/direto/mesage";
import FormSolicitacaoEdit from "@/components/form/solicitacao/edit";
import LogsComponent from "@/components/logsComponent";
import MensagensChat from "@/components/mensagensChat";
import ListAlertas from "@/components/solicitacao/alert";
import { useSession } from "@/hook/useSession";
import { GetSessionServer } from "@/lib/auth_confg";
import { Flex, Box, Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

type MensagemObj = {
  id: string;
  mensagem: string;
  data: string;
  hora: string;
  autor: string;
  autor_id: number;
};

const requestData = async (id: number, token: string) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/${id}`;
  const request = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!request.ok)
    return { error: true, message: "Solicitação não encontrada", data: null };
  const data = await request.json();
  return { error: false, message: "Solicitação encontrada", data };
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


  return (
    <Container maxW="full" p={{ base: 2, md: 4 }}>
      {/* Layout principal - Stack vertical em mobile, horizontal em desktop */}
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={{ base: 4, md: 6 }}
        minH="calc(100vh - 120px)"
        maxW="full"
      >
        {/* Seção do formulário */}
        <Box
          flex={{ base: "1", lg: "3" }}
          w={{ base: "full", lg: "auto" }}
          minW={0} // Permite que o flex item encolha
        >
          {data.data && <FormSolicitacaoEdit id={+id} data={data.data} />}
          
        </Box>

        {/* Seção lateral - Chat e Alertas */}
        <Flex
          flex={{ base: "1", lg: "2" }}
          direction="column"
          gap={{ base: 4, md: 6 }}
          w={{ base: "full", lg: "auto" }}
          minW={0}
          maxW={{ base: "full", lg: "500px" }}
        >
          {/* Chat */}
          <Box
            flex="3"
            minH={{ base: "400px", md: "500px", lg: "60%" }}
            maxH={{ base: "600px", lg: "none" }}
          >
             <MensagensChatDireto Id={+id} messages={data.data.obs} session={user} />
          </Box>

          {/* Alertas */}
          <Box
            flex="2"
            minH={{ base: "250px", md: "300px", lg: "40%" }}
            maxH={{ base: "400px", lg: "none" }}
          >
            <ListAlertas id={+id} data={alertas.data}/>
          </Box>
        </Flex>
      </Flex>

      {/* Logs - Sempre em uma nova linha */}
      {user?.hierarquia === "ADM" && (
        <Box mt={{ base: 6, md: 8 }} w="full">
          <LogsComponent logs={logs.data} />
        </Box>
      )}
    </Container>
  );
}
