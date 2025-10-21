import { GetSessionServer } from "@/lib/auth_confg";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { FaSignature } from "react-icons/fa";
import { DadoCompomentListNatosign } from "./lista";

/**
 * Busca a lista de envelopes cadastrados para o NatoSign diretamente na API.
 */
const GetListaDados = async (
  session: SessionNext.Server | null
): Promise<natosign.NatosignGetType | null> => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/intelesign`;
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
 * Renderiza a página principal do NatoSign aplicando o layout padrão e a lista de envelopes.
 */
export default async function NatosignHome() {
  const session = await GetSessionServer();
  const data = await GetListaDados(session);

  if (session?.user?.hierarquia !== "ADM") {
    redirect("/home");
  }

  return (
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
              <FaSignature size={32} color="#00713D" />
            </Box>
            <Box>
              <Heading
                fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                size={{ base: "md", md: "lg" }}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                NatoSign
              </Heading>
              <Text
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                color="gray.600"
                _dark={{ color: "gray.400" }}
                display={{ base: "none", sm: "block" }}
              >
                Gerencie envelopes, acompanhe status e acione novas assinaturas digitais.
              </Text>
            </Box>
          </Flex>

          {/* Ações (botões) */}
          {(session?.user?.hierarquia === "ADM" ||
            session?.user?.role?.natosign) && (
            <Flex gap={2} wrap="wrap">
              <Button
                as={NextLink}
                href="/natosign/create"
                colorScheme="green"
                bg="#00713D"
                size={{ base: "md", md: "lg" }}
                transition="all 0.2s"
                w={{ base: "full", md: "auto" }}
                _hover={{
                  bg: "#005a31",
                  transform: "translateY(-2px)",
                  shadow: "lg",
                }}
                _active={{ transform: "translateY(0)" }}
                _dark={{
                  bg: "#00d672",
                  color: "gray.900",
                  _hover: { bg: "#00c060" },
                }}
              >
                Criar Envelope
              </Button>
            </Flex>
          )}
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
          {session && (
            <DadoCompomentListNatosign session={session} dados={data} />
          )}
        </VStack>
      </VStack>
    </Container>
  );
}
