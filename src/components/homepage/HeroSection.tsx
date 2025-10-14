"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaFileSignature, FaShieldAlt } from "react-icons/fa";

export default function HeroSection() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      position="relative"
      overflow="hidden"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      boxShadow={"md"}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage="url('/heroimage.jpg')"
        bgSize="cover"
        bgPosition="center"
        opacity={0.1}
      />

      <Container maxW="7xl" position="relative" zIndex={1}>
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={8}
          alignItems="center"
        >
          <GridItem>
            <VStack align="flex-start" spacing={6}>
              <Heading
                size="2xl"
                color="gray.800"
                _dark={{ color: "white" }}
                lineHeight="1.2"
                fontWeight="bold"
              >
                Gestão Digital
                <br />
                de Documentos Imobiliários
              </Heading>

              <Text
                fontSize="xl"
                color="gray.600"
                _dark={{ color: "gray.300" }}
                maxW="md"
              >
                Agilidade, segurança e confiabilidade na assinatura digital de
                documentos de compra, venda e aluguel de imóveis
              </Text>

              <VStack spacing={4} align="stretch" w="full" maxW="md">
                <Button
                  as="a"
                  href="https://wa.me/5516992800713?text=Olá! Gostaria de conhecer mais sobre o SisNATO..."
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="green"
                  size="lg"
                  w="full"
                  leftIcon={<Icon as={FaFileSignature} />}
                >
                  Começar Agora
                </Button>

                <Button
                  as="a"
                  href="https://wa.me/5516992800713?text=Olá! Tenho interesse em falar com um especialista..."
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="lg"
                  w="full"
                  // Estilo do botão para o tema claro
                  colorScheme="gray"
                  // Estilo do botão para o tema escuro
                  _dark={{
                    colorScheme: "white",
                    color: "white",
                    borderColor: "white",
                    _hover: { bg: "whiteAlpha.200" },
                  }}
                  leftIcon={<Icon as={FaShieldAlt} />}
                >
                  Falar com Especialista
                </Button>
              </VStack>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
