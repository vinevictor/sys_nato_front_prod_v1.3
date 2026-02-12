"use client";
import { GridItem, Heading, Box, useColorModeValue } from "@chakra-ui/react";

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

export default function ChartContainer({
  title,
  children,
}: ChartContainerProps) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const titleColor = useColorModeValue("gray.800", "white");

  return (
    <GridItem
      bg={bgColor}
      p={6}
      borderRadius="xl"
      shadow="md"
      transition="all 0.2s"
    >
      <Heading
        size="md"
        mb={6}
        color={titleColor}
        borderBottom="1px solid"
        borderColor={borderColor}
        pb={2}
      >
        {title}
      </Heading>
      <Box h="350px">{children}</Box>
    </GridItem>
  );
}
