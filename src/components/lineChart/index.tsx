"use client";
import { Box, useColorMode, useToken } from "@chakra-ui/react";
import { LineChart as MuiLineChart } from "@mui/x-charts/LineChart";
import MuiChartsProvider from "@/components/charts/mui-charts-provider";

interface LineChartProps {
  labels: string[];
  dataValues: number[];
}

function secondsToTime(seconds: number): string {
  if (!seconds) return "00:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  // Se for muitas horas, mostra as horas, senão foca em min:seg
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export default function LineChart({ labels, dataValues }: LineChartProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // Pegamos as cores do tema do Chakra para bater com o gráfico
  const [gray300, gray700] = useToken("colors", ["gray.300", "gray.700"]);

  return (
    <Box
      h="full"
      w="full"
      p={2}
      bg="transparent" // Fundo transparente pois o Box pai no page.tsx já tem fundo
      key={colorMode}
    >
      <MuiChartsProvider>
        <MuiLineChart
          height={350}
          series={[
            {
              id: "tma",
              label: "Tempo Médio",
              data: dataValues,
              curve: "catmullRom", // Visual mais moderno e suave
              showMark: true,
              area: true, // Preenchimento abaixo da linha
              color: "#00d672",
              valueFormatter: (value) => secondsToTime(Number(value)),
            },
          ]}
          xAxis={[
            {
              data: labels,
              scaleType: "band",
              // Estilização das fontes para o Dark Mode
              tickLabelStyle: {
                fill: isDark ? "#A0AEC0" : "#4A5568",
                fontSize: 12,
              },
            },
          ]}
          yAxis={[
            {
              valueFormatter: (value: any) => secondsToTime(Number(value)),
              tickLabelStyle: {
                fill: isDark ? "#A0AEC0" : "#4A5568",
                fontSize: 12,
              },
            },
          ]}
          // Ajuste de cores da grade (Grid)
          sx={{
            // Cor dos textos (Labels)
            "& .MuiChartsAxis-tickLabel": {
              fill: isDark ? "#A0AEC0 !important" : "#4A5568 !important",
            },
            // Cor das linhas dos eixos
            "& .MuiChartsAxis-line": {
              stroke: isDark ? "#4A5568 !important" : "#CBD5E0 !important",
            },
            // Cor dos tracinhos (ticks)
            "& .MuiChartsAxis-tick": {
              stroke: isDark ? "#4A5568 !important" : "#CBD5E0 !important",
            },
            // Cor da Grade (Grid)
            "& .MuiChartsGrid-line": {
              stroke: isDark
                ? "rgba(255, 255, 255, 0.1) !important"
                : "rgba(0, 0, 0, 0.1) !important",
            },
          }}
          grid={{ horizontal: true }}
          margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
        />
      </MuiChartsProvider>
    </Box>
  );
}
