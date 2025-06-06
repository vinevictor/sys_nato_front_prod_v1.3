"use client";
import { BotaoRetorno } from "@/components/botoes/btm_retorno";
import { CardUpdateEmpreendimento } from "@/components/card_EditarEmpreendimento";
import { Box, Divider, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type Props = {
  params: { id: string };
};

export default function EditarEmpreendimento({ params }: Props) {
  const [data, setData] = useState([]);
  const id = Number(params.id);

  const fetchEmpreendimento = async (id: number) => {
    const req = await fetch(`/api/empreendimento/get/${id}`);
    const res = await req.json();
    console.log("🚀 ~ fetchEmpreendimento ~ res:", res);
    setData(res);
  };

  useEffect(() => {
    fetchEmpreendimento(id);
  }, [id]);

  return (
    <>
      <Flex
        w={"100%"}
        minH={"90.9dvh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          w={"70%"}
          bg={"gray.50"}
          borderRadius={"1rem"}
          boxShadow={"lg"}
          p={8}
        >
          <Flex justifyContent={"space-between"}>
            <Box>
              <BotaoRetorno rota="/empreendimentos" />
            </Box>
            <Heading>Criar Empreendimento</Heading>
            <Box> </Box>
          </Flex>
          <Divider my={4} borderColor="gray.300" />
          <CardUpdateEmpreendimento id={id} setEmpreendimentoCard={data} />
        </Box>
      </Flex>
    </>
  );
}
