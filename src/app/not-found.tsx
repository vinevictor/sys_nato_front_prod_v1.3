"use client";

import Link from "next/link";
import { Box, Flex, Heading, Text, Button, VStack, Icon } from "@chakra-ui/react";
import { MdSearchOff, MdHome, MdArrowBack } from "react-icons/md";

/**
 * Componente de página não encontrada (404)
 * 
 * Exibido quando o usuário tenta acessar uma rota que não existe
 * no sistema. Oferece navegação para home ou login.
 * 
 * @returns Componente de página 404
 */
export default function NotFound() {
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
        top="-50%"
        right="-10%"
        width="600px"
        height="600px"
        borderRadius="full"
        bg="blue.50"
        _dark={{ bg: "blue.900", opacity: 0.1 }}
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
        bg="purple.50"
        _dark={{ bg: "purple.900", opacity: 0.1 }}
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
        {/* Ícone de busca */}
        <Box position="relative">
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width={{ base: "120px", md: "160px" }}
            height={{ base: "120px", md: "160px" }}
            borderRadius="full"
            bg="blue.100"
            _dark={{ bg: "blue.900", opacity: 0.2 }}
            filter="blur(20px)"
          />
          <Icon
            as={MdSearchOff}
            w={{ base: 24, md: 32 }}
            h={{ base: 24, md: 32 }}
            color="blue.500"
            _dark={{ color: "blue.400" }}
            position="relative"
          />
        </Box>

        {/* Código de erro */}
        <Heading
          fontSize={{ base: "6xl", md: "8xl" }}
          fontWeight="bold"
          color="blue.600"
          _dark={{ color: "blue.400" }}
          lineHeight="1"
          letterSpacing="tight"
        >
          404
        </Heading>

        {/* Título */}
        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="semibold"
          color="gray.800"
          _dark={{ color: "gray.100" }}
        >
          Página Não Encontrada
        </Heading>

        {/* Descrição */}
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="gray.600"
          _dark={{ color: "gray.300" }}
          lineHeight="1.8"
          px={{ base: 0, md: 4 }}
        >
          Desculpe, não conseguimos encontrar a página que você está procurando.
          <br />
          Verifique o endereço ou retorne para a página inicial.
        </Text>

        {/* Botões de ação */}
        <VStack spacing={3} w="full" pt={4}>
          <Button
            as={Link}
            href="/home"
            leftIcon={<MdHome />}
            colorScheme="blue"
            size={{ base: "md", md: "lg" }}
            w="full"
            maxW="300px"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "lg",
            }}
            transition="all 0.2s"
          >
            Voltar para Home
          </Button>

          <Button
            as={Link}
            href="/login"
            leftIcon={<MdArrowBack />}
            variant="ghost"
            colorScheme="blue"
            size={{ base: "sm", md: "md" }}
            _hover={{
              bg: "blue.50",
              _dark: { bg: "blue.900", opacity: 0.3 },
            }}
            transition="all 0.2s"
          >
            Ir para Login
          </Button>
        </VStack>

        {/* Mensagem adicional */}
        <Box
          bg="blue.50"
          px={6}
          py={3}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="blue.200"
          _dark={{ bg: "blue.900", opacity: 0.3, borderColor: "blue.700" }}
          mt={4}
        >
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="blue.700"
            _dark={{ color: "blue.300" }}
          >
            Se o problema persistir, entre em contato com o suporte.
          </Text>
        </Box>
      </VStack>
    </Flex>
  );
}
