"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";

// Dados dos planos para popular a tabela dinamicamente
const pricingData = [
  {
    range: "1 a 100 processos",
    price: "R$ 75,90",
    signer: "R$ 3 por envelope",
    support: "Via WhatsApp",
    benefits: "Gestor de conta exclusivo",
    isHighlighted: false,
    actionText: "Fale Conosco",
  },
  {
    range: "101 a 400 processos",
    price: "R$ 55,00",
    signer: "R$ 1 por envelope",
    support: "Via WhatsApp",
    benefits: "Gestor de conta exclusivo",
    isHighlighted: false,
    actionText: "Fale Conosco",
  },
  {
    range: "401 a 1000 processos",
    price: "R$ 45,00",
    signer: "GRÁTIS",
    support: "Via WhatsApp",
    benefits: "Gestor de conta exclusivo + Personalização",
    isHighlighted: true,
    actionText: "Contratar agora",
  },
  {
    range: "1001 a 2000 processos",
    price: "R$ 34,90",
    signer: "GRÁTIS",
    support: "Via WhatsApp",
    benefits: "Gestor de conta exclusivo + Personalização",
    isHighlighted: false,
    actionText: "Fale Conosco",
  },
];

const headers = [
  "Faixa de Processos",
  "Valor por Processo",
  "Assinador",
  "Suporte",
  "Benefícios Extras",
  "Ação",
];

export default function PlanosSection() {
  return (
    <Box
      id="planos"
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
            Conheça nossos planos pré-definidos On Demand (pós-pago)
          </Heading>
          <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
            Escolha o plano ideal para o volume de processos da sua operação.
            Todos incluem suporte via WhatsApp e integração completa ao
            ecossistema SisNATO.
          </Text>
        </VStack>

        <Box
          border="1px"
          borderColor="gray.200"
          _dark={{
            borderColor: "gray.700",
            boxShadow: "none",
            bg: "blackAlpha.400",
          }}
          borderRadius="xl"
          overflowX="auto" // Garante que a tabela seja rolável em telas pequenas
          boxShadow="md"
          bg="white"
        >
          {/* Cabeçalho da Tabela */}
          <Grid
            templateColumns="repeat(6, 1fr)"
            gap={6}
            p={5}
            display={{ base: "none", md: "grid" }} // Esconde o header em mobile
            borderBottom="1px"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
          >
            {headers.map((header) => (
              <GridItem
                key={header}
                as="b"
                color="gray.700"
                _dark={{ color: "white" }}
              >
                {header}
              </GridItem>
            ))}
          </Grid>

          {/* Linhas de Dados */}
          {pricingData.map((plan, index) => (
            <Grid
              key={plan.range}
              templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }}
              gap={6}
              p={5}
              alignItems="center"
              borderTop={index > 0 ? "1px" : "none"}
              _dark={{
                borderColor: plan.isHighlighted ? "green.400" : "gray.700",
                borderTopColor: plan.isHighlighted ? "green.400" : "gray.700",
              }}
              // Estilo especial para a linha destacada
              border={plan.isHighlighted ? "2px" : "none"}
              borderTopWidth={
                plan.isHighlighted ? "2px" : index > 0 ? "1px" : "0"
              }
              borderTopColor={plan.isHighlighted ? "green.400" : "gray.700"}
              borderColor={plan.isHighlighted ? "green.400" : "gray.200"}
              borderRadius={plan.isHighlighted ? "lg" : "none"}
              m={plan.isHighlighted ? "4" : "0"} // Margem para destacar
            >
              {/* Células de dados com labels para mobile */}
              <GridItem>
                <chakra.b display={{ md: "none" }}>Faixa: </chakra.b>
                {plan.range}
              </GridItem>
              <GridItem>
                <chakra.b display={{ md: "none" }}>Valor: </chakra.b>
                {plan.price}
              </GridItem>
              <GridItem>
                <chakra.b display={{ md: "none" }}>Assinador: </chakra.b>
                {plan.signer}
              </GridItem>
              <GridItem>
                <chakra.b display={{ md: "none" }}>Suporte: </chakra.b>
                {plan.support}
              </GridItem>
              <GridItem>
                <chakra.b display={{ md: "none" }}>Benefícios: </chakra.b>
                {plan.benefits}
              </GridItem>
              <GridItem>
                <Button
                  colorScheme="green"
                  variant={plan.isHighlighted ? "solid" : "outline"}
                  w="full"
                >
                  {plan.actionText}
                </Button>
              </GridItem>
            </Grid>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
