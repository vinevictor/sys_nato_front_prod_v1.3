import BarChart from "@/components/barChart";
import CardInfoDashboard from "@/components/cardInfoDashboard";
import LineChart from "@/components/lineChart.tsx";
import PieChart from "@/components/pieChart";
import { GetSessionServer } from "@/lib/auth_confg";
import { Box, Flex, Grid, SimpleGrid } from "@chakra-ui/react";
import { FaRegClock } from "react-icons/fa6";
import { LuClipboardCheck, LuTag } from "react-icons/lu";

export const dynamic = 'force-dynamic';

export default async function DashBoard() {
  // Função para buscar dados da API
  const session = await GetSessionServer();
  const fetchData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/dashboard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        cache: "force-cache",
        // revalidar a cada 2 horas
        next: {
          revalidate: 60 * 60 * 2,
        },
      }
    );

    return response.json();
  };

  const req = await fetchData();
  const data = req.contagem;
  const tags = req.tags;


  // Dados tags
  const lista_tags = tags.lista_tags;
  const quantidadeTags = tags.total_tags;

  //Quantidade Total Solicitacoes
  const totalSolicitacoes = data.map((item: any) => item.total);
  const totalSolicitacoesGlobal = totalSolicitacoes.reduce(
    (acc: number, item: number) => acc + item,
    0
  );

  // Extrair dados para cálculos
  const arrayVideoConferencia = data.map((item: any) => item.videoConferencia);
  const arrayInterna = data.map((item: any) => item.interna);
  let totalVideoConferencia = arrayVideoConferencia.reduce(
    (acc: number, item: number) => acc + item,
    0
  );
  let totalInterna = arrayInterna.reduce(
    (acc: number, item: number) => acc + item,
    0
  );

  const totalInternaPorcentagem = (
    (totalInterna / totalSolicitacoesGlobal) *
    100
  ).toFixed(1);

  if (+totalInternaPorcentagem < 10) {
    const valor = Math.round(totalSolicitacoesGlobal * 0.1);
    const valorTotal = valor + totalInterna;

    totalVideoConferencia = totalSolicitacoesGlobal - valorTotal;
    totalInterna = valorTotal;
  }

  // Dados de mês/ano para os labels
  const mesAnoLabels = data.map((item: any) => `${item.mes}/${item.ano}`);

  // Dados para o LineChart
  const arrayMediaHoras = data.map((item: any) => item.mediaHoras);

  // Função para converter tempo HH:mm:ss em segundos
  const timeToSeconds = (time: string): number => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const MediaHorasConvertida = arrayMediaHoras.map(timeToSeconds);

  const toSeconds = (t: string) =>
    t.split(":").reduce((acc, v, i) => acc + +v * [3600, 60, 1][i], 0);

  const mediasSegundos = data.map((i: any) => toSeconds(i.mediaHoras));

  const mediaGlobalSeg = Math.round(
    mediasSegundos.reduce((a: number, b: number) => a + b, 0) / mediasSegundos.length
  );

  const mediaGlobalHHMMSS = new Date(mediaGlobalSeg * 1000)
    .toISOString()
    .slice(11, 19); // "HH:mm:ss"

  return (
    <>

      <Flex w={"full"} h={"full"} flexDir={"column"} p={{ base: 4, md: 6 }} gap={6} overflowX="hidden" overflowY="auto">
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3 }}
          spacing={4}
          w={"100%"}
        >
          <CardInfoDashboard
            title={"Total Solicitações"}
            value={totalSolicitacoesGlobal}
            icon={<LuClipboardCheck />}
          />
          <CardInfoDashboard
            title={"Média de Horas p/ Certificação"}
            value={mediaGlobalHHMMSS}
            icon={<FaRegClock />}
          />
          <CardInfoDashboard
            title={"Problemas Registrados"}
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
          w={"full"}
          minH="fit-content"
        >
          <Box 
            gridColumn={{ base: "1", lg: "1 / -1" }}
            h={{ base: "250px", md: "350px" }}
            w="full"
            minW={0}
          >
            <LineChart labels={mesAnoLabels} dataValues={MediaHorasConvertida} />
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
            h={"380px"}
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
                title="Video Conferencia e Presencial"
                colors={["#00713C", "#1D1D1B"]}
                labels={["Video Conf.", "Presencial"]}
                dataValues={[totalVideoConferencia, totalInterna]}
              />
            </Box>
          </Box>
        </Grid>
      </Flex>
    </>
  );
}
