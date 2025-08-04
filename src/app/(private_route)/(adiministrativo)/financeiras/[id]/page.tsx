import { BotaoRetorno } from "@/components/botoes/btm_retorno";
import { CardUpdateFinanceira } from "@/components/card_EditarFinanceira";
import { GetSessionServer } from "@/lib/auth_confg";
import { Box, Divider, Flex, Heading } from "@chakra-ui/react";

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
    console.log("🚀 ~ fetchFinanceira ~ res:", res);
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
            <Heading>Editar Financeira</Heading>
            <Box> </Box>
          </Flex>
          <Divider my={4} borderColor="gray.300" />
          {/* Passamos os dados buscados diretamente como prop */}
          {data ? (
            <CardUpdateFinanceira id={id} setFinanceiraCard={data} />
          ) : (
            <Heading as="h3" size="md" textAlign="center">
              Financeira não encontrada ou falha ao carregar.
            </Heading> // Fallback caso os dados não sejam carregados
          )}
        </Box>
      </Flex>
    </>
  );
}