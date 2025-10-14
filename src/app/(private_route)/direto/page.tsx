import { DadoCompomentList } from "@/components/direto/lista";
import ModalPrimeAsses from "@/components/prime_asses";
import ModalTermos from "@/components/termos";
import { GetSessionServer } from "@/lib/auth_confg";
import HomeProvider from "@/provider/HomeProvider";
import { Session } from "@/types/session";
import { Box } from "@chakra-ui/react";
import { Metadata } from "next";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DIRETO",
  description: "sistema de gestão de vendas de imóveis",
};

const GetListaDados = async (
  session: Session.SessionServer | null
): Promise<any | null> => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto`;
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
 * Página Direto
 * 
 * Funcionalidades:
 * - Exibe lista de vendas diretas
 * - Modais de primeiro acesso e termos
 * - Adaptado ao layout com sidebar
 * - Responsivo e com tema adaptativo
 * 
 * @component
 */
export default async function DiretoPage() {
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
