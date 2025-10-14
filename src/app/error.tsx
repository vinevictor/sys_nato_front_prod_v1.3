"use client";

import { useEffect } from "react";
import { Box, Flex, Heading, Text, Button, VStack, Icon } from "@chakra-ui/react";
import { MdRefresh, MdHome, MdWarning } from "react-icons/md";
import Link from "next/link";

/**
 * Componente de erro global da aplicação
 * 
 * Exibido automaticamente quando ocorre um erro não tratado.
 * Permite ao usuário tentar novamente ou voltar para home.
 * 
 * @param error - Erro capturado
 * @param reset - Função para tentar novamente
 * @returns Componente de erro
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro para monitoramento
    console.error("Erro capturado pelo Error Boundary:", error);
  }, [error]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
      p={{ base: 4, md: 8 }}
      position="relative"
      overflow="hidden"
    >
      {/* Efeito de fundo decorativo */}
      <Box
        position="absolute"
        top="-40%"
        right="-10%"
        width="600px"
        height="600px"
        borderRadius="full"
        bg="orange.50"
        _dark={{ bg: "orange.900", opacity: 0.1 }}
        opacity={0.3}
        filter="blur(100px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-40%"
        left="-10%"
        width="500px"
        height="500px"
        borderRadius="full"
        bg="red.50"
        _dark={{ bg: "red.900", opacity: 0.1 }}
        opacity={0.3}
        filter="blur(100px)"
        pointerEvents="none"
      />

      <VStack
        spacing={{ base: 6, md: 8 }}
        textAlign="center"
        maxW={{ base: "90%", md: "600px" }}
        bg="white"
        p={{ base: 6, md: 10 }}
        borderRadius="2xl"
        shadow="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        position="relative"
        zIndex={1}
      >
        {/* Ícone de aviso */}
        <Box position="relative">
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width={{ base: "120px", md: "160px" }}
            height={{ base: "120px", md: "160px" }}
            borderRadius="full"
            bg="orange.100"
            _dark={{ bg: "orange.900", opacity: 0.2 }}
            filter="blur(20px)"
          />
          <Icon
            as={MdWarning}
            w={{ base: 24, md: 32 }}
            h={{ base: 24, md: 32 }}
            color="orange.500"
            _dark={{ color: "orange.400" }}
            position="relative"
          />
        </Box>

        {/* Título */}
        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="semibold"
          color="gray.800"
          _dark={{ color: "gray.100" }}
        >
          Ops! Algo Deu Errado
        </Heading>

        {/* Descrição */}
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="gray.600"
          _dark={{ color: "gray.300" }}
          lineHeight="1.8"
          px={{ base: 0, md: 4 }}
        >
          Encontramos um erro inesperado durante a execução.
          <br />
          Tente novamente ou volte para a página inicial.
        </Text>

        {/* Detalhes do erro (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === "development" && (
          <Box
            w="full"
            p={4}
            bg="gray.50"
            _dark={{ bg: "gray.900" }}
            borderRadius="md"
            borderLeft="4px solid"
            borderColor="orange.500"
            textAlign="left"
          >
            <Text 
              fontSize="sm" 
              fontWeight="semibold" 
              color="gray.700"
              _dark={{ color: "gray.200" }}
              mb={2}
            >
              Detalhes do erro (DEV):
            </Text>
            <Text 
              fontSize="xs" 
              color="gray.600"
              _dark={{ color: "gray.400" }}
              fontFamily="mono"
              wordBreak="break-word"
            >
              {error.message}
            </Text>
            {error.digest && (
              <Text 
                fontSize="xs" 
                color="gray.500"
                _dark={{ color: "gray.500" }}
                mt={2}
              >
                Digest: {error.digest}
              </Text>
            )}
          </Box>
        )}

        {/* Botões de ação */}
        <VStack spacing={3} w="full" pt={4}>
          <Button
            onClick={() => reset()}
            leftIcon={<MdRefresh />}
            colorScheme="orange"
            size={{ base: "md", md: "lg" }}
            w="full"
            maxW="300px"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "lg",
            }}
            transition="all 0.2s"
          >
            Tentar Novamente
          </Button>

          <Button
            as={Link}
            href="/home"
            leftIcon={<MdHome />}
            variant="ghost"
            colorScheme="orange"
            size={{ base: "sm", md: "md" }}
            _hover={{
              bg: "orange.50",
              _dark: { bg: "orange.900", opacity: 0.3 },
            }}
            transition="all 0.2s"
          >
            Voltar para Home
          </Button>
        </VStack>

        {/* Mensagem adicional */}
        <Box
          bg="orange.50"
          px={6}
          py={3}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="orange.200"
          _dark={{ bg: "orange.900", opacity: 0.3, borderColor: "orange.700" }}
          mt={4}
        >
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="orange.700"
            _dark={{ color: "orange.300" }}
          >
            Se o problema persistir, entre em contato com o suporte técnico.
          </Text>
        </Box>
      </VStack>
    </Flex>
  );
}
