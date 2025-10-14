"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaRocket, FaUsers, FaShieldAlt, FaChartLine } from "react-icons/fa";
import NextLink from "next/link";

/**
 * Seção de captação de investimento e simulador
 * Agora com suporte completo para tema claro e escuro.
 */
export default function CaptacaoSection() {
  return (
    <Box
      py={20}
      // Fundo adaptável ao tema
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
    >
      <Container maxW="7xl">
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={12}
          alignItems="center"
        >
          {/* Coluna da Esquerda */}
          <GridItem>
            <VStack align="flex-start" spacing={6}>
              <Heading size="xl" color="gray.800" _dark={{ color: "white" }}>
                Atendimento Especializado
              </Heading>

              <VStack align="flex-start" spacing={4}>
                <HStack>
                  <Icon
                    as={FaRocket}
                    color="green.500"
                    _dark={{ color: "green.400" }}
                  />
                  <Text color="gray.700" _dark={{ color: "white" }}>
                    Processo ágil e descomplicado
                  </Text>
                </HStack>

                <HStack>
                  <Icon
                    as={FaUsers}
                    color="green.500"
                    _dark={{ color: "green.400" }}
                  />
                  <Text color="gray.700" _dark={{ color: "white" }}>
                    Equipe especializada em certificação ICP
                  </Text>
                </HStack>

                <HStack>
                  <Icon
                    as={FaShieldAlt}
                    color="green.500"
                    _dark={{ color: "green.400" }}
                  />
                  <Text color="gray.700" _dark={{ color: "white" }}>
                    Máxima segurança e conformidade
                  </Text>
                </HStack>

                <HStack>
                  <Icon
                    as={FaChartLine}
                    color="green.500"
                    _dark={{ color: "green.400" }}
                  />
                  <Text color="gray.700" _dark={{ color: "white" }}>
                    Suporte completo durante todo o processo
                  </Text>
                </HStack>
              </VStack>

              <Button
                as="a"
                href="https://wa.me/5516992800713?text=Olá! Gostaria de conhecer as funcionalidades do SisNATO e entender como ele pode facilitar minha gestão de documentos imobiliários com segurança."
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="green"
                size="lg"
                w="full"
              >
                Conhecer Funcionalidades
              </Button>
            </VStack>
          </GridItem>

          {/* Coluna da Direita */}
          <GridItem>
            <Box
              bg="white"
              _dark={{
                bg: "gray.800",
                borderColor: "gray.700",
                boxShadow: "none",
              }}
              p={8}
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              boxShadow="md"
            >
              <VStack spacing={6}>
                <Heading
                  size="lg"
                  textAlign="center"
                  color="gray.800"
                  _dark={{ color: "white" }}
                >
                  Agendamento Online
                </Heading>

                <Text
                  textAlign="center"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Agende sua certificação digital de forma rápida e segura
                </Text>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
