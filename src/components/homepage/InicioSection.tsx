"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
  // useColorModeValue não é mais necessário aqui!
} from "@chakra-ui/react";

const features = [
  {
    tag: "Integração CEF",
    description: "ICP-Brasil & Assinatura Simples",
  },
  {
    tag: "Logística",
    description: "Atendimento virtual e presencial",
  },
  {
    tag: "Faturamento",
    description: "Cobrança centralizada",
  },
  {
    tag: "Relatórios",
    description: "Métricas em tempo real",
  },
];

export default function InicioSection() {
  return (
    // Aplicando o estilo _dark diretamente
    <Box
      id="inicio"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 14, md: 20 }}
    >
      <Container maxW="7xl">
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={{ base: 12, lg: 16 }}
          alignItems="center"
        >
          {/* Coluna da Esquerda: Textos e Botões */}
          <GridItem>
            <VStack align="flex-start" spacing={6}>
              <Tag
                size="lg"
                colorScheme="green"
                variant="solid"
                borderRadius="full"
              >
                ERP DO NATO DIGITAL
              </Tag>

              <Heading
                as="h1"
                size={{ base: "xl", md: "2xl" }}
                color="green.600"
                _dark={{ color: "green.300" }}
                lineHeight="shorter"
              >
                Transforme a gestão de certificação e assinatura digital da sua
                construtora.
              </Heading>

              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.600"
                _dark={{ color: "gray.300" }}
              >
                Unimos Construtoras, CCAs, Cartórios e Certificadoras em um
                único ambiente integrado...
              </Text>

              <HStack spacing={4} paddingTop={4}>
                <Button colorScheme="green" size="lg">
                  Fale com nosso time
                </Button>
                <Button colorScheme="green" variant="outline" size="lg">
                  Ver soluções
                </Button>
              </HStack>
            </VStack>
          </GridItem>

          {/* Coluna da Direita: Box de Funcionalidades */}
          <GridItem>
            <VStack
              bg="white"
              _dark={{ bg: "blackAlpha.400" }}
              p={8}
              borderRadius="xl"
              spacing={5}
              align="flex-start"
              border="1px"
              borderColor="gray.200"
              boxShadow="md"
            >
              {features.map((feature) => (
                <Flex key={feature.tag} align="center" w="100%">
                  <Tag
                    bg="gray.200"
                    color="gray.800"
                    _dark={{ bg: "gray.600", color: "gray.200" }}
                    size="md"
                    minW="120px"
                    textAlign="center"
                    py={1}
                    justifyContent="center"
                  >
                    {feature.tag}
                  </Tag>
                  <Text
                    ml={4}
                    fontSize="md"
                    color="gray.600"
                    _dark={{ color: "gray.300" }}
                  >
                    {feature.description}
                  </Text>
                </Flex>
              ))}

              <Text
                pt={4}
                fontSize="sm"
                color="gray.500"
                _dark={{ color: "gray.400" }}
              >
                Conformidade total com a CEF e ICP-Brasil...
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
