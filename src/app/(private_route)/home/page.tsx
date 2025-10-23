import { DadoCompomentList } from "@/components/home/lista";
import ModalPrimeAsses from "@/components/prime_asses";
import ModalTermos from "@/components/termos";
import { GetSessionServer } from "@/lib/auth_confg";
import HomeProvider from "@/provider/HomeProvider";
import { solictacao } from "@/types/solicitacao";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import { MdHome } from "react-icons/md";

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
 * - Layout padronizado com header e área de conteúdo
 * - Responsivo e com tema adaptativo
 *
 * @component
 */
export default async function HomePage() {
  const session = await GetSessionServer();
  const ListDados = await GetListaDados(session);

  return (
    <HomeProvider>
      {/* Modais */}
      {session && <ModalPrimeAsses session={session.user} />}
      {session && <ModalTermos session={session.user} />}

      <Container
        maxW={{ base: "100%", sm: "95%", md: "96%", lg: "98%" }}
        py={{ base: 4, md: 5, lg: 6 }}
        px={{ base: 3, sm: 4, md: 5, lg: 6 }}
      >
        <VStack spacing={{ base: 5, md: 6, lg: 8 }} align="stretch" w="full">
          {/* Cabeçalho */}
          <Flex
            bg="white"
            _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
            borderBottomWidth="2px"
            borderBottomColor="#00713D"
            p={{ base: 4, sm: 5, md: 6 }}
            align="center"
            justify="space-between"
            wrap="wrap"
            gap={{ base: 3, md: 4 }}
            borderRadius={{ base: "md", md: "lg", xl: "xl" }}
            borderBottomRadius={0}
            shadow={{ base: "sm", md: "md", lg: "lg" }}
            flexDir={{ base: "column", md: "row" }}
          >
            {/* Título com ícone */}
            <Flex align="center" gap={{ base: 2, md: 3 }}>
              <Box
                p={{ base: 1.5, md: 2 }}
                bg="green.50"
                _dark={{ bg: "green.900" }}
                borderRadius="md"
                display={{ base: "none", sm: "block" }}
              >
                <MdHome size={32} color="#00713D" />
              </Box>
              <Box>
                <Heading
                  fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                  size={{ base: "md", md: "lg" }}
                  color="#023147"
                  _dark={{ color: "gray.100" }}
                >
                  Solicitações
                </Heading>
                <Text
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  display={{ base: "none", sm: "block" }}
                >
                  Gerencie todas as solicitações, filtre por status e visualize detalhes.
                </Text>
              </Box>
            </Flex>
          </Flex>

          {/* Área de Conteúdo */}
          <VStack
            spacing={{ base: 5, md: 6 }}
            align="stretch"
            bg="white"
            _dark={{ bg: "gray.800" }}
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            borderTopRadius={0}
            shadow="lg"
            minH="400px"
          >
            {session && <DadoCompomentList dados={ListDados} session={session} />}
          </VStack>
        </VStack>
      </Container>
    </HomeProvider>
  );
}
