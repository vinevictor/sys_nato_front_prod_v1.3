import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Box, Text, Flex, Spinner } from "@chakra-ui/react";
import ArParceiraClientPage from "@/components/arParceiraClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";
import Loading from "@/app/loading";

export const dynamic = "force-dynamic";

async function ArParceirasData() {
  const session = await GetSessionServer();

  if (!session) {
    return redirect("/login");
  }

  try {
    // Ajuste a rota '/ar-parceira' conforme seu Controller no NestJS
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/ar-parceira`;

    const req = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      cache: "no-store",
      next: {
        revalidate: 60, // 1 minuto
        tags: ["ar-parceira-list"],
      },
    });

    if (!req.ok) {
      throw new Error(`Falha ao buscar dados: ${req.statusText}`);
    }

    const data = await req.json();
    return <ArParceiraClientPage data={data} session={session.user} />;
  } catch (error) {
    console.error(error);
    return (
      <Box textAlign="center" p={10}>
        <Text color="red.500" fontWeight="bold" fontSize="lg">
          Ocorreu um erro ao carregar as AR Parceiras.
        </Text>
        <Text color="gray.500">
          Verifique sua conexão ou contate o suporte.
        </Text>
      </Box>
    );
  }
}

export default async function ArParceiras() {
  return (
    <Suspense
      fallback={
        <Flex w="full" h="80vh" align="center" justify="center">
          <Spinner size="xl" color="green.500" />
        </Flex>
      }
    >
      <ArParceirasData />
    </Suspense>
  );
}
