{
  {
  }
}
export const dynamic = "force-dynamic";
{
  {
  }
}

import GetConstrutoras from "@/actions/dashboard/services/getConstrutoras";
import GetEmpreendimentos from "@/actions/dashboard/services/getEmpreendimentos";
import GetFinanceiras from "@/actions/dashboard/services/getFinanceiras";
import BarChart from "@/components/barChart";
import CardInfoDashboard from "@/components/cardInfoDashboard";
import DashFiltrado from "@/components/dashFiltrado";
import LineChart from "@/components/lineChart.tsx";
import PieChart from "@/components/pieChart.tsx";
import { GetSessionServer } from "@/lib/auth_confg";
import { Flex } from "@chakra-ui/react";
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

  //Dados para o filtro
  const construtoras = await GetConstrutoras();
  const empreendimentos = await GetEmpreendimentos();
  const financeiras = await GetFinanceiras();

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

  function averageTimeInHours(secondsArray: number[]): string {
    const totalSeconds = secondsArray.reduce((acc, curr) => acc + curr, 0);
    const averageSeconds = totalSeconds / 6;

    const roundedAverageSeconds = Math.round(averageSeconds);

    const hours = Math.floor(averageSeconds / 3600);
    const minutes = Math.floor((averageSeconds % 3600) / 60);
    const seconds = roundedAverageSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  const mediaHorasGlobal = averageTimeInHours(MediaHorasConvertida);

  const arrayRG = data.map((item: any) => item.RG);
  const arrayCNH = data.map((item: any) => item.CNH);
  const totalRG = arrayRG.reduce((acc: number, item: number) => acc + item, 0);
  const totalCNH = arrayCNH.reduce(
    (acc: number, item: number) => acc + item,
    0
  );

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
        <Flex justifyContent={"space-around"} gap={"1%"} p={"1%"}>
          <LineChart labels={mesAnoLabels} dataValues={MediaHorasConvertida} />
          <BarChart
            lista_tags={lista_tags}
            labelTitle="Quantidade de Tags: "
            dataQuantidades={quantidadeTags}
          />
        </Flex>
        <Flex justifyContent={"space-around"} gap={"1%"} h={"50%"} p={"1%"}>
          <PieChart
            title="Quantidade de RG e CNH"
            colors={["#1D1D1B", "#00713C"]}
            labels={["RG", "CNH"]}
            dataValues={[totalRG, totalCNH]}
          />
          <PieChart
            title="Video Conferencia e Presencial"
            colors={["#00713C", "#1D1D1B"]}
            labels={["Video Conf.", "Presencial"]}
            dataValues={[totalVideoConferencia, totalInterna]}
          />
        </Flex>
        <Flex
          w={"100%"}
          rounded={"12px"}
          p={4}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <DashFiltrado
            construtoras={construtoras}
            financeiras={financeiras}
            empreendimentos={empreendimentos}
          />
        </Flex>
      </Flex>
    </>
  );
}
