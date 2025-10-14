import SolicitacaoSWITCH from "@/components/solicitacao";
import { GetSessionServer } from "@/lib/auth_confg";
import { Box } from "@chakra-ui/react";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Nova Solicitação",
  description: "Criar nova solicitação de imóvel",
};

/**
 * Página de Solicitações
 * 
 * Funcionalidades:
 * - Consulta de CPF
 * - Criação de nova solicitação
 * - Adaptado ao layout com sidebar
 * - Tema adaptativo e responsivo
 * 
 * @component
 */
export default async function Solicitacao() {
  const session = await GetSessionServer(); 
  
  return (
    <Box
      w="full"
      h="full"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
      p={{ base: 2, md: 3, lg: 4 }}
    >
      <SolicitacaoSWITCH session={session} />
    </Box>
  );
}
