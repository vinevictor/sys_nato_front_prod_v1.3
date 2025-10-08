"use client";

import { useEffect } from "react";
import { Box, Flex, Heading, Text, Button, VStack, Container, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiRefreshCw, FiHome } from "react-icons/fi";
import Link from "next/link";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

/**
 * Componente de erro global da aplicação
 * Este componente é exibido automaticamente quando ocorre um erro não tratado
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
      w="full"
      minH="100vh"
      align="center"
      justify="center"
      bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Background decorativo */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="whiteAlpha.200"
        filter="blur(100px)"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="whiteAlpha.200"
        filter="blur(120px)"
      />

      <Container maxW="container.md" py={10}>
        <MotionFlex
          direction="column"
          align="center"
          justify="center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Card principal */}
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="2xl"
            p={{ base: 8, md: 12, lg: 16 }}
            maxW="600px"
            w="full"
            position="relative"
            overflow="hidden"
          >
            {/* Decoração do card */}
            <Box
              position="absolute"
              top="-50px"
              right="-50px"
              w="150px"
              h="150px"
              borderRadius="full"
              bg="red.50"
              opacity={0.5}
            />

            <VStack spacing={6} textAlign="center">
              {/* Ícone de erro animado */}
              <MotionBox
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  w={{ base: "100px", md: "120px" }}
                  h={{ base: "100px", md: "120px" }}
                  borderRadius="full"
                  bg="red.50"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={4}
                >
                  <Text fontSize={{ base: "4xl", md: "5xl" }} role="img" aria-label="erro">
                    😕
                  </Text>
                </Box>
              </MotionBox>

              {/* Título */}
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Heading
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  bgGradient="linear(to-r, red.600, pink.500)"
                  bgClip="text"
                  letterSpacing="tight"
                  mb={2}
                >
                  Ops! Algo deu errado
                </Heading>
              </MotionBox>

              {/* Descrição */}
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                w="full"
              >
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="gray.600"
                  maxW="400px"
                  mx="auto"
                >
                  Encontramos um erro inesperado. Tente novamente ou volte para a página inicial.
                </Text>

                {/* Detalhes do erro (apenas em desenvolvimento) */}
                {process.env.NODE_ENV === "development" && (
                  <Box
                    mt={4}
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor="red.500"
                    textAlign="left"
                  >
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={1}>
                      Detalhes do erro:
                    </Text>
                    <Text fontSize="xs" color="gray.600" fontFamily="mono">
                      {error.message}
                    </Text>
                    {error.digest && (
                      <Text fontSize="xs" color="gray.500" mt={2}>
                        Digest: {error.digest}
                      </Text>
                    )}
                  </Box>
                )}
              </MotionBox>

              {/* Botões de ação */}
              <MotionBox
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                w="full"
                pt={4}
              >
                <VStack spacing={3} w="full">
                  <Button
                    onClick={() => reset()}
                    size="lg"
                    w="full"
                    maxW="300px"
                    colorScheme="red"
                    bgGradient="linear(to-r, red.500, pink.500)"
                    _hover={{
                      bgGradient: "linear(to-r, red.600, pink.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s"
                    leftIcon={<Icon as={FiRefreshCw} />}
                  >
                    Tentar Novamente
                  </Button>

                  <Button
                    as={Link}
                    href="/home"
                    size="md"
                    variant="ghost"
                    colorScheme="red"
                    leftIcon={<Icon as={FiHome} />}
                    _hover={{
                      bg: "red.50",
                      transform: "translateX(-2px)",
                    }}
                    transition="all 0.2s"
                  >
                    Voltar para Home
                  </Button>
                </VStack>
              </MotionBox>

              {/* Mensagem adicional */}
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                pt={4}
              >
                <Text fontSize="sm" color="gray.500">
                  Se o problema persistir, entre em contato com o suporte técnico.
                </Text>
              </MotionBox>
            </VStack>
          </Box>
        </MotionFlex>
      </Container>
    </Flex>
  );
}
