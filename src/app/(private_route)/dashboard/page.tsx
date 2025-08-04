import Loading from "@/app/loading";
import BarChart from "@/components/barChart";
import CardInfoDashboard from "@/components/cardInfoDashboard";
import LineChart from "@/components/lineChart.tsx";
import PieChart from "@/components/pieChart";
import { GetSessionServer } from "@/lib/auth_confg";
import { Box, Flex, Grid, SimpleGrid } from "@chakra-ui/react";
import { Suspense } from "react";
import { FaRegClock } from "react-icons/fa6";
import { LuClipboardCheck, LuTag } from "react-icons/lu";

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
}

interface ApiResponse {
  contagem: DashboardData[];
  tags: {
    lista_tags: any[];
    total_tags: number;
  };
}

export const dynamic = 'force-dynamic';

export default async function DashBoard() {
  const session = await GetSessionServer();

  return (
    <Suspense fallback={<Loading />}>
      <DashboardContent session={session} />
    </Suspense>
  );
}

async function DashboardContent({
  session
}: {
  session: SessionServer | null
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
      console.error('Erro ao buscar dados do dashboard:', error);
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
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  };

  try {
    const req = await fetchData();
    const data = req.contagem;
    const tags = req.tags;

    // Dados tags
    const lista_tags = tags.lista_tags;
    const quantidadeTags = tags.total_tags;

    // Quantidade Total Solicitações
    const totalSolicitacoes = data.map(item => item.total);
    const totalSolicitacoesGlobal = totalSolicitacoes.reduce(
      (acc, item) => acc + item,
      0
    );

    // Extrair dados para cálculos
    const arrayVideoConferencia = data.map(item => item.videoConferencia);
    const arrayInterna = data.map(item => item.interna);
    
    const totalVideoConferencia = arrayVideoConferencia.reduce(
      (acc, item) => acc + item,
      0
    );
    const totalInterna = arrayInterna.reduce(
      (acc, item) => acc + item,
      0
    );

    // Removi a lógica de manipulação artificial dos dados
    // Se precisar de lógica de negócio específica, documente o motivo

    // Dados de mês/ano para os labels
    const mesAnoLabels = data.map(item => `${item.mes}/${item.ano}`);

    // Dados para o LineChart - convertendo para segundos
    const MediaHorasConvertida = data.map(item => 
      timeToSeconds(item.mediaHoras)
    );

    // Cálculo da média global
    const mediasSegundos = data.map(item => timeToSeconds(item.mediaHoras));
    const mediaGlobalSeg = Math.round(
      mediasSegundos.reduce((a, b) => a + b, 0) / mediasSegundos.length
    );
    const mediaGlobalHHMMSS = secondsToTime(mediaGlobalSeg);

    // Delay para manter consistência com outras páginas
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return (
      <Flex 
        w="full" 
        h="full" 
        flexDir="column" 
        p={{ base: 4, md: 6 }} 
        gap={6} 
        overflowX="hidden" 
        overflowY="auto"
      >
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3 }}
          spacing={4}
          w="100%"
        >
          <CardInfoDashboard
            title="Total Solicitações"
            value={totalSolicitacoesGlobal}
            icon={<LuClipboardCheck />}
          />
          <CardInfoDashboard
            title="Média de Horas p/ Certificação"
            value={mediaGlobalHHMMSS}
            icon={<FaRegClock />}
          />
          <CardInfoDashboard
            title="Problemas Registrados"
            value={quantidadeTags}
            icon={<LuTag />}
          />
        </SimpleGrid>

        <Grid
          templateColumns={{ 
            base: "1fr", 
            lg: "1fr 1fr" 
          }}
          templateRows={{ 
            base: "auto auto auto", 
            lg: "auto auto" 
          }}
          gap={6}
          w="full"
          minH="fit-content"
        >
          <Box 
            gridColumn={{ base: "1", lg: "1 / -1" }}
            h={{ base: "250px", md: "350px" }}
            w="full"
            minW={0}
          >
            <LineChart 
              labels={mesAnoLabels} 
              dataValues={MediaHorasConvertida} 
            />
          </Box>

          <Box 
            h={{ base: "400px", md: "350px" }}
            w="full"
            minW={0}
          >
            <BarChart
              lista_tags={lista_tags}
              labelTitle="Quantidade de Tags: "
              dataQuantidades={quantidadeTags}
            />
          </Box>

          <Box 
            h="380px"
            w="full"
            minW={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              w={{ base: "100%", lg: "80%" }}
              h="full"
              maxW="400px"
            >
              <PieChart
                title="Video Conferência e Presencial"
                colors={["#00713C", "#1D1D1B"]}
                labels={["Video Conf.", "Presencial"]}
                dataValues={[totalVideoConferencia, totalInterna]}
              />
            </Box>
          </Box>
        </Grid>
      </Flex>
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