// src/app/(private_route)/geo/page.tsx
import { getEstados } from "@/actions/geo/geoActions";
import GeoClient from "@/components/geo/geo-client";
import { GetSessionServer } from "@/lib/auth_confg";
import HomeProvider from "@/provider/HomeProvider";
import { Box, Container, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { FaMapMarkedAlt } from "react-icons/fa";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Geolocalização",
  description: "Busque unidades próximas",
};

export default async function GeoPage() {
  const session = await GetSessionServer();
  if (!session) {
    return redirect("/home");
  }

  if (session?.user?.hierarquia !== "ADM") {
    return redirect("/home");
  }
  let estados = [];
  try {
    estados = await getEstados();
  } catch (error) {
    console.log("Erro ao buscar estados:", error);
  }

  return (
    <HomeProvider>
      <Container
        maxW={{ base: "100%", sm: "95%", md: "96%", lg: "98%" }}
        py={{ base: 4, md: 5, lg: 6 }}
        px={{ base: 3, sm: 4, md: 5, lg: 6 }}
      >
        <VStack spacing={{ base: 5, md: 6, lg: 8 }} align="stretch" w="full">
          {/* CABEÇALHO */}
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
          >
            <Flex align="center" gap={{ base: 2, md: 3 }}>
              <Box
                p={{ base: 1.5, md: 2 }}
                bg="green.50"
                _dark={{ bg: "whiteAlpha.200" }}
                borderRadius="md"
              >
                {/* Ícone direto no server component funciona */}
                <FaMapMarkedAlt size={32} color="#00713D" />
              </Box>
              <Box>
                <Heading
                  fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                  size={{ base: "md", md: "lg" }}
                  color="#023147"
                  _dark={{ color: "gray.100" }}
                >
                  Geolocalização
                </Heading>
                <Text
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                >
                  Encontre a unidade mais próxima do endereço do cliente
                </Text>
              </Box>
            </Flex>
          </Flex>

          <Box minH="400px">
            <GeoClient estados={estados || []} />
          </Box>
        </VStack>
      </Container>
    </HomeProvider>
  );
}
