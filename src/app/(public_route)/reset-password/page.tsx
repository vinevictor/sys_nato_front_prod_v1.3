"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  Text,
  VStack,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  MdCheckCircle,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const toast = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        title: "Link inválido",
        description: "O link de recuperação parece estar quebrado.",
        status: "error",
        duration: 5000,
      });
      router.push("/login");
    }
  }, [token, router, toast]);

  const labelColor = useColorModeValue("gray.700", "gray.300");
  const inputBg = useColorModeValue("white", "gray.800");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  const inputFocusBorder = useColorModeValue("#00713D", "green.500");
  const buttonBg = useColorModeValue("#00713D", "#00d672");
  const buttonHoverBg = useColorModeValue("#005a31", "#00c060");
  const buttonColor = useColorModeValue("white", "gray.900");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter no mínimo 6 caracteres.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir senha.");
      }

      setIsSuccess(true);
      toast({
        title: "Sucesso!",
        description: "Sua senha foi alterada.",
        status: "success",
        duration: 3000,
      });

      // Redireciona após 3 segundos
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <VStack spacing={4} textAlign="center">
        <Icon as={MdCheckCircle} w={20} h={20} color="green.500" />
        <Heading fontSize="2xl" color={useColorModeValue("gray.800", "white")}>
          Senha Alterada!
        </Heading>
        <Text color={useColorModeValue("gray.600", "gray.300")}>
          Você será redirecionado para o login em instantes...
        </Text>
        <Button
          onClick={() => router.push("/login")}
          colorScheme="green"
          variant="outline"
        >
          Ir para Login agora
        </Button>
      </VStack>
    );
  }

  return (
    <Box width="100%" as="form" onSubmit={handleSubmit}>
      <VStack spacing={5}>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium" color={labelColor}>
            Nova Senha
          </FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg={inputBg}
              borderColor={inputBorder}
              _focus={{ borderColor: inputFocusBorder }}
              placeholder="Mínimo 6 caracteres"
            />
            <InputRightElement width="3rem">
              <Button
                h="1.5rem"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
              >
                <Icon
                  as={showPassword ? MdVisibilityOff : MdVisibility}
                  color="gray.500"
                />
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium" color={labelColor}>
            Confirmar Senha
          </FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            bg={inputBg}
            borderColor={inputBorder}
            _focus={{ borderColor: inputFocusBorder }}
            placeholder="Digite novamente"
          />
        </FormControl>

        <Button
          type="submit"
          width="100%"
          size="lg"
          bg={buttonBg}
          color={buttonColor}
          isLoading={loading}
          loadingText="Salvando..."
          _hover={{ bg: buttonHoverBg }}
          leftIcon={<MdLock />}
        >
          DEFINIR NOVA SENHA
        </Button>
      </VStack>
    </Box>
  );
}

export default function ResetPasswordPage() {
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const showSideImage = useBreakpointValue(
    { base: false, lg: true },
    { ssr: true }
  );
  const { colorMode } = useColorMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && colorMode === "dark";
  const bgColor = isDark ? "gray.800" : "white";
  const decorBg1 = isDark ? "rgba(0, 214, 114, 0.1)" : "rgba(0, 113, 61, 0.05)";
  const decorBg2 = isDark
    ? "rgba(0, 214, 114, 0.12)"
    : "rgba(0, 113, 61, 0.08)";

  return (
    <Flex height="100vh" overflow="hidden">
      {/* Painel Lateral */}
      {showSideImage && (
        <Box
          flex={{ base: "0 0 auto", lg: "0 0 30%" }}
          position="relative"
          display={{ base: "none", lg: "block" }}
        >
          {!imageLoaded && <Skeleton width="100%" height="100%" />}
          <Box
            position="relative"
            width="100%"
            height="100%"
            opacity={imageLoaded ? 1 : 0}
            transition="opacity 0.3s"
          >
            <Image
              src="/formulario-de-preenchimento.jpg"
              alt="Reset Password"
              fill
              style={{ objectFit: "cover" }}
              onLoad={() => setImageLoaded(true)}
            />
            <Box
              position="absolute"
              inset="0"
              bg={
                isDark
                  ? "linear-gradient(135deg, rgba(0, 214, 114, 0.1), rgba(0, 192, 96, 0.25))"
                  : "linear-gradient(135deg, rgba(0, 113, 61, 0.15), rgba(0, 90, 49, 0.35))"
              }
            />
          </Box>
        </Box>
      )}

      {/* Painel Principal */}
      <Flex
        flex="1"
        direction="column"
        justify="center"
        align="center"
        bg={bgColor}
        px={6}
        position="relative"
      >
        <VStack spacing={8} width="100%" maxWidth="400px">
          <Box textAlign="center">
            <Box
              position="relative"
              width={{ base: "120px", md: "150px" }}
              height={{
                base: isDark ? "160px" : "120px",
                md: isDark ? "180px" : "150px",
              }}
              mx="auto"
              mb="8"
              transition="opacity 0.3s ease-in-out"
            >
              {mounted && (
                <Image
                  src={
                    isDark ? "/sisnatologo_light.png" : "/sisnatologo_dark.png"
                  }
                  alt="Logo SISNATO"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  quality={90}
                  sizes="(max-width: 768px) 120px, 150px"
                />
              )}
            </Box>
            <Heading
              fontSize="2xl"
              mb={2}
              color={useColorModeValue("#023147", "gray.100")}
            >
              Nova Senha
            </Heading>
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Crie uma senha forte e segura.
            </Text>
          </Box>

          {/* Suspense é necessário para usar useSearchParams no Next.js */}
          <Suspense
            fallback={
              <Skeleton height="200px" width="100%" borderRadius="md" />
            }
          >
            <ResetPasswordContent />
          </Suspense>
        </VStack>

        {/* Decoração de fundo */}
        <Box
          position="absolute"
          top="-50px"
          right="-50px"
          width="200px"
          height="200px"
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
          width="150px"
          height="150px"
          borderRadius="full"
          bg={decorBg2}
          filter="blur(50px)"
          opacity={0.5}
          zIndex="-1"
        />
      </Flex>
    </Flex>
  );
}
