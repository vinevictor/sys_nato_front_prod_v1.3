"use client";
import { BotaoRetorno } from "@/components/botoes/btm_retorno";
import { CardUpdateFinanceira } from "@/components/card_EditarFinanceira";
import { Box, Divider, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type Props = {
  params: { id: string };
};

export default function EditarUsuario({ params }: Props) {
  const id = Number(params.id);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    fetchFinanceira(id);
  }, [id]);

  const fetchFinanceira = async (id: number) => {
    const req = await fetch(`/api/financeira/get/${id}`);
    const res = await req.json();
    setData(res);
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
              <BotaoRetorno rota="/usuarios" />
            </Box>
            <Heading>Editar Financeira</Heading>
            <Box> </Box>
          </Flex>
          <Divider my={4} borderColor="gray.300" />
          <CardUpdateFinanceira id={id} setFinanceiraCard={data} />
        </Box>
      </Flex>
    </>
  );
}
