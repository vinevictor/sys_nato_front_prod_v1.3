"use client";

import { Box, Flex, Heading, Icon, Portal, Text, VStack } from "@chakra-ui/react";
import { MdAutorenew } from "react-icons/md";

interface LoadingOverlayProps {
  isOpen: boolean;
  message?: string;
  submessage?: string;
}

/**
 * Componente de loading overlay de tela cheia
 * Baseado no loading global da aplicação
 * 
 * @param isOpen - Se o loading está visível
 * @param message - Mensagem principal (padrão: "Carregando")
 * @param submessage - Submensagem (padrão: "Aguarde enquanto processamos sua solicitação")
 */
export function LoadingOverlay({ 
  isOpen, 
  message = "Carregando",
  submessage = "Aguarde enquanto processamos sua solicitação"
}: LoadingOverlayProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <Flex
        direction="column"
        align="center"
        justify="center"
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={9999}
        bg="blackAlpha.600"
        backdropFilter="blur(8px)"
        p={{ base: 4, md: 8 }}
        overflow="hidden"
      >
        {/* Efeito de fundo decorativo */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="600px"
          height="600px"
          borderRadius="full"
          bg="green.50"
          _dark={{ bg: "green.900", opacity: 0.1 }}
          opacity={0.3}
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
            {message}
          </Heading>

          {/* Descrição */}
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.600"
            _dark={{ color: "gray.300" }}
            lineHeight="1.8"
          >
            {submessage}
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
  );
}
