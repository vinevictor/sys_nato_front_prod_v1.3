"use client";
import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { LuLayoutDashboard } from "react-icons/lu";

export default function DashboardHeader() {
  // Cores dinâmicas para o envelope (Flex)
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("#00713D", "#00d672");

  // Cores dinâmicas para o ícone (Box)
  const iconBg = useColorModeValue("green.50", "green.900");
  const iconColor = useColorModeValue("#00713D", "#00d672");

  // Cores para os textos
  const titleColor = useColorModeValue("#023147", "white");
  const subtitleColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex
      bg={bgColor}
      p={6}
      borderRadius="xl"
      shadow="sm"
      align="center"
      borderLeft="4px solid"
      borderLeftColor={borderColor}
      transition="all 0.2s"
      w="full"
    >
      <Box
        p={3}
        bg={iconBg}
        borderRadius="lg"
        mr={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <LuLayoutDashboard size={28} color={iconColor} />
      </Box>
      <Box>
        <Heading size="lg" color={titleColor}>
          Painel de Monitoramento
        </Heading>
        <Text color={subtitleColor}>
          Métricas consolidadas de certificações
        </Text>
      </Box>
    </Flex>
  );
}
