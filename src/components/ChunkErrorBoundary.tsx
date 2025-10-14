"use client";

import { Component, ReactNode } from "react";
import { Box, Button, Flex, Heading, Icon, Spinner, Text, VStack } from "@chakra-ui/react";
import { MdRefresh, MdWarning, MdAutorenew } from "react-icons/md";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

/**
 * Componente Error Boundary para captura de erros
 * 
 * Detecta erros de chunk (quando há nova versão do app)
 * e erros gerais da aplicação, exibindo mensagens apropriadas
 * e permitindo recuperação.
 */
class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Detecta se é um erro de chunk
    const isChunkError =
      error.name === "ChunkLoadError" ||
      error.message.includes("Loading chunk") ||
      error.message.includes("Failed to fetch dynamically imported module");

    return { hasError: true, isChunkError };
  }

  componentDidCatch(error: Error) {
    console.error("Error caught by boundary:", error);

    // Se for erro de chunk, recarrega a página automaticamente após 1 segundo
    if (this.state.isChunkError) {
      console.log("ChunkLoadError detectado, recarregando página...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      // Tela de atualização (quando há nova versão)
      if (this.state.isChunkError) {
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
              top="-30%"
              left="-10%"
              width="500px"
              height="500px"
              borderRadius="full"
              bg="green.50"
              _dark={{ bg: "green.900", opacity: 0.1 }}
              opacity={0.3}
              filter="blur(80px)"
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
              {/* Ícone de atualização animado */}
              <Box position="relative">
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  width={{ base: "100px", md: "140px" }}
                  height={{ base: "100px", md: "140px" }}
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
                Atualizando Aplicação
              </Heading>

              {/* Descrição */}
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.600"
                _dark={{ color: "gray.300" }}
                lineHeight="1.8"
              >
                Uma nova versão está disponível e será carregada automaticamente.
              </Text>

              {/* Spinner */}
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="green.500"
                size="lg"
              />

              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.500"
                _dark={{ color: "gray.400" }}
              >
                Aguarde enquanto recarregamos a página...
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
        );
      }

      // Tela de erro geral
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
            left="50%"
            transform="translateX(-50%)"
            width="600px"
            height="600px"
            borderRadius="full"
            bg="orange.50"
            _dark={{ bg: "orange.900", opacity: 0.1 }}
            opacity={0.3}
            filter="blur(100px)"
            pointerEvents="none"
          />

          <VStack
            spacing={{ base: 6, md: 8 }}
            textAlign="center"
            maxW={{ base: "90%", md: "550px" }}
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
              Algo Deu Errado
            </Heading>

            {/* Descrição */}
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.600"
              _dark={{ color: "gray.300" }}
              lineHeight="1.8"
              px={{ base: 0, md: 4 }}
            >
              Ocorreu um erro inesperado durante a execução da aplicação.
              <br />
              Por favor, tente recarregar a página.
            </Text>

            {/* Mensagem adicional */}
            <Box
              bg="orange.50"
              px={6}
              py={3}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="orange.200"
              _dark={{ bg: "orange.900", opacity: 0.3, borderColor: "orange.700" }}
              w="full"
            >
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="orange.700"
                _dark={{ color: "orange.300" }}
              >
                Se o problema persistir, entre em contato com o suporte.
              </Text>
            </Box>

            {/* Botão de recarregar */}
            <Button
              leftIcon={<MdRefresh />}
              colorScheme="orange"
              size={{ base: "md", md: "lg" }}
              onClick={() => window.location.reload()}
              mt={2}
              _hover={{
                transform: "translateY(-2px)",
                shadow: "lg",
              }}
              transition="all 0.2s"
            >
              Recarregar Página
            </Button>
          </VStack>
        </Flex>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
