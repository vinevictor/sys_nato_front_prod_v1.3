import Loading from "@/app/loading";
import { BotaoRetorno } from "@/components/botoes/btm_retorno";
import { CardUpdateFinanceira } from "@/components/card_EditarFinanceira";
import { GetSessionServer } from "@/lib/auth_confg";
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { Suspense } from "react";

type Props = {
  params: { id: string };
};

// Função para buscar os dados pode ficar fora do componente
const fetchFinanceira = async (id: number) => {
  const session = await GetSessionServer();
  // A URL precisa ser absoluta para fetch no servidor
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const req = await fetch(`${baseUrl}/financeiro/${id}`, {
    cache: "no-store", // Garante que os dados sejam sempre os mais recentes
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
  });
  if (!req.ok) {
    // Tratar erro aqui se necessário
    console.error("Falha ao buscar dados da financeira:", req.statusText);
    return null;
  }
  try {
    const res = await req.json();
    return res;
  } catch (error) {
    console.error("Falha ao processar JSON da financeira:", error);
    return null;
  }
};

// A página agora é um Server Component e pode ser async
export default async function EditarUsuario({ params }: Props) {
  const id = Number(params.id);
  const data = await fetchFinanceira(id);

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
              <BotaoRetorno rota="/financeiras" />
            </Box>
            <Box>
              <Heading>Editar Financeira</Heading>
              <Text>id: {id}</Text>
            </Box>
          </Flex>
          <Divider my={4} borderColor="gray.300" />
          <Suspense fallback={<Loading />}>
            <CardUpdateFinanceira id={id} setFinanceiraCard={data} />
          </Suspense>
        </Box>
      </Flex>
    </>
  );
}
