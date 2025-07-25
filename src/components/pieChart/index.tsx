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
      w="full"
      h="full"
      rounded="12px"
      p={2}
      direction="column"
      gap={2}
    >
      <Flex justifyContent={"center"} alignItems={"center"} gap={2} minH="40px">
        <FaChartPie color="#666" />
        <Text fontWeight="bold" fontSize="sm" color="gray.700">
          {title}
        </Text>
      </Flex>

      <Box
        flex={1}
        bg="white"
        borderRadius="md"
        boxShadow="md"
        p={4}
        _hover={{ boxShadow: "xl" }}
        w="full"
        minH={0}
      >
        <Pie data={data} options={options} />
      </Box>
    </Flex>
  );
}
