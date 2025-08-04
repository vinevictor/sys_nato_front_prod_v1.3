import Loading from "@/app/loading";
import { DadoCompomentList } from "@/components/direto/lista";
import { UserCompomentInfo } from "@/components/direto/user";
import ModalPrimeAsses from "@/components/prime_asses";
import ModalTermos from "@/components/termos";
import { GetSessionServer } from "@/lib/auth_confg";
import HomeProvider from "@/provider/HomeProvider";
import { Flex } from "@chakra-ui/react";
import { Metadata } from "next";
import { Suspense } from "react";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "HOME DIRETO",
  description: "sistema de gestão de vendas de imóveis",
};

const GetListaDados = async (
  session: SessionNext.Server | null
): Promise<solictacao.SolicitacaoGetType | solictacao.SolicitacaoObjectType[] | null> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto`;
    const user = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      cache: "no-store",
    });
    
    if (!user.ok) {
      console.error("GetListaDados status:", user.status);
      return null;
    }
    const data = await user.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
};

async function DadosContent({ session }: { session: SessionNext.Server | null }) {
  const ListDados = await GetListaDados(session);
  
  // Seu delay de 4 segundos
  await new Promise((resolve) => setTimeout(resolve, 4000));
  
  return (
    <>
      {session && <UserCompomentInfo session={session} />}
      {session && <DadoCompomentList dados={ListDados} session={session} />}
    </>
  );
}

export default async function DiretoPage() {
  const session = await GetSessionServer();
  
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
          <ModalPrimeAsses session={session as any} />
          <ModalTermos session={session as any} />
        <Suspense fallback={<Loading /> }>
            <DadosContent session={session} />
        </Suspense>
        </Flex>
      </HomeProvider>
    </>
  );
}

