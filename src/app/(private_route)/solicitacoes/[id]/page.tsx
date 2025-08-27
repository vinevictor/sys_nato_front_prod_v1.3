"use client";

import Loading from "@/app/loading";
import FormSolicitacaoEdit from "@/components/form/solicitacao/edit";
import LogsComponent from "@/components/logsComponent";
import MensagensChat from "@/components/mensagensChat";
import ListAlertas from "@/components/solicitacao/alert";
import { useSession } from "@/hook/useSession";
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

export default function PageSolicitacoes({ params }: Props) {
  const { id } = params;
  const [data, setData] = useState<any>(null);
  const [dataMensagem, setDataMensagem] = useState<any>(null);
  const [Logs, setLogs] = useState<any>(null);
  const user: any = useSession();
  const [isLoadingMensagem, setIsLoadingMensagem] = useState(false);

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    try {
      const req = await fetch(`/api/solicitacao/get/${id}`);
      const res = await req.json();
      console.log("🚀 ~ getData ~ res:", res)
      const logs = await fetch(`/api/solicitacao/logs/${id}`);
      const logsRes = await logs.json();

      setData(res);
      setLogs(logsRes);
      setDataMensagem(res.obs);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  const handleMsg = async (value: MensagemObj[]) => {
    setIsLoadingMensagem(true);
    const req = await fetch(`/api/solicitacao/chat/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        obs: value,
      }),
    });
    if (req.ok) {
      getData();
    }
    setIsLoadingMensagem(false);
  };

  if (!data) {
    return (
      <Container maxW="full" p={4}>
        <Loading />
      </Container>
    );
  }

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
          <FormSolicitacaoEdit id={+id} data={data} />
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
            {isLoadingMensagem ? (
              <Flex
                w="full"
                h="full"
                bg="gray.100"
                rounded="md"
                justify="center"
                align="center"
                minH="400px"
              >
                <Loading />
              </Flex>
            ) : (
              <MensagensChat
                id={+id}
                data={dataMensagem}
                session={user}
                onSend={handleMsg}
              />
            )}
          </Box>

          {/* Alertas */}
          <Box
            flex="2"
            minH={{ base: "250px", md: "300px", lg: "40%" }}
            maxH={{ base: "400px", lg: "none" }}
          >
            <ListAlertas id={+id} />
          </Box>
        </Flex>
      </Flex>

      {/* Logs - Sempre em uma nova linha */}
      {user?.hierarquia === "ADM" && (
        <Box mt={{ base: 6, md: 8 }} w="full">
          <LogsComponent logs={Logs} />
        </Box>
      )}
    </Container>
  );
}