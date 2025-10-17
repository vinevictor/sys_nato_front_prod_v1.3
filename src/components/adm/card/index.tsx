"use client";
import { Box, Flex, Heading, Text, Skeleton } from "@chakra-ui/react";
import { memo } from "react";

interface CardAdmUsuarioProps {
  count?: number | string | null;
  title: string;
  icon: React.ReactNode;
  loading?: boolean;
}

/**
 * Card de estatísticas do painel administrativo
 * Otimizado com React.memo para evitar re-renders desnecessários
 * 
 * @param count - Número a ser exibido
 * @param title - Título do card
 * @param icon - Ícone do card
 * @param loading - Estado de carregamento (mostra skeleton no número)
 */
const CardAdmUsuario = memo(function CardAdmUsuario({ count, title, icon, loading = false }: CardAdmUsuarioProps) {
  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
      p={{ base: 3.5, sm: 4, md: 5 }}
      borderRadius={{ base: "lg", md: "xl" }}
      shadow={{ base: "sm", md: "md" }}
      borderWidth="1px"
      borderColor="gray.200"
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
      {/* Gradiente decorativo */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="4px"
        bgGradient="linear(to-r, #00713D, #00d672)"
      />

      <Flex direction="column" gap={3} align="flex-start" w="full">
        {/* Ícone */}
        <Box
          p={{ base: 2, md: 2.5 }}
          bg="green.50"
          _dark={{ bg: "green.900", color: "#00d672" }}
          borderRadius="lg"
          color="#00713D"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>

        {/* Título */}
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="medium"
          color="gray.600"
          _dark={{ color: "gray.400" }}
          lineHeight="1.2"
          noOfLines={2}
        >
          {title}
        </Text>

        {/* Número */}
        {loading || count === null || count === undefined ? (
          <Skeleton 
            height={{ base: "32px", md: "40px" }} 
            width="80%"
            startColor="gray.100"
            endColor="gray.300"
            borderRadius="md"
          />
        ) : (
          <Heading
            size={{ base: "xl", md: "2xl" }}
            color="#023147"
            _dark={{ color: "gray.100" }}
            fontWeight="bold"
          >
            {count}
          </Heading>
        )}
      </Flex>
    </Box>
  );
});

export default CardAdmUsuario;