"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaChartLine, FaUsers, FaRocket, FaShieldAlt } from "react-icons/fa";

/**
 * Seção de experiência no mercado com estatísticas
 * Agora com suporte para tema claro e escuro.
 */
export default function ExperienciaSection() {
  return (
    <Box
      id="experiencia"
      scrollMarginTop="4rem"
      py={20}
      // Fundo da seção agora é adaptável
      bg="white"
      _dark={{ bg: "gray.900" }}
    >
      <Container maxW="7xl">
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={12}
          alignItems="center"
        >
          <GridItem>
            <VStack align="flex-start" spacing={6}>
              <Heading size="xl" color="gray.800" _dark={{ color: "white" }}>
                Agilidade, Segurança e Confiabilidade
              </Heading>

              <Text
                fontSize="lg"
                color="gray.600"
                _dark={{ color: "gray.300" }}
              >
                O SisNATO oferece gestão completa de documentos imobiliários com
                certificação digital ICP-Brasil, garantindo validade jurídica e
                proteção contra fraudes.
              </Text>

              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
                fontStyle="italic"
              >
                *Certificação ICP-Brasil garante autenticidade, integridade e
                validade jurídica dos documentos assinados digitalmente.
              </Text>
              <Button
                as="a"
                href="https://wa.me/5516992800713?text=Olá! Gostaria de conhecer mais sobre a agilidade, segurança e confiabilidade do SisNATO e como ele pode otimizar minha gestão de documentos imobiliários."
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="green"
                size="lg"
                leftIcon={<Icon as={FaChartLine} />}
              >
                Conhecer o Sistema
              </Button>
            </VStack>
          </GridItem>

          <GridItem>
            <SimpleGrid columns={2} spacing={6}>
              {/* Card 1: Precisão */}
              <VStack
                p={6}
                bg="green.50"
                _dark={{ bg: "blackAlpha.400", borderColor: "gray.700" }}
                borderRadius="lg"
                textAlign="center"
                border="1px"
                borderColor="gray.200"
              >
                <Icon
                  as={FaChartLine}
                  boxSize={8}
                  color="green.500"
                  _dark={{ color: "green.300" }}
                />
                <Heading
                  size="lg"
                  color="green.600"
                  _dark={{ color: "green.300" }}
                >
                  99,8%
                </Heading>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Precisão antifraude
                </Text>
              </VStack>

              {/* Card 2: Documentos */}
              <VStack
                p={6}
                bg="blue.50"
                _dark={{ bg: "blackAlpha.400", borderColor: "gray.700" }}
                borderRadius="lg"
                textAlign="center"
                border="1px"
                borderColor="gray.200"
              >
                <Icon
                  as={FaUsers}
                  boxSize={8}
                  color="blue.500"
                  _dark={{ color: "blue.300" }}
                />
                <Heading
                  size="lg"
                  color="blue.600"
                  _dark={{ color: "blue.300" }}
                >
                  5.000+
                </Heading>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Documentos processados
                </Text>
              </VStack>

              {/* Card 3: Tempo */}
              <VStack
                p={6}
                bg="purple.50"
                _dark={{ bg: "blackAlpha.400", borderColor: "gray.700" }}
                borderRadius="lg"
                textAlign="center"
                border="1px"
                borderColor="gray.200"
              >
                <Icon
                  as={FaRocket}
                  boxSize={8}
                  color="purple.500"
                  _dark={{ color: "purple.300" }}
                />
                <Heading
                  size="lg"
                  color="purple.600"
                  _dark={{ color: "purple.300" }}
                >
                  10h
                </Heading>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Tempo médio de certificação
                </Text>
              </VStack>

              {/* Card 4: Conformidade */}
              <VStack
                p={6}
                bg="orange.50"
                _dark={{ bg: "blackAlpha.400", borderColor: "gray.700" }}
                borderRadius="lg"
                textAlign="center"
                border="1px"
                borderColor="gray.200"
              >
                <Icon
                  as={FaShieldAlt}
                  boxSize={8}
                  color="orange.500"
                  _dark={{ color: "orange.300" }}
                />
                <Heading
                  size="lg"
                  color="orange.600"
                  _dark={{ color: "orange.300" }}
                >
                  100%
                </Heading>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Conformidade ICP-Brasil
                </Text>
              </VStack>
            </SimpleGrid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
