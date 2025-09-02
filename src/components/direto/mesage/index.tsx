"use client";

import Loading from "@/app/loading";
import MensagensChat from "@/components/mensagensChat";
import { SessionClient } from "@/types/session";
import { Flex, useToast } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  Id: number;
  messages:  MensagemObj[];
  session: SessionClient;
}

type MensagemObj = {
  id: string;
  mensagem: string;
  data: string;
  hora: string;
  autor: string;
  autor_id: number;
};

export default function MensagensChatDireto({ Id, messages, session }: Props) {
  const [isLoadingMensagem, setIsLoadingMensagem] = useState(false);
  const [dataMensagem, setDataMensagem] = useState<MensagemObj[]>(messages);
  const toast = useToast();

  const handleMsg = async (value: MensagemObj[]) => {
    setIsLoadingMensagem(true);
    const req = await fetch(`/api/solicitacao/update/${Id}`, {
      method: "PUT",
      body: JSON.stringify({
        obs: value,
      }),
    });
    const res = await req.json();
    if (!req.ok) {
      toast({
        title: "Erro",
        description: res.message || "Erro ao enviar mensagem",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setDataMensagem(res.obs);
    setIsLoadingMensagem(false);
  };
  return (
    <>
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
          id={Id}
          data={dataMensagem}
          session={session}
          onSend={handleMsg}
        />
      )}
    </>
  );
}
    