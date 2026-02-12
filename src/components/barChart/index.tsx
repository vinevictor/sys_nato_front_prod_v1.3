"use client";
import React from "react";
import { Box, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { BarChart as MuiBarChart } from "@mui/x-charts/BarChart";
import MuiChartsProvider from "@/components/charts/mui-charts-provider";

interface TagData {
  descricao: string;
  quantidade: number;
}

interface BarChartProps {
  lista_tags: TagData[];
}

export default function BarChart({ lista_tags }: BarChartProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const titleColor = useColorModeValue("#023147", "gray.100");
  const labelColor = useColorModeValue("#4A5568", "#A0AEC0");
  const axisColor = useColorModeValue("#CBD5E0", "#4A5568");

  const maiorMenor = [...lista_tags].sort(
    (a, b) => b.quantidade - a.quantidade
  );
  const top5Tags = maiorMenor.slice(0, 5);
  const outrasTags = maiorMenor.slice(5);
  const totalOutros = outrasTags.reduce((acc, tag) => acc + tag.quantidade, 0);

  const finalTags = [
    ...top5Tags,
    ...(totalOutros > 0
      ? [{ descricao: "Outros", quantidade: totalOutros }]
      : []),
  ];

  return (
    <Box
      key={colorMode}
      h="full"
      w="full"
      p={4}
      bg={bgColor}
      borderRadius="xl"
      shadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      display="flex"
      flexDir="column"
      gap={4}
      transition="all 0.2s ease-in-out"
    >
      <Text
        fontSize="md"
        fontWeight="bold"
        color={titleColor}
        borderBottom="1px solid"
        borderColor={borderColor}
        pb={2}
      >
        Ranking de Ocorrências
      </Text>

      <Box flex={1} w="full">
        <MuiChartsProvider>
          <MuiBarChart
            layout="horizontal"
            height={350}
            dataset={finalTags as any[]}
            yAxis={[
              {
                scaleType: "band",
                dataKey: "descricao",
                tickLabelStyle: {
                  fill: labelColor,
                  fontSize: 11,
                },
              },
            ]}
            xAxis={[
              {
                tickLabelStyle: {
                  fill: labelColor,
                  fontSize: 11,
                },
              },
            ]}
            series={[
              {
                dataKey: "quantidade",
                label: "Registros",
                color: "#00d672",
                valueFormatter: (v) => `${v} registros`,
              },
            ]}
            borderRadius={10}
            slotProps={{ legend: { hidden: true } as any }}
            sx={{
              "& .MuiChartsAxis-tickLabel": {
                fill: `${labelColor} !important`,
              },
              "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
                stroke: `${axisColor} !important`,
              },
            }}
            grid={{ vertical: true }}
            margin={{ top: 10, bottom: 40, left: 100, right: 20 }}
          />
        </MuiChartsProvider>
      </Box>
    </Box>
  );
}
