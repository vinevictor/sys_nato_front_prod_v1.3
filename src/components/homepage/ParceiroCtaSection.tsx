"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function ParceiroCtaSection() {
  return (
    <Box
      id="QuerSerParceiro"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 10, md: 14 }}
    >
      <Container maxW="6xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          bg="white"
          _dark={{
            bg: "blackAlpha.400",
            borderColor: "gray.700",
            boxShadow: "none",
          }}
          p={{ base: 6, md: 8 }}
          borderRadius="xl"
          border="1px"
          borderColor="gray.200"
          boxShadow="md"
        >
          <VStack
            align={{ base: "center", md: "flex-start" }}
            textAlign={{ base: "center", md: "left" }}
            mb={{ base: 6, md: 0 }}
          >
            <Heading
              as="h3"
              size="lg"
              color="green.600"
              _dark={{ color: "green.300" }}
            >
              Quer ser parceiro NatoHUB?
            </Heading>
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              Certificadora (AR), cadastre-se para receber clientes encaminhados
              pelo SisNATO e ampliar sua receita.
            </Text>
          </VStack>
          <Button
            as="a"
            href="https://wa.me/5516992800713?text=Olá! Tenho interesse em me cadastrar no SisNATO."
            target="_blank"
            colorScheme="green"
            size="lg"
            flexShrink={0} // Previne que o botão encolha
          >
            Quero me cadastrar
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
