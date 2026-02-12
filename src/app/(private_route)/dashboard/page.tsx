// app/dashboard/page.tsx
export const dynamic = "force-dynamic";

import { GetSessionServer } from "@/lib/auth_confg";
import {
  Grid,
  Container,
  VStack,
  Flex,
  Heading,
  Box,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import CardInfoDashboard from "@/components/cardInfoDashboard";
import nextDynamic from "next/dynamic";
import { FaRegClock, FaVideo, FaUserFriends } from "react-icons/fa";
import DashboardClientWrapper from "@/components/dashboard/DashboardClientWrapper";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChartContainer from "@/components/dashboard/ChartContainer";
import AvailableLocationsTable from "@/components/dashboard/AvailableLocationsTable";

// Carregamento dinâmico dos gráficos
const LineChart = nextDynamic(() => import("@/components/lineChart"), {
  ssr: false,
  loading: () => (
    <Box
      h="350px"
      bg="gray.100"
      _dark={{ bg: "gray.700" }}
      borderRadius="xl"
      opacity={0.5}
    />
  ),
});

const PieChart = nextDynamic(() => import("@/components/pieChart"), {
  ssr: false,
  loading: () => (
    <Box
      h="350px"
      bg="gray.100"
      _dark={{ bg: "gray.700" }}
      borderRadius="xl"
      opacity={0.5}
    />
  ),
});

const BarChart = nextDynamic(() => import("@/components/barChart"), {
  ssr: false,
  loading: () => (
    <Box
      h="350px"
      bg="gray.100"
      _dark={{ bg: "gray.700" }}
      borderRadius="xl"
      opacity={0.5}
    />
  ),
});

export default async function DashboardPage() {
  const session = await GetSessionServer();

  if (!session) return <Text>Não autorizado</Text>;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/dashboard`,
      {
        headers: { Authorization: `Bearer ${session?.token}` },
        cache: "no-store",
      }
    );

    if (!response.ok) throw new Error(`Erro API: ${response.status}`);
    const data = await response.json();

    return (
      <DashboardClientWrapper>
        <Container maxW="full" py={8} px={8} bg="transparent" minH="100vh">
          {/* Aumentamos o spacing para 8 (32px) para dar mais respiro entre as seções */}
          <VStack spacing={8} align="stretch">
            {/* Header Principal */}
            <DashboardHeader />

            {/* Seção de Cards: Spacing 6 (24px) */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <CardInfoDashboard
                title="Total Solicitações"
                value={data.summary?.totalGeral || 0}
                icon={<FaUserFriends size={22} />}
              />
              <CardInfoDashboard
                title="Vídeo Conferência"
                value={data.summary?.totalVideo || 0}
                icon={<FaVideo size={22} />}
              />
              <CardInfoDashboard
                title="TMA (Média)"
                value={
                  data.contagem?.[data.contagem.length - 1]?.mediaHoras || "0h"
                }
                icon={<FaRegClock size={22} />}
              />
            </SimpleGrid>

            {/* Seção de Gráficos de Evolução e Mix */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
              <ChartContainer title="Evolução de Atendimentos">
                <LineChart
                  labels={data.contagem?.map((c: any) => c.label) || []}
                  dataValues={
                    data.contagem?.map(
                      (c: any) => c.totalMs / (c.total || 1) / 1000
                    ) || []
                  }
                />
              </ChartContainer>

              <ChartContainer title="Mix de Validação">
                <PieChart
                  labels={["Vídeo", "Presencial"]}
                  dataValues={[
                    data.summary?.totalVideo || 0,
                    data.summary?.totalPresencial || 0,
                  ]}
                  colors={["#00713C", "#1D1D1B"]}
                />
              </ChartContainer>
            </Grid>

            {/* Ranking de Suporte */}
            <Grid templateColumns="1fr" gap={8}>
              <ChartContainer title="Ranking de Suporte (Top 5)">
                <BarChart lista_tags={data.tags?.lista_tags || []} />
              </ChartContainer>
            </Grid>

            {/* Tabela de Localizações: Agora integrada ao fluxo do VStack com margem extra no topo */}
            <Box pt={4}>
              <AvailableLocationsTable token={session.token} />
            </Box>
          </VStack>
        </Container>
      </DashboardClientWrapper>
    );
  } catch (error) {
    return (
      <Flex
        h="80vh"
        align="center"
        justify="center"
        direction="column"
        bg="gray.50"
        _dark={{ bg: "gray.900", color: "white" }}
      >
        <Heading size="lg" color="red.400" mb={2}>
          Erro ao carregar Dashboard
        </Heading>
        <Text>Verifique se o backend está rodando corretamente.</Text>
      </Flex>
    );
  }
}
