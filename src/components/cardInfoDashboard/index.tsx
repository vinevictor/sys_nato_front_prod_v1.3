"use client";
import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";

type CardInfoDashboardProps = {
  title: string;
  value: string | number;
  icon: React.ReactElement;
};

export default function CardInfoDashboard({
  title,
  value,
  icon,
}: CardInfoDashboardProps) {
  // Forçamos a definição de cores baseada no tema para evitar que o cache do Server Component trave o estilo
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColorValue = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("#023147", "gray.100");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const iconBg = useColorModeValue("green.50", "green.900");
  const iconColor = useColorModeValue("#00713D", "#00d672");

  return (
    <Box
      bg={bgColor}
      p={{ base: 3, sm: 3.5, md: 4 }}
      borderRadius={{ base: "lg", md: "xl" }}
      shadow={{ base: "sm", md: "md" }}
      borderWidth="1px"
      borderColor={borderColorValue}
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "xl",
        borderColor: "#00713D",
      }}
      position="relative"
      overflow="hidden"
      minH={{ base: "130px", sm: "140px", md: "160px" }}
      w="100%"
    >
      {/* Barra de destaque superior */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="4px"
        bgGradient="linear(to-r, #00713D, #00d672)"
      />

      <Flex direction="column" gap={3} align="flex-start" w="full">
        <Box
          p={{ base: 1.5, md: 2 }}
          bg={iconBg}
          borderRadius="lg"
          color={iconColor}
          fontSize="1.4rem"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>

        <Text
          fontSize="xs"
          fontWeight="medium"
          color={labelColor}
          lineHeight="1.2"
          noOfLines={2}
        >
          {title}
        </Text>

        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          color={textColor}
          fontWeight="extrabold"
          lineHeight={1}
        >
          {value}
        </Heading>
      </Flex>
    </Box>
  );
}
