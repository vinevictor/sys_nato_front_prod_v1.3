"use client";
import dynamic from "next/dynamic";
import { Box, useColorModeValue } from "@chakra-ui/react";

// Carregamento dinâmico necessário para o ApexCharts no Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BarChartProps {
  lista_tags: { tag: string; total: number }[];
}

export default function ModernBarChart({ lista_tags }: BarChartProps) {
  const textColor = useColorModeValue("#4A5568", "#EDF2F7");
  const barColor = "#00713C"; // Seu verde NATO

  // Sanitização de dados: se não houver dados, mostramos um array vazio seguro
  const seriesData = lista_tags?.map((item) => item.total ?? 0) || [];
  const categories =
    lista_tags?.map((item) => item.tag || "Não Identificado") || [];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: true, // Ranking fica melhor na horizontal
        barHeight: "60%",
      },
    },
    dataLabels: { enabled: false },
    colors: [barColor],
    xaxis: {
      categories: categories,
      labels: { style: { colors: textColor } },
    },
    yaxis: {
      labels: { style: { colors: textColor } },
    },
    grid: { borderColor: useColorModeValue("#E2E8F0", "#2D3748") },
    tooltip: {
      theme: useColorModeValue("light", "dark"),
      y: {
        formatter: (val) => `${val} emissões`,
      },
    },
  };

  return (
    <Box w="100%" h="100%">
      <Chart
        options={options}
        series={[{ name: "Total", data: seriesData }]}
        type="bar"
        height="100%"
      />
    </Box>
  );
}
