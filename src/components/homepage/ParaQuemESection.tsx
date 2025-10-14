"use client";

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

// Dados para os cards
const audienceData = [
  {
    title: "Construtoras & Incorporadoras",
    description:
      "Centralize certificação e assinatura. Reduza fornecedores, custos e complexidade operacional.",
  },
  {
    title: "CCAs & Correspondentes",
    description:
      "Canal único para dossiê CEF, identificação ICP e envio de contratos. Mais agilidade e governança.",
  },
  {
    title: "Cartórios",
    description:
      "Receba, valide e confirme registros em um portal dedicado, reduzindo e-mails e prazos.",
  },
  {
    title: "Certificadoras (ARs)",
    description:
      "Cadastre-se no NatoHUB para receber clientes prontos e ampliar o faturamento sem prospecção ativa.",
  },
  {
    title: "Imobiliárias",
    description:
      "Use o NatoDireto para contratos de imóveis usados com o mesmo padrão de segurança das grandes construtoras.",
  },
  {
    title: "Time Financeiro",
    description:
      "Faturamento e cobrança centralizados. Relatórios, integrações e auditoria.",
  },
];

export default function ParaQuemESection() {
  return (
    <Box
      id="paraqueme"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 20, md: 28 }}
    >
      <Container maxW="6xl">
        <VStack spacing={3} mb={12} align="flex-start">
          <Heading
            as="h2"
            size="xl"
            color="green.600"
            _dark={{ color: "green.300" }}
          >
            Para quem é
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
          {audienceData.map((audience) => (
            <VStack
              key={audience.title}
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
              <Heading size="md" color="gray.800" _dark={{ color: "white" }}>
                {audience.title}
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.300" }}>
                {audience.description}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
