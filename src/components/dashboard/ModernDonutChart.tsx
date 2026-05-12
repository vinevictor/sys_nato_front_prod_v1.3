"use client";
import dynamic from "next/dynamic";
import { Box, useColorModeValue } from "@chakra-ui/react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DonutProps {
  labels: string[];
  dataValues: number[];
  colors?: string[];
}

export default function ModernDonutChart({
  labels,
  dataValues,
  colors,
}: DonutProps) {
  const textColor = useColorModeValue("#4A5568", "#EDF2F7");

  const options: ApexCharts.ApexOptions = {
    labels: labels,
    colors: colors || ["#00713C", "#2D3748"],
    stroke: { show: false },
    legend: {
      position: "bottom",
      labels: { colors: textColor },
    },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              color: textColor,
              formatter: (w) => {
                return w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
              },
            },
          },
        },
      },
    },
  };

  return (
    <Box w="100%" h="100%">
      <Chart
        options={options}
        series={dataValues.map((v) => v ?? 0)}
        type="donut"
        height="100%"
      />
    </Box>
  );
}
