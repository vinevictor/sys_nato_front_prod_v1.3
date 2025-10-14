import { DadoCompomentList } from "@/components/home/lista";
import ModalPrimeAsses from "@/components/prime_asses";
import ModalTermos from "@/components/termos";
import { GetSessionServer } from "@/lib/auth_confg";
import HomeProvider from "@/provider/HomeProvider";
import { solictacao } from "@/types/solicitacao";
import { Box } from "@chakra-ui/react";
import { Metadata } from "next";

// Força a renderização dinâmica desta página, pois ela usa cookies (via GetSessionServer)
export const dynamic = "force-dynamic";

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
  });
  const data = await user.json();
  if (!user.ok) {
    console.error("GetListaDados status:", data.message);
    return null;
  }
  return data;
};

/**
 * Página Home
 * 
 * Funcionalidades:
 * - Exibe lista de solicitações
 * - Modais de primeiro acesso e termos
 * - Adaptado ao layout com sidebar
 * - Responsivo e com tema adaptativo
 * 
 * @component
 */
export default async function HomePage() {
  const session = await GetSessionServer();
  const ListDados = await GetListaDados(session);
  
  return (
    <HomeProvider>
      <Box
        w="full"
        h="full"
        bg="gray.50"
        _dark={{ bg: "gray.900" }}
        p={{ base: 2, md: 3, lg: 4 }}
      >
        {/* Modais */}
        {session && <ModalPrimeAsses session={session.user} />}
        {session && <ModalTermos session={session.user} />}
        
        {/* Conteúdo principal */}
        {session && <DadoCompomentList dados={ListDados} session={session} />}
      </Box>
    </HomeProvider>
  );
}
