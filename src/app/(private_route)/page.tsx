import { DadoCompomentList } from "@/components/home/lista";
import { UserCompomentInfo } from "@/components/home/user";
import ModalPrimeAsses from "@/components/prime_asses";
import ModalTermos from "@/components/termos";
import { GetSessionServer } from "@/lib/auth_confg";
import HomeProvider from "@/provider/HomeProvider";
import { Flex } from "@chakra-ui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HOME",
  description: "sistema de gestão de vendas de imóveis",
};

const GetListaDados = async (
  session: SessionNext.Server | null
): Promise<solictacao.SolicitacaoGetType | null> => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao`;
  const user = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
    cache: "no-store",
  });
  const data = await user.json();
  if (!user.ok) {
    console.error("GetListaDados status:", data.message);
    return null;
  }
  return data;
};

export default async function HomePage() {
  const session = await GetSessionServer();
  const ListDados = await GetListaDados(session);

  return (
    <>
      <HomeProvider>
        <Flex
          minH="89.8vh"
          w="100%"
          bg="#F8F8F8"
          overflowY="auto"
          overflowX="hidden"
        >
          {session && <ModalPrimeAsses session={session.user} />}
          {session && <ModalTermos session={session.user} />}

          {session && <UserCompomentInfo session={session.user} />}
          <DadoCompomentList dados={ListDados} session={session} />
        </Flex>
      </HomeProvider>
    </>
  );
}
