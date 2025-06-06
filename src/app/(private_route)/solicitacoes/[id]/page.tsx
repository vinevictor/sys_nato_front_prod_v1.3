"use client";

import Loading from "@/app/loading";
import FormSolicitacaoEdit from "@/components/form/solicitacao/edit";
import MensagensChat from "@/components/mensagensChat";
import ListAlertas from "@/components/solicitacao/alert";
import { useSession } from "@/hook/useSession";
import { Flex } from "@chakra-ui/react";
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
  const user: any = useSession();

  useEffect(() => {
    const getData = async () => {
      try {
        const req = await fetch(`/api/solicitacao/get/${id}`);
        const res = await req.json();
        setData(res);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      }
    };
    getData();
  }, [id]);

  if (!data) {
    return <Loading />;
  }

  const handleMsg = async (value: MensagemObj[]) => {
    const req = await fetch(`/api/solicitacao/chat/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        obs: value,
      }),
    });
    if (req.ok) {
      const res = await req.json();
      setData((data.obs = res.obs));
    }
  };
  return (
    <Flex gap={2} h={"full"} p={2}>
      <Flex w={"60%"} h={"full"}>
        <FormSolicitacaoEdit id={+id} data={data} />
      </Flex>
      <Flex w={"40%"} flexDir={"column"} gap={2} h={"full"}>
        <Flex rounded={"md"} w={"full"} h={"60%"}>
          <MensagensChat
            id={+id}
            data={data.obs}
            session={user}
            onSend={handleMsg}
          />
        </Flex>
        <Flex rounded={"md"} w={"full"} h={"40%"}>
          <ListAlertas id={+id} />
        </Flex>
      </Flex>
    </Flex>
  );
}
