"use client";
import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      p={8}
    >
      <Box textAlign="center" maxW="500px">
        <Image
          src="/images/access-denied.svg"
          alt="Acesso Negado"
          width="200px"
          height="200px"
          mx="auto"
          mb={8}
          fallback={
            <Box
              width="200px"
              height="200px"
              bg="red.100"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={8}
            >
              <Text fontSize="6xl" color="red.500">
                🚫
              </Text>
            </Box>
          }
        />

        <Heading
          fontSize="3xl"
          fontWeight="bold"
          color="red.600"
          mb={4}
        >
          Acesso Negado
        </Heading>

        <Text
          fontSize="lg"
          color="gray.600"
          mb={6}
          lineHeight="1.6"
        >
          Você não tem permissão para acessar esta página.
          <br />
          Verifique suas credenciais ou entre em contato com o administrador.
        </Text>

        <Text
          fontSize="md"
          color="gray.500"
          fontWeight="medium"
        >
          Redirecionando para a página inicial em {countdown} segundo{countdown !== 1 ? 's' : ''}...
        </Text>
      </Box>
    </Flex>
  );
}