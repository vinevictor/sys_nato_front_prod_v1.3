"use client";
import { Box, Button, Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdError, MdHome } from "react-icons/md";

/**
 * Componente de página de erro 404
 * 
 * Exibe uma mensagem de acesso negado quando o usuário tenta
 * acessar uma página sem permissão. Redireciona automaticamente
 * para a home após 5 segundos.
 * 
 * @returns Componente de erro 404
 */
export default function Error404() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/home");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

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
        {/* Ícone de erro */}
        <Box
          position="relative"
          mb={2}
        >
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width={{ base: "120px", md: "160px" }}
            height={{ base: "120px", md: "160px" }}
            borderRadius="full"
            bg="red.100"
            _dark={{ bg: "red.900", opacity: 0.2 }}
            filter="blur(20px)"
          />
          <Icon
            as={MdError}
            w={{ base: 24, md: 32 }}
            h={{ base: 24, md: 32 }}
            color="red.500"
            _dark={{ color: "red.400" }}
            position="relative"
          />
        </Box>

        {/* Código de erro */}
        <Heading
          fontSize={{ base: "6xl", md: "8xl" }}
          fontWeight="bold"
          color="red.600"
          _dark={{ color: "red.400" }}
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
          Acesso Negado
        </Heading>

        {/* Descrição */}
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="gray.600"
          _dark={{ color: "gray.300" }}
          lineHeight="1.8"
          px={{ base: 0, md: 4 }}
        >
          Você não tem permissão para acessar esta página.
          <br />
          Verifique suas credenciais ou entre em contato com o administrador.
        </Text>

        {/* Contador de redirecionamento */}
        <Box
          bg="red.50"
          px={6}
          py={3}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="red.200"
          _dark={{ bg: "red.900", opacity: 0.3, borderColor: "red.700" }}
        >
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="red.700"
            _dark={{ color: "red.300" }}
            fontWeight="medium"
          >
            Redirecionando para a página inicial em{" "}
            <Text as="span" fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
              {countdown}
            </Text>{" "}
            segundo{countdown !== 1 ? "s" : ""}...
          </Text>
        </Box>

        {/* Botão de ação manual */}
        <Button
          leftIcon={<MdHome />}
          colorScheme="red"
          size={{ base: "md", md: "lg" }}
          onClick={() => router.push("/home")}
          mt={2}
          _hover={{
            transform: "translateY(-2px)",
            shadow: "lg",
          }}
          transition="all 0.2s"
        >
          Ir para Página Inicial
        </Button>
      </VStack>
    </Flex>
  );
}