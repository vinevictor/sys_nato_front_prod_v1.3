"use client";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { FaChartPie } from "react-icons/fa6";
import { PieChart as MuiPieChart } from "@mui/x-charts/PieChart";
import { pieArcLabelClasses } from "@mui/x-charts/PieChart";
import MuiChartsProvider from "@/components/charts/mui-charts-provider";

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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const textColor = isDark ? "#E2E8F0" : "#1A202C";
  const iconColor = isDark ? "#00d672" : "#047857";

  // Ajustar cores para dark mode - usar cores mais claras
  const adjustedColors = isDark && colors
    ? colors.map((color) => {
        // Se for o verde escuro #00713C, usar verde claro
        if (color === "#00713C") return "#00d672";
        // Se for o preto #1D1D1B, usar cinza claro
        if (color === "#1D1D1B") return "#718096";
        return color;
      })
    : colors;

  const total = dataValues.reduce((acc, value) => acc + value, 0);
  const dataset = labels.map((label, index) => ({
    id: label,
    value: dataValues[index],
    label,
    color: adjustedColors?.[index],
    formattedValue:
      total > 0 ? `${((dataValues[index] / total) * 100).toFixed(1)}%` : "0%",
  }));

  return (
    <Flex
      w="full"
      h="full"
      rounded="12px"
      p={2}
      direction="column"
      gap={2}
      bg="transparent"
    >
      <Flex justifyContent={"center"} alignItems={"center"} gap={2} minH="40px">
        <FaChartPie color={iconColor} size={18} />
        <Text fontWeight="semibold" fontSize="sm" color={textColor}>
          {title}
        </Text>
      </Flex>

      <Box
        flex={1}
        bg="white"
        borderRadius="md"
        boxShadow="md"
        borderWidth="1px"
        borderColor={isDark ? "gray.700" : "rgba(187, 187, 187, 0.22)"}
        p={2}
        _hover={{ boxShadow: "xl" }}
        w="full"
        minH={0}
        _dark={{
          bg: "gray.900",
          boxShadow: "dark-lg",
        }}
      >
        <MuiChartsProvider>
          <MuiPieChart
            height={300}
            series={[
              {
                innerRadius: 70,
                outerRadius: 110,
                cornerRadius: 8,
                paddingAngle: 3,
                data: dataset.map((item) => ({
                  id: item.id,
                  value: item.value,
                  label: item.label,
                  color: item.color,
                  arcLabel: item.formattedValue,
                })),
                valueFormatter: (item) => `${item.value}`,
                highlightScope: { fade: "global", highlight: "item" },
              },
            ]}
            slotProps={{
              noDataOverlay: {
                message: "Sem dados para exibir",
              },
            }}
            sx={{
              [`.${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontSize: 14,
                fontWeight: 800,
                textShadow: "0 2px 4px rgba(0,0,0,0.6)",
              },
            }}
            margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
          />
        </MuiChartsProvider>
      </Box>
    </Flex>
  );
}
