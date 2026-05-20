"use client";

import {
  Grid,
  VStack,
  Flex,
  Heading,
  Box,
  Text,
  SimpleGrid,
  GridItem,
  Icon,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaRegClock,
  FaSyncAlt,
  FaBuilding,
  FaHandshake,
  FaChartLine,
  FaCheckCircle,
  FaUserAlt,
} from "react-icons/fa";
import ModernStatCard from "@/components/dashboard/ModernStatCard";
import ModernChartContainer from "@/components/dashboard/ModernChartContainer";
import ModernBarChart from "./ModernBarChart";
import ModernDonutChart from "./ModernDonutChart";
import AnalyticsFilters from "./AnalyticsFilters";
import MiniTopList from "./MiniTopList";

interface AnalyticsViewProps {
  overview: any;
  ranking: any;
  startDate: string;
  endDate: string;
  lists: any;
  currentFilters: any;
}

export default function AnalyticsView({
  overview,
  ranking,
  startDate,
  endDate,
  lists,
  currentFilters,
}: AnalyticsViewProps) {
  return (
    <Container maxW="full" py={10} px={{ base: 4, md: 10 }}>
      <VStack spacing={10} align="stretch">
        {/* Header */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "flex-end" }}
          gap={4}
        >
          <Box>
            <Flex align="center" gap={2} mb={2}>
              <Icon as={FaChartLine} color="green.500" />
              <Text
                fontWeight="bold"
                fontSize="xs"
                color="green.500"
                letterSpacing="widest"
              >
                SISTEMA NATO • ANALYTICS
              </Text>
            </Flex>
            <Heading size="xl" fontWeight="900" letterSpacing="tighter">
              Performance Global
            </Heading>
          </Box>

          <Box
            bg="white"
            _dark={{ bg: "gray.800", borderColor: "gray.700" }}
            p={1}
            borderRadius="xl"
            shadow="sm"
            border="1px solid"
            borderColor="gray.100"
          >
            <Text px={4} py={2} fontSize="sm" fontWeight="bold">
              📅 {startDate} até {endDate}
            </Text>
          </Box>
        </Flex>

        {/* Componente de Filtros */}
        <AnalyticsFilters lists={lists} currentFilters={currentFilters} />

        {/* Cards de Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6}>
          <ModernStatCard
            title="TMA: Abertura / Agend."
            value={
              overview.medias_nato?.abertura_para_agendamento || "00h 00min"
            }
            icon={FaRegClock}
          />
          <ModernStatCard
            title="TMA: Agend. / Aprov."
            value={
              overview.medias_nato?.agendamento_para_aprovacao || "00h 00min"
            }
            icon={FaHandshake}
          />
          <ModernStatCard
            title="TMA: Abertura / Aprov."
            value={overview.medias_nato?.abertura_para_aprovacao || "00h 00min"}
            icon={FaCheckCircle}
          />
          <ModernStatCard
            title="Volume de Emissões"
            value={overview.totals?.emitidos || 0}
            icon={FaBuilding}
          />
          <ModernStatCard
            title="Reagendamentos"
            value={overview.totals?.reagendamentos || 0}
            icon={FaSyncAlt}
            isWarning={overview.totals?.reagendamentos > 20}
          />
        </SimpleGrid>

        {/* Grid de Gráficos (Bento Box Avançado) */}
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={6}>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <VStack spacing={6} align="stretch">
              {/* 1. Ranking de Construtoras */}
              <ModernChartContainer title="Produção por Construtora (Top 10)">
                <ModernBarChart
                  lista_tags={ranking?.construtoras?.map((c: any) => ({
                    tag: c.name,
                    total: c.total,
                  }))}
                />
              </ModernChartContainer>

              {/* 2. Ranking de Financeiras */}
              <ModernChartContainer title="Produção por Financeira / CCA (Top 10)">
                <ModernBarChart
                  lista_tags={ranking?.financeiras?.map((f: any) => ({
                    tag: f.name,
                    total: f.total,
                  }))}
                />
              </ModernChartContainer>
            </VStack>
          </GridItem>

          <GridItem colSpan={1}>
            <VStack spacing={6} align="stretch">
              {/* Mix de Validação */}
              <ModernChartContainer title="Mix de Validação">
                <ModernDonutChart
                  labels={[
                    "Vídeo",
                    "Presencial (Interna)",
                    "Presencial Externa",
                  ]}
                  dataValues={[
                    overview.totals?.video || 0,
                    overview.totals?.presencial || 0,
                    overview.totals?.presencial_externa || 0,
                  ]}
                  colors={["#00713C", "#2D3748", "#FB8501"]}
                />
              </ModernChartContainer>

              <MiniTopList
                title="Acessos Recentes (Usuários Comuns)"
                items={
                  ranking?.acessos?.map((a: any) => ({
                    label: a.name,
                    value: `${a.total} acessos`,
                  })) || []
                }
              />
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
}
