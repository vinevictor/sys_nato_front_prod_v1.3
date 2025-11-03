"use client";

import {
  Input,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Flex,
  VStack,
  Box,
  Portal,
  Heading,
  Text,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdAutorenew, MdLogin } from "react-icons/md";
import { SenhaComponent } from "../Senha";

/**
 * Componente responsável por renderizar o formulário de login e orquestrar a autenticação do usuário.
 */
export const FormLogin = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  // Cores dinâmicas baseadas no tema (padrão do sistema)
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const inputBg = useColorModeValue("white", "gray.800");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  const inputHoverBorder = useColorModeValue("#00713D", "green.500");
  const inputFocusBorder = useColorModeValue("#00713D", "green.500");
  const buttonBg = useColorModeValue("#00713D", "#00d672");
  const buttonHoverBg = useColorModeValue("#005a31", "#00c060");
  const buttonColor = useColorModeValue("white", "gray.900");
  const bgColor = useColorModeValue("green.50", "green.900");
  const bgOpacity = useColorModeValue(0.3, 0.1);

  /**
   * Função responsável por executar o fluxo de autenticação, incluindo a coleta de IP e geolocalização e o envio seguro dos dados ao backend.
   */
  const handlesubmit = async () => {
    setLoading(true);

    try {
      const geoResponse = await fetch("/api/utils/geolocation", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const geoData = await geoResponse.json().catch(() => ({ ip: null, geolocation: null }));
      const payload = {
        username,
        password,
        ip: geoData?.ip ?? null,
        geolocation: geoData?.geolocation ?? null,
      };

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Não foi possível autenticar.");
      }

      router.replace("/home");
    } catch (error) {
      console.error("Erro durante a autenticação:", error);
      toast({
        title: "Erro inesperado!",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível concluir o login. Tente novamente em instantes.",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading state sofisticado com Portal */}
      {loading && (
        <Portal>
          <Flex
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            direction="column"
            align="center"
            justify="center"
            bg="blackAlpha.800"
            backdropFilter="blur(10px)"
            zIndex={9999}
            p={{ base: 4, md: 8 }}
            overflow="hidden"
          >
            {/* Efeito de fundo decorativo */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width={{ base: "400px", md: "600px" }}
              height={{ base: "400px", md: "600px" }}
              borderRadius="full"
              bg={bgColor}
              opacity={bgOpacity}
              filter="blur(100px)"
              pointerEvents="none"
            />

            <VStack
              spacing={{ base: 6, md: 8 }}
              textAlign="center"
              maxW={{ base: "90%", md: "500px" }}
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
              {/* Ícone animado */}
              <Box position="relative">
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  width={{ base: "120px", md: "160px" }}
                  height={{ base: "120px", md: "160px" }}
                  borderRadius="full"
                  bg="green.100"
                  _dark={{ bg: "green.900", opacity: 0.2 }}
                  filter="blur(20px)"
                />
                <Icon
                  as={MdAutorenew}
                  w={{ base: 20, md: 24 }}
                  h={{ base: 20, md: 24 }}
                  color="green.500"
                  _dark={{ color: "green.400" }}
                  position="relative"
                  animation="spin 2s linear infinite"
                />
              </Box>

              {/* Título */}
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="semibold"
                color="gray.800"
                _dark={{ color: "gray.100" }}
              >
                Autenticando
              </Heading>

              {/* Descrição */}
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.600"
                _dark={{ color: "gray.300" }}
                lineHeight="1.8"
              >
                Aguarde enquanto validamos suas credenciais
              </Text>

              {/* Mensagem adicional */}
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.500"
                _dark={{ color: "gray.400" }}
              >
                Isso não deve demorar muito...
              </Text>
            </VStack>

            {/* Keyframes para animação */}
            <style>
              {`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}
            </style>
          </Flex>
        </Portal>
      )}

      {/* Formulário seguindo padrões documentados */}
      <VStack spacing={6} align="stretch" w="full">
        <FormControl isRequired>
          <FormLabel
            fontSize="sm"
            fontWeight="medium"
            color={labelColor}
            mb={2}
          >
            Usuário
          </FormLabel>
          <Input
            type="text"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e: any) => setUsername(e.target.value.toUpperCase())}
            bg={inputBg}
            borderColor={inputBorder}
            textTransform="uppercase"
            size="lg"
            _hover={{ borderColor: inputHoverBorder }}
            _focus={{
              borderColor: inputFocusBorder,
              boxShadow: `0 0 0 1px ${inputFocusBorder}`,
            }}
            _dark={{ bg: "gray.800", borderColor: "gray.600" }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel
            fontSize="sm"
            fontWeight="medium"
            color={labelColor}
            mb={2}
          >
            Senha
          </FormLabel>
          <SenhaComponent
            setvalue={password}
            onvalue={(e: any) => setPassword(e)}
            envClick={handlesubmit}
          />
        </FormControl>

        <Button
          leftIcon={<MdLogin />}
          type="submit"
          width="100%"
          size="lg"
          bg={buttonBg}
          color={buttonColor}
          fontSize="md"
          fontWeight="600"
          onClick={handlesubmit}
          transition="all 0.2s"
          _hover={{
            bg: buttonHoverBg,
            transform: "translateY(-2px)",
            shadow: "lg",
          }}
          _active={{
            transform: "translateY(0)",
          }}
        >
          ACESSAR
        </Button>
      </VStack>
    </>
  );
};
