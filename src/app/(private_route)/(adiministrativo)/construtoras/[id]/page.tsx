"use client";
import { BotaoRetorno } from "@/components/botoes/btm_retorno";
import { CardUpdateConstrutora } from "@/components/card_UpdateConstrutora";
import { useSession } from "@/hook/useSession";
import { Box, Divider, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type Props = {
  params: { id: string };
};

export default function ConstrutoraById({ params }: Props) {
  const id = Number(params.id);
  const [data, setData] = useState({});
  const session = useSession();

  useEffect(() => {
    if (session && session.hierarquia !== "ADM") {
      window.location.href = "/";
    }
    fetchConstrutora(id);
  }, [id]);

  const fetchConstrutora = async (id: number) => {
    const req = await fetch(`/api/construtora/get/${id}`);
    const res = await req.json();
    setData(res.data);
  };
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
              <BotaoRetorno rota="/construtoras" />
            </Box>
            <Heading>Construtora</Heading>
          </Flex>
          <Divider my={4} borderColor="gray.300" />
          <CardUpdateConstrutora id={id} setConstrutoraCard={data} />
        </Box>
      </Flex>
    </>
  );
}
