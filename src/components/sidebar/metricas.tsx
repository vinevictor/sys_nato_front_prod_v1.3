"use client";

import {
  Button,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiBarChart2 } from "react-icons/fi";

/**
 * Componente de Botão de Métricas
 *
 * Funcionalidades:
 * - Botão que redireciona para a página /dashboard
 * - Visual consistente com o padrão da sidebar
 * - Suporte a tema claro/escuro
 *
 * @component
 */
export default function MetricsButton() {
  // Cores dinâmicas baseadas no tema
  const bgButton = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const textColor = useColorModeValue("#023147", "gray.100");

  return (
    <Link href="/dashboard" style={{ textDecoration: "none", width: "100%" }}>
      <Button
        w="full"
        h="auto"
        p={2}
        bg={bgButton}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        _hover={{
          bg: hoverBg,
          borderColor: "#FB8501",
        }}
        transition="all 0.2s ease"
      >
        <HStack spacing={3} w="full">
          {/* Ícone de métricas */}
          <Icon
            as={FiBarChart2}
            fontSize="20"
            color={textColor}
            transition="all 0.2s"
          />

          {/* Texto */}
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              Métricas
            </Text>
          </VStack>
        </HStack>
      </Button>
    </Link>
  );
}
