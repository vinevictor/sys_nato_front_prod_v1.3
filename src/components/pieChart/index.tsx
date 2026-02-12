"use client";
import {
  Box,
  Flex,
  Text,
  useColorMode,
  VStack,
  Divider,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
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

  // Cores Reativas (Imbatíveis contra o bug do F5)
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const boxBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const iconBg = useColorModeValue("green.50", "green.900");
  const fadedColor = useColorModeValue(
    "rgba(0,0,0,0.1)",
    "rgba(255,255,255,0.1)"
  );

  const total = dataValues.reduce((acc, value) => acc + value, 0);

  // Mapeamento de cores institucional vs neon
  const adjustedColors = colors?.map((color) => {
    if (isDark) {
      if (color === "#00713C") return "#00d672";
      if (color === "#1D1D1B") return "#4A5568";
    }
    return color;
  }) || ["#00713D", "#1D1D1B"];

  const dataset = labels.map((label, index) => ({
    id: label,
    value: dataValues[index],
    label,
    color: adjustedColors[index],
    percentage:
      total > 0 ? ((dataValues[index] / total) * 100).toFixed(1) : "0",
  }));

  return (
    <Flex w="full" direction="column" gap={3}>
      {/* Header do Card */}
      <Flex align="center" gap={2} px={1}>
        <Box p={1.5} bg={iconBg} borderRadius="md">
          <FaChartPie color="#00d672" size={16} />
        </Box>
        <Text
          fontWeight="bold"
          fontSize="md"
          color={textColor}
          letterSpacing="tight"
        >
          {title}
        </Text>
      </Flex>

      {/* O uso da KEY é o que força o gráfico a atualizar as cores internas do SVG */}
      <Box
        key={colorMode}
        position="relative"
        bg={boxBg}
        borderRadius="xl"
        p={4}
        shadow="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <MuiChartsProvider>
          <Box position="relative" h="280px">
            {/* Texto Central */}
            <VStack
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              spacing={-1}
              pointerEvents="none"
              zIndex={1}
            >
              <Text fontSize="2xl" fontWeight="800" color={textColor}>
                {total}
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                fontWeight="bold"
                textTransform="uppercase"
              >
                Total
              </Text>
            </VStack>

            <MuiPieChart
              series={[
                {
                  data: dataset,
                  innerRadius: 85,
                  outerRadius: 115,
                  cornerRadius: 10,
                  paddingAngle: 5,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 85,
                    additionalRadius: -5,
                    color: fadedColor,
                  },
                },
              ]}
              height={280}
              slotProps={{ legend: { hidden: true } as any }}
              sx={{
                legend: { display: "none" },
                [`& .${pieArcLabelClasses.root}`]: { display: "none" },
                "& .MuiPieArc-root": { transition: "all 0.3s ease" },
              }}
            />
          </Box>
        </MuiChartsProvider>

        <Divider my={4} borderColor={borderColor} />
        <SimpleGrid columns={2} spacing={4}>
          {dataset.map((item) => (
            <Flex key={item.id} align="center" justify="space-between">
              <Flex align="center" gap={2}>
                <Box boxSize="10px" borderRadius="full" bg={item.color} />
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  {item.label}
                </Text>
              </Flex>
              <Text fontSize="xs" fontWeight="800" color={textColor}>
                {item.percentage}%
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
