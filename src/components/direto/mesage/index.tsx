"use client";

import Loading from "@/app/loading";
import MensagensChat from "@/components/mensagensChat";
import { Session } from "@/types/session";
import { Flex, useToast, VStack, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState, useCallback, memo, useEffect } from "react";

interface Props {
  Id: number;
  messages: MensagemObj[];
  session: Session.AuthUser;
  disabled?: boolean;
}

type MensagemObj = {
  id: string;
  mensagem: string;
  data: string;
  hora: string;
  autor: string;
  autor_id: number;
};

function MensagensChatDireto({ Id, messages, session, disabled }: Props) {
  const [isLoadingMensagem, setIsLoadingMensagem] = useState(false);
  const [dataMensagem, setDataMensagem] = useState<MensagemObj[]>(messages);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setDataMensagem(messages);
  }, [messages]);

  const handleMsg = useCallback(
    async (value: MensagemObj[]) => {
      setIsLoadingMensagem(true);
      const req = await fetch(`/api/solicitacao/chat/${Id}`, {
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
      } else {
        setDataMensagem(res.obs);
        router.refresh();
      }
      setIsLoadingMensagem(false);
    },
    [Id, toast, router]
  );

  return (
    <VStack spacing={0} align="stretch" h="full" flex={1} minH={0}>
      {/* Cabeçalho do Chat */}
      <Flex
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderBottomWidth="2px"
        borderBottomColor="#00713D"
        p={{ base: 3, md: 4 }}
        align="center"
      >
        <Heading
          size={{ base: "sm", md: "md" }}
          color="#023147"
          _dark={{ color: "gray.100" }}
        >
          Mensagens
        </Heading>
      </Flex>

      {/* Conteúdo do Chat */}
      <Flex
        flex={1}
        minH={0}
        bg="white"
        _dark={{ bg: "gray.800" }}
        overflowY="auto"
      >
        {isLoadingMensagem ? (
          <Flex
            w="full"
            h="full"
            bg="gray.100"
            _dark={{ bg: "gray.900" }}
            rounded="md"
            justify="center"
            align="center"
          >
            <Loading />
          </Flex>
        ) : (
          <Flex w="full"  minH={0} direction="column">
            <MensagensChat
              id={Id}
              data={dataMensagem}
              session={session}
              onSend={handleMsg}
              disabled={disabled}
            />
          </Flex>
        )}
      </Flex>
    </VStack>
  );
}

export default memo(MensagensChatDireto);
