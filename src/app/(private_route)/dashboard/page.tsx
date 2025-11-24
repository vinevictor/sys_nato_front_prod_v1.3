export const dynamic = "force-dynamic";

import Loading from "@/app/loading";
import BarChart from "@/components/barChart";
import CardInfoDashboard from "@/components/cardInfoDashboard";
import CidadesProximasTable from "@/components/dashboard/cidades-proximas";
import LineChart from "@/components/lineChart.tsx";
import PieChart from "@/components/pieChart";
import { GetSessionServer } from "@/lib/auth_confg";
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Suspense } from "react";
import { FaRegClock } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";

// Definir tipos
interface SessionServer {
  token: string;
  // adicione outras propriedades conforme necessário
}

interface DashboardData {
  total: number;
  videoConferencia: number;
  interna: number;
  mediaHoras: string;
  mes: number;
  ano: number;
  solicitacoes: object;
}

interface ApiResponse {
  contagem: DashboardData[];
  tags: {
    lista_tags: any[];
    total_tags: number;
  };
}

export default async function DashboardPage() {
  const session = await GetSessionServer();

  return (
    <Suspense fallback={<Loading />}>
      <DashboardContent session={session} />
    </Suspense>
  );
}

async function DashboardContent({
  session,
}: {
  session: SessionServer | null;
}) {
  // Função para buscar dados da API com tratamento de erro
  const fetchData = async (): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          cache: "force-cache",
          next: {
            revalidate: 60 * 60 * 2, // 2 horas
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      // Retornar dados padrão ou relançar o erro
      throw error;
    }
  };

  // Função unificada para converter tempo em segundos
  const timeToSeconds = (time: string): number => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Função para converter segundos em formato HH:mm:ss
  const secondsToTime = (seconds: number): string => {
    if (isNaN(seconds)) {
      return "00:00:00";
    }
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  };

  try {
    const req = await fetchData();
    console.log("🚀 ~ DashboardContent ~ req:", req.contagem[1].solicitacoes);
    const data = req.contagem;
    const tags = req.tags;

    // Dados tags
    const lista_tags = tags.lista_tags;
    const quantidadeTags = tags.total_tags;

    // Quantidade Total Solicitações
    const totalSolicitacoes = data.map((item) => item.total);
    const totalSolicitacoesGlobal = totalSolicitacoes.reduce(
      (acc, item) => acc + item,
      0
    );

    // Extrair dados para cálculos
    const arrayVideoConferencia = data.map((item) => item.videoConferencia);
    const arrayInterna = data.map((item) => item.interna);

    const totalVideoConferencia = arrayVideoConferencia.reduce(
      (acc, item) => acc + item,
      0
    );
    const totalInterna = arrayInterna.reduce((acc, item) => acc + item, 0);

    // Removi a lógica de manipulação artificial dos dados
    // Se precisar de lógica de negócio específica, documente o motivo

    // Dados de mês/ano para os labels
    const mesAnoLabels = data.map((item) => `${item.mes}/${item.ano}`);

    // Dados para o LineChart - convertendo para segundos
    const MediaHorasConvertida = data.map((item) =>
      timeToSeconds(item.mediaHoras)
    );

    // Cálculo da média global
    const mediasSegundos = data.map((item) => timeToSeconds(item.mediaHoras));
    const mediaGlobalSeg = Math.round(
      mediasSegundos.reduce((a, b) => a + b, 0) / mediasSegundos.length
    );
    const mediaGlobalHHMMSS = secondsToTime(mediaGlobalSeg);

    // Delay para manter consistência com outras páginas
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return (
      <Container
        maxW={{ base: "100%", sm: "95%", md: "96%", lg: "98%" }}
        py={{ base: 4, md: 5, lg: 6 }}
        px={{ base: 3, sm: 4, md: 5, lg: 6 }}
      >
        <VStack spacing={{ base: 5, md: 6, lg: 8 }} align="stretch" w="full">
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
            <Flex align="center" gap={{ base: 2, md: 3 }}>
              <Box
                p={{ base: 1.5, md: 2 }}
                bg="green.50"
                _dark={{ bg: "green.900" }}
                borderRadius="md"
                display={{ base: "none", sm: "block" }}
              >
                <LuLayoutDashboard size={32} color="#00713D" />
              </Box>
              <Box>
                <Heading
                  fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                  size={{ base: "md", md: "lg" }}
                  color="#023147"
                  _dark={{ color: "gray.100" }}
                >
                  Painel de Monitoramento
                </Heading>
                <Text
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  display={{ base: "none", sm: "block" }}
                >
                  Acompanhe as principais métricas de certificações e
                  solicitações.
                </Text>
              </Box>
            </Flex>
          </Flex>

          <VStack
            spacing={{ base: 5, md: 6, lg: 8 }}
            align="stretch"
            bg="white"
            _dark={{ bg: "gray.800" }}
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            borderTopRadius={0}
            shadow="lg"
            minH="400px"
          >
            <Grid
              templateColumns={{ base: "1fr", xl: "2fr 1fr" }}
              gap={{ base: 5, md: 6, lg: 8 }}
              w="full"
            >
              <GridItem>
                <VStack spacing={{ base: 5, md: 6 }} align="stretch">
                  <Box
                    h={{ base: "340px", md: "380px" }}
                    w="full"
                    bg="gray.50"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={1}
                    _dark={{ bg: "gray.900", borderColor: "gray.700" }}
                  >
                    <Box w="full" h="100%">
                      <LineChart
                        labels={mesAnoLabels}
                        dataValues={MediaHorasConvertida}
                      />
                    </Box>
                  </Box>

                  <Box
                    h={{ base: "380px", md: "420px" }}
                    w="full"
                    bg="gray.50"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={1}
                    _dark={{ bg: "gray.900", borderColor: "gray.700" }}
                  >
                    <Box w="full" h="100%">
                      <BarChart lista_tags={lista_tags} />
                    </Box>
                  </Box>
                </VStack>
              </GridItem>

              <GridItem>
                <VStack spacing={{ base: 5, md: 6 }} align="stretch">
                  <CardInfoDashboard
                    title="TMA"
                    value={mediaGlobalHHMMSS}
                    icon={<FaRegClock size={22} />}
                  />

                  <Box
                    h={{ base: "340px", md: "380px" }}
                    w="full"
                    bg="gray.50"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _dark={{ bg: "gray.900", borderColor: "gray.700" }}
                  >
                    <Box w="full" maxW="400px">
                      <PieChart
                        title="Video Conferência e Presencial"
                        colors={["#00713C", "#1D1D1B"]}
                        labels={["Video Conf.", "Presencial"]}
                        dataValues={[totalVideoConferencia, totalInterna]}
                      />
                    </Box>
                  </Box>
                </VStack>
              </GridItem>

              <GridItem colSpan={{ base: 1, xl: 2 }}>
                <CidadesProximasTable />
              </GridItem>
            </Grid>
          </VStack>
        </VStack>
      </Container>
    );
  } catch (error) {
    // Componente de erro ou fallback
    return (
      <Flex justify="center" align="center" h="50vh">
        <Box textAlign="center">
          <h2>Erro ao carregar dashboard</h2>
          <p>Tente novamente mais tarde</p>
        </Box>
      </Flex>
    );
  }
}
