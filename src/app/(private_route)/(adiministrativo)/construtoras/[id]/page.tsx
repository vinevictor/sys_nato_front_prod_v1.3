import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { BotaoRetorno } from "@/components/botoes/btm_retorno";
import { CardUpdateConstrutora } from "@/components/card_UpdateConstrutora";
import { GetSessionServer } from "@/lib/auth_confg";
import Loading from "@/app/loading";

type Props = {
  params: { id: string };
};

async function fetchConstrutora(id: number, token: string) {
  const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtora/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!req.ok) {
    throw new Error("Falha ao buscar dados da construtora.");
  }
  const res = await req.json();
  return res;
}

async function ConstrutoraData({ id }: { id: number }) {
  const session = await GetSessionServer();
  if (!session || session.user.hierarquia !== "ADM") {
    redirect("/");
  }

  try {
    const data = await fetchConstrutora(id, session.token);
    return <CardUpdateConstrutora id={id} setConstrutoraCard={data} />;
  } catch (error) {
    return (
      <Box textAlign="center" p={5}>
        <Text color="red.500" fontWeight="bold">
          Ocorreu um erro ao carregar os dados da construtora.
        </Text>
      </Box>
    );
  }
}

export default async function ConstrutoraById({ params }: Props) {
  const id = Number(params.id);

  return (
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
          <BotaoRetorno rota="/construtoras" />
          <Heading>Construtora</Heading>
          <Box />
        </Flex>
        <Divider my={4} borderColor="gray.300" />
        <Suspense fallback={<Loading />}>
          <ConstrutoraData id={id} />
        </Suspense>
      </Box>
    </Flex>
  );
}
