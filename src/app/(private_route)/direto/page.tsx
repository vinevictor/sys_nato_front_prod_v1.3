import { DadoCompomentList } from "@/components/direto/lista";
import { CompartilharModal } from "@/components/direto/lista/CompartilharModal";
import ModalPrimeAsses from "@/components/prime_asses";
import ModalTermos from "@/components/termos";
import { GetSessionServer } from "@/lib/auth_confg";
import HomeProvider from "@/provider/HomeProvider";
import { Session } from "@/types/session";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import { MdDescription } from "react-icons/md";
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
 * - Layout padronizado com header e área de conteúdo
 * - Responsivo e com tema adaptativo
 *
 * @component
 */
export default async function DiretoPage() {
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
                <MdDescription size={32} color="#00713D" />
              </Box>
              <Box>
                <Heading
                  fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                  size={{ base: "md", md: "lg" }}
                  color="#023147"
                  _dark={{ color: "gray.100" }}
                >
                  Vendas Diretas
                </Heading>
                <Text
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  display={{ base: "none", sm: "block" }}
                >
                  Gerencie suas vendas diretas, acompanhe status e visualize histórico de solicitações.
                </Text>
              </Box>
            </Flex>
            <CompartilharModal session={session} />
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
