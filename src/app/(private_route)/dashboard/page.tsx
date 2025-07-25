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
        cache: "no-cache",
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

  const mesAnoLabels = data.map((item: any) => `${item.mes}/${item.ano}`);

  const arrayMediaHoras = data.map((item: any) => item.mediaHoras);

  const timeToSeconds = (time: string): number => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const MediaHorasConvertida = arrayMediaHoras.map(timeToSeconds);


  return (
    <>

      <Flex w={"full"} h={"full"} flexDir={"column"} p={2}>
        <Flex
          w={"100%"}
          h={"auto"}
          gap={"1%"}
          justifyContent={"space-around"}
          p={"20px"}
        >
          <CardInfoDashboard
            title={"Total Solicitações"}
            value={totalSolicitacoesGlobal}
            icon={<LuClipboardCheck />}
          />
          <CardInfoDashboard
            title={"Total Solicitações"}
            value={totalSolicitacoesGlobal}
            icon={<FaRegClock />}
          />
          <CardInfoDashboard
            title={"Total Solicitações"}
            value={totalSolicitacoesGlobal}
            icon={<LuTag />}
          />
        </Flex>
        <Flex flexDir={"column"} w={"full"} gap={"20px"} h={"full"} alignItems="center" justifyContent="center">
          <Box h={"full"} w="50%" m="auto">
            <LineChart labels={mesAnoLabels} dataValues={MediaHorasConvertida} />
          </Box>
          <Box h={"full"} w="50%" m="auto">
            <BarChart
              lista_tags={lista_tags}
              labelTitle="Quantidade de Tags: "
              dataQuantidades={quantidadeTags}
            />
          </Box>
          <Box h={"full"} w="60%" m="auto">
            <PieChart
              title="Video Conferencia e Presencial"
              colors={["#00713C", "#1D1D1B"]}
              labels={["Video Conf.", "Presencial"]}
              dataValues={[totalVideoConferencia, totalInterna]}
            />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}