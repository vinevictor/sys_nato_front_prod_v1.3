'use client';
import { Box, Flex, Text, HStack, VStack } from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

interface DoughnutChartProps {
  labels: string[];
  dataValues: number[];
  colors?: string[];
  title?: string;
}

export default function DoughnutChart({
  labels,
  dataValues,
  colors,
  title,
}: DoughnutChartProps) {
  const defaultColors = [
    "rgba(255, 0, 0, 0.8)", // Vermelho
    "rgba(255, 128, 0, 0.8)", // Laranja
    "rgba(255, 255, 0, 0.8)", // Amarelo
    "rgba(0, 255, 0, 0.8)", // Verde
    "rgba(0, 128, 255, 0.8)", // Azul
    "rgba(128, 0, 255, 0.8)", // Roxo
    "rgba(0, 0, 255, 0.8)", // Azul escuro
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Quantidade",
        data: dataValues,
        backgroundColor: colors || defaultColors,
        borderWidth: 1,
        borderColor: colors?.map(color => color.replace("0.8", "1")) || defaultColors.map(color => color.replace("0.8", "1")),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, 
      },
      title: {
        display: !!title,
        text: title,
      },
      datalabels: {
        display: true,
        color: "black",
        font: {
          weight: "bold" as const,
          size: 12,
        },
        formatter: (value: number, ctx: any) => {
          const total = ctx.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
    },
  };

  return (
    <Flex
      direction="row"
      alignItems="flex-start"
      justifyContent="center"
      w="100%"
      gap={4}
      maxW="600px"
      maxH={'278px'}
      bg="white"
      shadow="md"
      borderRadius="md"
      overflow={"hidden"}
    >
      {/* Gráfico */}
      <Box w="30%" h="300px">
        <Doughnut data={data} options={options} />
      </Box>

      {/* Legenda Customizada */}
      <VStack w="45%" align="flex-start"  pl={2}>
        <Text fontWeight="bold" fontSize="lg" mb={2}>
          {title || "Legenda"}
        </Text>
        {labels.map((label, index) => (
          <HStack key={label}>
            {/* Bolinha de cor */}
            <Box
              w={4}
              h={4}
              borderRadius="full"
              bg={colors ? colors[index] : defaultColors[index]}
            />
            {/* Nome e Valor */}
            <Text fontSize="sm">
              {label}: <b>{dataValues[index]}</b>
            </Text>
          </HStack>
        ))}
      </VStack>
    </Flex>
  );
}
