import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import ConstrutoraPage from "@/components/construtorasClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";
import Loading from "@/app/loading";

export const dynamic = "force-dynamic";

async function ConstrutorasData() {
  const session = await GetSessionServer();

  if (!session) {
    redirect("/login");
  }

  try {
    const url =
      session.user?.hierarquia === "ADM"
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtora`
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtora/${session.user?.id}`;

    const req = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      next: {
        revalidate: 60 * 10, // 10 minutos
      },
    });

    if (!req.ok) {
      throw new Error(`Falha ao buscar dados: ${req.statusText}`);
    }

    const data = await req.json();
    return <ConstrutoraPage data={data} />;
  } catch (error) {
    return (
      <Box textAlign="center" p={5}>
        <Text color="red.500" fontWeight="bold">
          Ocorreu um erro ao carregar as construtoras. Por favor, tente novamente mais tarde.
        </Text>
      </Box>
    );
  }
}

export default async function Construtoras() {
  return (
    <Suspense fallback={<Loading />}>
      <ConstrutorasData />
    </Suspense>
  );
}
