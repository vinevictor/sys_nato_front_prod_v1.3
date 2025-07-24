"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Importando o plugin de rótulos
import React from "react";
import { Box } from "@chakra-ui/react";

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface TagData {
  descricao: string;
  quantidade: number;
}

interface BarChartProps {
  lista_tags: TagData[];
  labelTitle: string;
  dataQuantidades: number;
}

export default function BarChart({ lista_tags }: BarChartProps) {
  const maiorMenor = lista_tags.sort((a, b) => b.quantidade - a.quantidade);

  // Selecionar as 5 tags com mais quantidade
  const top5Tags = maiorMenor.slice(0, 5);

  // Agrupar o restante em "Outras"
  const outrasTags = maiorMenor.slice(5);
  const totalOutros = outrasTags.reduce((acc, tag) => acc + tag.quantidade, 0);

  // Novo array de tags com a categoria "Outras"
  const finalTags = [
    ...top5Tags,
    { descricao: "Outras", quantidade: totalOutros },
  ];

  // Definindo as cores personalizadas para as barras
  const colors = [
    "rgba(255, 99, 132)", // Rosa claro
    "rgba(255, 159, 64)", // Laranja claro
    "rgba(255, 205, 86)", // Amarelo claro
    "rgba(75, 192, 192)", // Verde claro
    "rgba(54, 162, 235)", // Azul claro
    "rgba(153, 102, 255)", // Roxo claro
  ];

  const data = {
    labels: finalTags.map((tag) => tag.descricao),
    display: false,
    datasets: [
      {
        label: "Quantidade",
        data: finalTags.map((tag) => tag.quantidade),
        backgroundColor: colors.slice(0, finalTags.length), // Atribui cores baseadas no número de tags
        borderColor: colors
          .slice(0, finalTags.length)
          .map((color) => color.replace("0.2", "1")), // Ajusta a borda para uma cor mais forte
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Problemas Registrados :",
        position: "top" as const,
        align: "start" as const,
        font: {
          size: 16,
        },
        padding: {
          bottom: 30,
        },
      },
      tooltip: {
        borderColor: "#00713C",
        borderWidth: 2,
        titleFont: {
          size: 14,
          weight: "bold" as const,
          color: "#00713C",
        },
        bodyFont: {
          size: 12,
          color: "#333",
        },
        padding: 12,
        cornerRadius: 10,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        callbacks: {
          label: (context: any) => {
            const descricao = finalTags[context.dataIndex].descricao;
            const quantidade = context.raw;
            return `${descricao}: ${quantidade} registros`;
          },
        },
      },
      datalabels: {
        color: "black",
        font: {
          size: 12,
        },
        formatter: (value: number) => `${value}`,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
          text: "Tags",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <Box
      h="full"
      w={"full"}
      p={2}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      display="flex"
      justifyContent="center"
      alignItems="center"
      _hover={{ boxShadow: "xl" }}
    >
      <Bar data={data} options={options} />
    </Box>
  );
}
