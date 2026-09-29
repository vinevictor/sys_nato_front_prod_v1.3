import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import ImobiliariasClient from "@/components/imobiliariasClient";
import { GetSessionServer } from "@/lib/auth_confg";
import Loading from "@/app/loading";

export const dynamic = "force-dynamic";

async function ImobiliariasData() {
  const session = await GetSessionServer();

  if (!session) {
    return redirect("/login");
  }
  if (session.user.hierarquia !== "ADM" && !session.user.role?.adm) {
    return redirect("/home");
  }

  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/imobiliaria`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        cache: "no-store",
      }
    );

    if (!req.ok) {
      throw new Error(`Falha ao buscar dados: ${req.statusText}`);
    }

    const data = await req.json();
    return (
      <ImobiliariasClient
        data={Array.isArray(data) ? data : []}
        isAdm={session.user.hierarquia === "ADM"}
      />
    );
  } catch (error) {
    return (
      <Box textAlign="center" p={5}>
        <Text color="red.500" fontWeight="bold">
          Ocorreu um erro ao carregar as imobiliárias. Por favor, tente
          novamente mais tarde.
        </Text>
      </Box>
    );
  }
}

export default async function Imobiliarias() {
  return (
    <Suspense fallback={<Loading />}>
      <ImobiliariasData />
    </Suspense>
  );
}
