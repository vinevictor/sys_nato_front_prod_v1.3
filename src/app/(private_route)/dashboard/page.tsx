
import BarChart from "@/components/barChart";
import CardInfoDashboard from "@/components/cardInfoDashboard";

import LineChart from "@/components/lineChart.tsx";
import PieChart from "@/components/pieChart.tsx";
import { GetSessionServer } from "@/lib/auth_confg";
import { Box, Flex } from "@chakra-ui/react";
import { FaRegClock } from "react-icons/fa6";
import { LuClipboardCheck, LuTag } from "react-icons/lu";

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
    <Flex w="full" h="full" direction="column" p={2} gap={2}>

      <Flex w="100%" gap="1%" justify="space-around" p="20px">
        <CardInfoDashboard
          title="Total de Solicitações"
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
      </Flex>

      <Flex direction="column" gap="20px" align="center" w="full" h="full">
        <Box w="50%" minH="450px">
          <LineChart labels={mesAnoLabels} dataValues={mediasSegundos} />
        </Box>

        <Box w="50%" minH="450px">
          <BarChart
            lista_tags={lista_tags}
            labelTitle="Quantidade de Tags:"
            dataQuantidades={quantidadeTags}
          />
        </Box>
      </Flex>
      <Flex>
        <Box w="80%" minH="300px">
          <PieChart
            title="Vídeo‑conf. × Presencial"
            labels={["Vídeo Conf.", "Presencial"]}
            colors={["#00713C", "#1D1D1B"]}
            dataValues={[totalVideoConferencia, totalInterna]}
          />
        </Box>
      </Flex>
    </Flex>
  );
}