"use client";
import { Box, useColorMode } from "@chakra-ui/react";
import { LineChart as MuiLineChart } from "@mui/x-charts/LineChart";
import MuiChartsProvider from "@/components/charts/mui-charts-provider";

interface LineChartProps {
  labels: string[];
  dataValues: number[];
}

// Função para converter segundos para HH:mm:ss
function secondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

export default function LineChart({ labels, dataValues }: LineChartProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Box
      h="full"
      w="full"
      p={1}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      borderWidth="1px"
      borderColor={isDark ? "gray.700" : "rgba(187, 187, 187, 0.22)"}
      _dark={{
        bg: "gray.900",
        boxShadow: "dark-lg",
      }}
      _hover={{ boxShadow: "xl" }}
    >
      <MuiChartsProvider>
        <MuiLineChart
          height={isDark ? 360 : 350}
          series={[
            {
              id: "tma",
              label: "TMA - Tempo Médio de Atendimento",
              data: dataValues,
              curve: "linear",
              showMark: true,
              area: false,
              color: "#00d672",
              valueFormatter: (value) => secondsToTime(Number(value)),
            },
          ]}
          xAxis={[
            {
              id: "meses",
              data: labels,
              scaleType: "band",
              label: "Período",
              tickLabelStyle: {
                fontSize: 11,
                angle: 0,
              },
            },
          ]}
          yAxis={[
            {
              id: "tempo",
              label: "Tempo",
              valueFormatter: (value: number | null) =>
                value !== null ? secondsToTime(Number(value)) : "0",
              tickLabelStyle: {
                fontSize: 11,
              },
              min: 0,
            },
          ]}
          grid={{ horizontal: true, vertical: false }}
          margin={{ left: 20, right: 10, top: 5, bottom: 45 }}
          slotProps={{
            noDataOverlay: {
              message: "Sem dados para exibir",
            },
          }}
        />
      </MuiChartsProvider>
    </Box>
  );
}
