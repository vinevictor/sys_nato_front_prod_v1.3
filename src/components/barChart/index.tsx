"use client";
import React from "react";
import { Box, Text, useColorMode } from "@chakra-ui/react";
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
  const borderColor = isDark ? "gray.700" : "rgba(187, 187, 187, 0.22)";

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

  // Cores vibrantes e variadas para cada barra
  const barColors = [
    "#FF6384", // Rosa
    "#FF9F40", // Laranja
    "#FFCD56", // Amarelo
    "#4BC0C0", // Turquesa
    "#36A2EB", // Azul
    "#9966FF", // Roxo
  ];

  return (
    <Box
      h="full"
      w={"full"}
      p={1}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      display="flex"
      flexDir="column"
      gap={3}
      justifyContent="flex-start"
      alignItems="center"
      _hover={{ boxShadow: "xl" }}
      _dark={{
        bg: "gray.900",
        borderColor: "gray.700",
        boxShadow: "dark-lg",
      }}
    >
      <MuiChartsProvider>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="semibold"
          color={isDark ? "gray.100" : "#1A202C"}
        >
          Problemas Possíveis
        </Text>
        <MuiBarChart
          height={isDark ? 400 : 380}
          xAxis={[
            {
              scaleType: "band",
              data: finalTags.map((tag) => tag.descricao),
              label: "Categorias",
              tickLabelStyle: {
                fontSize: 10,
                angle: -45,
                textAnchor: "end",
              },
            },
          ]}
          yAxis={[
            {
              label: "Quantidade",
            },
          ]}
          series={finalTags.map((tag, index) => ({
            data: finalTags.map((t, i) => (i === index ? t.quantidade : 0)),
            label: tag.descricao,
            stack: "total",
            color: barColors[index % barColors.length],
            valueFormatter: (value: number | null) =>
              value !== null && value > 0 ? `${value} registros` : "",
          }))}
          margin={{ top: 40, bottom: 100, left: 20, right: 10 }}
          grid={{ horizontal: true, vertical: false }}
        />
      </MuiChartsProvider>
    </Box>
  );
}
