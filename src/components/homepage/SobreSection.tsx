"use client";

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

const aboutData = [
  {
    title: "Missão",
    description:
      "Simplificar, unificar e dar segurança aos processos de identificação, certificação e assinatura digital no setor imobiliário.",
  },
  {
    title: "Visão",
    description:
      "Ser o principal hub nacional, reconhecido pela inovação, confiabilidade e integração total com a CEF e a ICP-Brasil.",
  },
  {
    title: "Valores",
    description:
      "Inovação • Segurança • Transparência • Eficiência • Conectividade",
  },
];

export default function SobreSection() {
  return (
    <Box
      id="sobre"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 14, md: 14 }}
    >
      <Container maxW="6xl">
        {/* Título e Subtítulo */}
        <VStack spacing={3} mb={12} align={"flex-start"}>
          <Heading
            as="h2"
            size="xl"
            fontWeight="bold"
            color="green.600"
            _dark={{ color: "green.300" }}
          >
            Sobre o SisNATO
          </Heading>
          <Text
            fontSize="lg"
            color="gray.600"
            _dark={{ color: "gray.400" }}
            maxW="2xl"
          >
            Mais do que uma plataforma, um ecossistema que conecta todos os
            agentes da jornada de compra e venda de imóveis.
          </Text>
        </VStack>

        {/* Grid com os cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {aboutData.map((item) => (
            <VStack
              key={item.title}
              bg="white"
              _dark={{
                bg: "blackAlpha.400",
                borderColor: "gray.700",
                boxShadow: "none",
              }}
              p={8}
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              spacing={4}
              align="flex-start"
              textAlign="left"
              boxShadow="md"
              transition="transform 0.2s, box-shadow 0.2s"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "lg",
              }}
            >
              <Heading
                size="md"
                color="green.500"
                _dark={{ color: "green.300" }}
              >
                {item.title}
              </Heading>
              <Text
                color="gray.600"
                _dark={{ color: "gray.300" }}
                lineHeight="tall"
              >
                {item.description}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
