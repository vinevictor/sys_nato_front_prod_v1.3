"use client";

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

// Dados das soluções para manter o código limpo
const solutionsData = [
  {
    title: "SisNATO",
    description:
      "Núcleo do ecossistema. Centraliza solicitações, integrações com construtoras, CEF e gestão de certificação e assinaturas.",
  },
  {
    title: "NatoID",
    description:
      "Identificação segura via reconhecimento facial, CNH e biometria, com conformidade ICP-Brasil e operação remota/presencial.",
  },
  {
    title: "NatoSign",
    description:
      "Assinatura eletrônica simples (sem ICP) e assinatura digital ICP (com certificado) em um único fluxo, com auditoria completa.",
  },
  {
    title: "NatoHUB",
    description:
      "Rede nacional de certificadoras parceiras para atendimento presencial. Agenda automática do ponto mais próximo.",
  },
  {
    title: "SisNATO-Doc",
    description:
      "Portal para Cartórios receberem, validarem e confirmarem registros, com comunicação organizada e recibos digitais.",
  },
  {
    title: "NatoDireto",
    description:
      "Versão voltada a imobiliárias e mercado secundário, com o mesmo padrão de segurança e organização.",
  },
];

export default function SolucoesSection() {
  return (
    <Box
      id="solucoes"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 14, md: 20 }}
    >
      <Container maxW="6xl">
        {/* Título da Seção */}
        <VStack spacing={3} mb={12} align={"flex-start"}>
          <Heading
            as="h2"
            size="xl"
            color="green.600"
            _dark={{ color: "green.300" }}
          >
            Soluções
          </Heading>
          <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
            Todos os módulos que você precisa, trabalhando de forma integrada.
          </Text>
        </VStack>

        {/* Grid com os cards de soluções */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
          {solutionsData.map((solution) => (
            <VStack
              key={solution.title}
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
                {solution.title}
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.300" }}>
                {solution.description}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
