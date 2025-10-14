"use client";

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Flex,
  chakra,
} from "@chakra-ui/react";

const stepsData = [
  "Cliente inicia o processo no portal da construtora.",
  "O SisNATO executa a identificação com o NatoID.",
  "Se necessário, agenda atendimento presencial via NatoHUB.",
  "Certificado emitido, contrato segue para NatoSign.",
  "Cartório recebe pelo SisNATO-Doc para registro.",
  "Tudo monitorado com relatórios e auditoria.",
];

export default function ComoFuncionaSection() {
  return (
    <Box
      id="comofunciona"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 14, md: 14 }}
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
            Como funciona
          </Heading>
          <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
            Fluxo completo, do onboarding do cliente ao registro do imóvel.
          </Text>
        </VStack>

        {/* Grid com os passos */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {stepsData.map((step, index) => (
            <Flex
              key={index}
              align="center"
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
              <chakra.span
                fontSize="xl"
                fontWeight="bold"
                color="green.500"
                _dark={{ color: "green.300" }}
                mr={4}
              >
                {index + 1}.
              </chakra.span>
              <Text color="gray.700" _dark={{ color: "gray.300" }}>
                {step}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
