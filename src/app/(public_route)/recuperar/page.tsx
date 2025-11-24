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
  InputLeftElement,
  Link,
  Skeleton,
  Text,
  VStack,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowBack, MdEmail, MdSend, MdCheckCircle } from "react-icons/md";

export default function RecuperarPage() {
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Estados do Formulário
  const [login, setLogin] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const showSideImage = useBreakpointValue(
    { base: false, lg: true },
    { ssr: true }
  );
  const { colorMode } = useColorMode();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Estilos Dinâmicos (Mesmos do Login) ---
  const isDark = mounted && colorMode === "dark";
  const bgColor = isDark ? "gray.800" : "white";
  const textColor = isDark ? "gray.100" : "#023147";
  const subtextColor = isDark ? "gray.400" : "gray.600";
  const linkColor = isDark ? "green.400" : "#00713D";

  // Input styles
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const inputBg = useColorModeValue("white", "gray.800");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  const inputFocusBorder = useColorModeValue("#00713D", "green.500");
  const buttonBg = useColorModeValue("#00713D", "#00d672");
  const buttonHoverBg = useColorModeValue("#005a31", "#00c060");
  const buttonColor = useColorModeValue("white", "gray.900");

  const decorBg1 = isDark
    ? "linear-gradient(135deg, rgba(0, 214, 114, 0.1) 0%, rgba(0, 192, 96, 0.2) 100%)"
    : "linear-gradient(135deg, rgba(0, 113, 61, 0.05) 0%, rgba(0, 214, 114, 0.1) 100%)";
  const decorBg2 = isDark
    ? "linear-gradient(135deg, rgba(0, 214, 114, 0.12) 0%, rgba(0, 192, 96, 0.18) 100%)"
    : "linear-gradient(135deg, rgba(0, 113, 61, 0.08) 0%, rgba(0, 90, 49, 0.12) 100%)";

  // --- Lógica de Envio ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login) return;

    setLoading(true);

    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login }),
        }
      );

      const data = await req.json();

      if (!req.ok) {
        throw new Error(data.message || "Erro ao solicitar recuperação.");
      }

      // Sucesso!
      setIsSuccess(true);
      toast({
        title: "Link enviado!",
        description: "Verifique sua caixa de entrada.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível conectar ao servidor.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex height="100vh" overflow="hidden">
      {/* Painel Lateral (Imagem) */}
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
            {/* Reutilizando a mesma imagem do login para consistência */}
            <Image
              src="/formulario-de-preenchimento.jpg"
              alt="Recuperação de Senha"
              fill
              style={{ objectFit: "cover" }}
              priority
              quality={85}
              sizes="30vw"
              onLoad={() => setImageLoaded(true)}
            />
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

      {/* Painel de Conteúdo */}
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
          {/* Logo (Pequeno) */}
          <Box textAlign="center">
            {!mounted ? (
              <Skeleton
                width="100px"
                height="100px"
                mx="auto"
                mb="6"
                borderRadius="md"
              />
            ) : (
              <Box
                position="relative"
                width={{ base: "120px", md: "150px" }}
                height={{
                  base: isDark ? "160px" : "120px",
                  md: isDark ? "180px" : "150px",
                }}
                mx="auto"
                mb="8"
                opacity={logoLoaded ? 1 : 0}
                transition="opacity 0.3s ease-in-out"
              >
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
                  onLoad={() => setLogoLoaded(true)}
                />
              </Box>
            )}

            {/* Títulos */}
            {!isSuccess ? (
              <>
                <Heading
                  fontSize={{ base: "24px", md: "28px" }}
                  fontWeight="600"
                  color={textColor}
                  mb="2"
                >
                  Recuperar Senha
                </Heading>
                <Text fontSize="sm" color={subtextColor} maxW="300px" mx="auto">
                  Informe seu e-mail ou nome de usuário cadastrado para receber
                  o link de redefinição.
                </Text>
              </>
            ) : (
              // Título de Sucesso
              <VStack spacing={3}>
                <Icon as={MdCheckCircle} w={16} h={16} color="green.500" />
                <Heading fontSize="2xl" color={textColor}>
                  Email Enviado!
                </Heading>
                <Text fontSize="md" color={subtextColor}>
                  Verifique a caixa de entrada de <b>{login}</b> (se for um
                  email) ou do email associado ao usuário.
                </Text>
              </VStack>
            )}
          </Box>

          {/* Formulário ou Botão de Voltar */}
          {!isSuccess ? (
            <Box width="100%" as="form" onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="medium"
                    color={labelColor}
                  >
                    E-mail ou Usuário
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={MdEmail} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="seu.email@exemplo.com"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      bg={inputBg}
                      borderColor={inputBorder}
                      _hover={{ borderColor: inputFocusBorder }}
                      _focus={{
                        borderColor: inputFocusBorder,
                        boxShadow: "none",
                      }}
                      size="lg"
                    />
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  width="100%"
                  size="lg"
                  bg={buttonBg}
                  color={buttonColor}
                  isLoading={loading}
                  loadingText="Enviando..."
                  rightIcon={<MdSend />}
                  _hover={{
                    bg: buttonHoverBg,
                    transform: "translateY(-2px)",
                    shadow: "lg",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s"
                >
                  ENVIAR LINK
                </Button>
              </VStack>
            </Box>
          ) : (
            // Ação pós-sucesso
            <Button
              as={NextLink}
              href="/login"
              width="100%"
              size="lg"
              variant="outline"
              colorScheme="green"
              leftIcon={<MdArrowBack />}
            >
              Voltar para o Login
            </Button>
          )}

          {/* Rodapé / Link Voltar (Aparece apenas se não estiver no estado de sucesso) */}
          {!isSuccess && (
            <Link
              as={NextLink}
              href="/login"
              color={subtextColor}
              fontSize="sm"
              display="flex"
              alignItems="center"
              gap={2}
              _hover={{ color: linkColor, textDecoration: "none" }}
            >
              <Icon as={MdArrowBack} />
              Voltar para o login
            </Link>
          )}
        </VStack>

        {/* Decoração de Fundo (Mesma do Login) */}
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
