"use client";

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";

// Dados para os cards de benefícios
const benefitsData = [
  {
    title: "Velocidade:",
    description: "redução de até 70% no tempo de tramitação.",
  },
  {
    title: "Custos:",
    description: "menos fornecedores, menos retrabalho e cobrança unificada.",
  },
  {
    title: "Compliance:",
    description: "conformidade total com CEF e ICP-Brasil.",
  },
  {
    title: "Transparência:",
    description: "rastreabilidade e relatórios em tempo real.",
  },
  {
    title: "Escala:",
    description: "atendimento virtual e presencial integrados.",
  },
  {
    title: "Segurança:",
    description: "integrações, logs e auditoria ponta a ponta.",
  },
];

export default function ResultadosBeneficiosSection() {
  return (
    <Box
      id="resultadosbeneficios"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 14, md: 20 }}
    >
      <Container maxW="6xl">
        <VStack spacing={3} mb={12} align="flex-start">
          <Heading
            as="h2"
            size="xl"
            color="green.600"
            _dark={{ color: "green.300" }}
          >
            Resultados & Benefícios
          </Heading>
        </VStack>

        {/* Usamos 2 colunas para um layout mais equilibrado com este tipo de card */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {benefitsData.map((benefit) => (
            <Box
              key={benefit.title}
              bg="white"
              _dark={{
                bg: "blackAlpha.400",
                borderColor: "gray.700",
                boxShadow: "none",
              }}
              p={6}
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              boxShadow="md"
              transition="transform 0.2s, box-shadow 0.2s"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "lg",
              }}
            >
              <Text color="gray.600" _dark={{ color: "gray.300" }}>
                <chakra.span
                  fontWeight="bold"
                  color="gray.800"
                  _dark={{ color: "white" }}
                >
                  {benefit.title}
                </chakra.span>{" "}
                {benefit.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
