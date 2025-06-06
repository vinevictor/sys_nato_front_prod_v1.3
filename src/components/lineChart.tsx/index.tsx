"use client";
import { Box } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Registra os componentes do Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler
);

interface LineChartProps {
  labels: string[];
  dataValues: number[];
}

// Função para converter segundos para HH:mm:ss
function secondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
}

export default function LineChart({ labels, dataValues }: LineChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Média de Horas",
        data: dataValues,
        borderColor: "#00713C",
        backgroundColor: "rgba(0, 113, 60, 0.2)",
        borderWidth: 2,
        fill: true,
        pointBorderColor: "#00713C", // Cor da borda dos pontos
        pointBackgroundColor: "#fff", // Cor de fundo dos pontos
        pointRadius: 6, // Tamanho dos pontos
        pointHoverRadius: 10, // Aumenta o tamanho dos pontos ao passar o mouse
        pointHoverBackgroundColor: "#00713C", // Cor de fundo dos pontos ao passar o mouse
        pointHoverBorderColor: "#fff", // Cor da borda ao passar o mouse
        datalabels: {
          display: false,
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Média de Horas por Certificado",
        position: "top" as const,
        align: "start" as const,
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: {
          bottom: 30,
        },
        color: "#333", 
      },
      tooltip: {
        enabled: true, 
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
          label: function (context: any) {
            const value = context.raw;
            return `Horas: ${secondsToTime(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false, 
        },
        title: {
          display: false,
          text: "Horas",
        },
        ticks: {
          callback: function (tickValue: string | number) {
            return secondsToTime(Number(tickValue)); 
          },
        },
      },
      x: {
        grid: {
          display: false, 
        },
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
        hoverBackgroundColor: "#00713C",
        borderWidth: 3, 
        borderColor: "#00713C", 
      },
    },
  };

  return (
    <Box
      h="auto"
      w={"full"}
      p={2}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      _hover={{ boxShadow: "xl" }}
    >
      <Line data={data} options={options} />
    </Box>
  );
}
