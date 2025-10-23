"use client";

import { FormLogin } from "@/components/login_form";
import { 
  Flex, 
  Box, 
  Text, 
  Image, 
  Link, 
  VStack,
  useBreakpointValue,
  useColorModeValue 
} from "@chakra-ui/react";

export default function LoginPage() {
  // Controla se deve mostrar a imagem lateral baseado no breakpoint
  const showSideImage = useBreakpointValue({ base: false, lg: true });
  const theme = useColorModeValue("light", "dark");
  
  // Cores dinâmicas baseadas no tema (seguindo padrões do sistema)
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("#023147", "gray.100");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const linkColor = useColorModeValue("#00713D", "green.400");
  const linkHoverColor = useColorModeValue("#005a31", "green.300");
  const decorBg1 = useColorModeValue(
    "linear-gradient(135deg, rgba(0, 113, 61, 0.05) 0%, rgba(0, 214, 114, 0.1) 100%)",
    "linear-gradient(135deg, rgba(0, 214, 114, 0.1) 0%, rgba(0, 192, 96, 0.2) 100%)"
  );
  const decorBg2 = useColorModeValue(
    "linear-gradient(135deg, rgba(0, 113, 61, 0.08) 0%, rgba(0, 90, 49, 0.12) 100%)",
    "linear-gradient(135deg, rgba(0, 214, 114, 0.12) 0%, rgba(0, 192, 96, 0.18) 100%)"
  );
  
  return (
    <Flex height="100vh" overflow="hidden">
      {/* Painel Lateral com Imagem - Visível apenas em telas grandes */}
      {showSideImage && (
        <Box
          flex={{ base: "0 0 auto", lg: "0 0 30%" }}
          position="relative"
          display={{ base: "none", lg: "block" }}
          w={{ base: "100%", lg: "30%" }}
        >
          <Image
            src="/formulario-de-preenchimento.jpg"
            alt="Formulário de Preenchimento"
            objectFit="cover"
            width="100%"
            height="100%"
          />
          {/* Overlay com gradiente sutil - usando cores primárias */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="linear-gradient(135deg, rgba(0, 113, 61, 0.15) 0%, rgba(0, 90, 49, 0.35) 100%)"
            _dark={{
              bg: "linear-gradient(135deg, rgba(0, 214, 114, 0.1) 0%, rgba(0, 192, 96, 0.25) 100%)"
            }}
          />
        </Box>
      )}

      {/* Painel de Login */}
      <Flex
        flex={{ base: "1", lg: "0 0 70%" }}
        direction="column"
        justify="center"
        align="center"
        bg={bgColor}
        px={{ base: "6", md: "8", lg: "12" }}
        py={{ base: "8", md: "12" }}
        position="relative"
        w={{ base: "100%", lg: "70%" }}
      >
        <VStack spacing="8" width="100%" maxWidth="400px">
          {/* Logo */}
          <Box textAlign="center">
            {theme === "light" ? (
              <Image
                src="/sisnatologo_dark.png"
                alt="Logo SISNATO"
                width={{ base: "120px", md: "150px" }}
                height={{ base: "120px", md: "150px" }}
                mx="auto"
                mb="8"
              />
            ) : (
              <Image
                src="/sisnatologo_light.png"
                alt="Logo SISNATO"
                width={{ base: "120px", md: "150px" }}
                height={{ base: "160px", md: "180px" }}
                mx="auto"
                mb="8"
              />
            )}
            <Text
              fontSize={{ base: "28px", md: "32px", lg: "36px" }}
              fontWeight="600"
              color={textColor}
              letterSpacing="-0.5px"
            >
              Bem-vindo
            </Text>
            <Text
              fontSize={{ base: "14px", md: "16px" }}
              color={subtextColor}
              mt="2"
            >
              Faça login para acessar sua conta
            </Text>
          </Box>

          {/* Formulário de Login */}
          <Box width="100%">
            <FormLogin />
          </Box>

          {/* Termos e Política */}
          <Box textAlign="center" mt="6">
            <Text
              fontSize={{ base: "12px", md: "13px" }}
              color={subtextColor}
              lineHeight="1.5"
            >
              Ao continuar, você concorda com os{" "}
              <Link
                href="/termos/uso"
                color={linkColor}
                textDecoration="underline"
                _hover={{ color: linkHoverColor }}
              >
                Termos de uso
              </Link>{" "}
              e{" "}
              <Link
                href="/termos/privacidade"
                color={linkColor}
                textDecoration="underline"
                _hover={{ color: linkHoverColor }}
              >
                Política de Privacidade
              </Link>
              .
            </Text>
          </Box>
        </VStack>

        {/* Decoração de fundo sutil - múltiplos elementos */}
        <Box
          position="absolute"
          top="-50px"
          right="-50px"
          width={{ base: "150px", md: "200px", lg: "250px" }}
          height={{ base: "150px", md: "200px", lg: "250px" }}
          borderRadius="full"
          bg={decorBg1}
          filter="blur(60px)"
          opacity={0.6}
          zIndex="-1"
        />
        <Box
          position="absolute"
          bottom="-30px"
          left="-30px"
          width={{ base: "120px", md: "150px", lg: "180px" }}
          height={{ base: "120px", md: "150px", lg: "180px" }}
          borderRadius="full"
          bg={decorBg2}
          filter="blur(50px)"
          opacity={0.5}
          zIndex="-1"
        />
        <Box
          position="absolute"
          top="40%"
          right="-20px"
          width={{ base: "100px", md: "120px" }}
          height={{ base: "100px", md: "120px" }}
          borderRadius="full"
          bg={decorBg1}
          filter="blur(40px)"
          opacity={0.4}
          zIndex="-1"
        />
      </Flex>
    </Flex>
  );
}
