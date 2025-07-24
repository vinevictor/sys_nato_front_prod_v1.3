"use client";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Importa o plugin para os rótulos de dados
import { FaChartPie } from "react-icons/fa6";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels); // Registra o plugin

interface PieChartProps {
  labels: string[];
  dataValues: number[];
  colors?: string[];
  title?: string;
}

export default function PieChart({
  labels,
  dataValues,
  colors,
  title,
}: PieChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Solicitações",
        data: dataValues,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: title,
      },
      datalabels: {
        display: true,
        color: "white",
        font: {
          weight: "bold" as const,
          size: 12,
        },
        formatter: (value: number, ctx: any) => {
          const total = ctx.dataset.data.reduce(
            (acc: number, val: number) => acc + val,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
    },
  };

  return (
    <Flex

      rounded="12px"
      p={4}
      justify="space-around"
      direction="column"
    >

      <Flex justifyContent={"center"} alignItems={"center"}>
        <FaChartPie color="#fff" />
        <Text fontWeight="bold" >
          {title}
        </Text>
      </Flex>


      <Box
        p={3}
        bg="white"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Pie data={data} options={options} />
      </Box>
    </Flex>
  );
}
