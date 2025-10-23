"use client";

import { FormLogin } from "@/components/login_form";
import {
  Flex,
  Box,
  Text,
  Link,
  VStack,
  useBreakpointValue,
  useColorMode,
  Skeleton,
} from "@chakra-ui/react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const showSideImage = useBreakpointValue({ base: false, lg: true }, { ssr: true });
  const { colorMode } = useColorMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evita FOUC - define cores baseadas no modo atual após montagem
  const isDark = mounted && colorMode === "dark";

  // Cores dinâmicas baseadas no tema (seguindo padrões do sistema)
  const bgColor = isDark ? "gray.800" : "white";
  const textColor = isDark ? "gray.100" : "#023147";
  const subtextColor = isDark ? "gray.400" : "gray.600";
  const linkColor = isDark ? "green.400" : "#00713D";
  const linkHoverColor = isDark ? "green.300" : "#005a31";
  const decorBg1 = isDark
    ? "linear-gradient(135deg, rgba(0, 214, 114, 0.1) 0%, rgba(0, 192, 96, 0.2) 100%)"
    : "linear-gradient(135deg, rgba(0, 113, 61, 0.05) 0%, rgba(0, 214, 114, 0.1) 100%)";
  const decorBg2 = isDark
    ? "linear-gradient(135deg, rgba(0, 214, 114, 0.12) 0%, rgba(0, 192, 96, 0.18) 100%)"
    : "linear-gradient(135deg, rgba(0, 113, 61, 0.08) 0%, rgba(0, 90, 49, 0.12) 100%)";

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
          {!imageLoaded && (
            <Skeleton
              width="100%"
              height="100%"
              startColor={isDark ? "gray.700" : "gray.200"}
              endColor={isDark ? "gray.600" : "gray.300"}
            />
          )}
          <Box
            position="relative"
            width="100%"
            height="100%"
            opacity={imageLoaded ? 1 : 0}
            transition="opacity 0.3s ease-in-out"
          >
            <Image
              src="/formulario-de-preenchimento.jpg"
              alt="Formulário de Preenchimento"
              fill
              style={{ objectFit: "cover" }}
              priority
              quality={85}
              sizes="30vw"
              onLoad={() => setImageLoaded(true)}
            />
            {/* Overlay com gradiente sutil - usando cores primárias */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg={
                isDark
                  ? "linear-gradient(135deg, rgba(0, 214, 114, 0.1) 0%, rgba(0, 192, 96, 0.25) 100%)"
                  : "linear-gradient(135deg, rgba(0, 113, 61, 0.15) 0%, rgba(0, 90, 49, 0.35) 100%)"
              }
            />
          </Box>
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
            {!mounted ? (
              // Skeleton durante SSR/hidratação
              <Skeleton
                width={{ base: "120px", md: "150px" }}
                height={{ base: "120px", md: "150px" }}
                borderRadius="md"
                mx="auto"
                mb="8"
                startColor={isDark ? "gray.700" : "gray.200"}
                endColor={isDark ? "gray.600" : "gray.300"}
              />
            ) : (
              <Box
                position="relative"
                width={{ base: "120px", md: "150px" }}
                height={{ base: isDark ? "160px" : "120px", md: isDark ? "180px" : "150px" }}
                mx="auto"
                mb="8"
                opacity={logoLoaded ? 1 : 0}
                transition="opacity 0.3s ease-in-out"
              >
                {!logoLoaded && (
                  <Skeleton
                    position="absolute"
                    width="100%"
                    height="100%"
                    borderRadius="md"
                    startColor={isDark ? "gray.700" : "gray.200"}
                    endColor={isDark ? "gray.600" : "gray.300"}
                  />
                )}
                <Image
                  src={isDark ? "/sisnatologo_light.png" : "/sisnatologo_dark.png"}
                  alt="Logo SISNATO"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  quality={90}
                  sizes="(max-width: 768px) 120px, 150px"
                  onLoad={() => setLogoLoaded(true)}
                />
              </Box>
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
