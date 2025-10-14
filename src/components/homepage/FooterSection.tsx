"use client";

import {
  Box,
  Container,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { TriangleUpIcon } from "@chakra-ui/icons";

const sitemapLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Soluções", href: "#solucoes" },
  { label: "Como funciona", href: "#comofunciona" },
  { label: "Para quem é", href: "#paraqueme" },
  { label: "Parceiras", href: "#parceiras" },
  { label: "Contato", href: "#contato" },
];

export default function FooterSection() {
  return (
    <Box
      bg="gray.200"
      _dark={{ bg: "#111827", color: "gray.300" }}
      color="gray.700"
      py={{ base: 12, md: 16 }}
    >
      <Container maxW="6xl">
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3 }}
          spacing={{ base: 10, md: 8 }}
        >
          {/* Coluna 1: Logo e Descrição */}
          <VStack spacing={4} align="flex-start">
            <HStack align="center">
              <Icon as={TriangleUpIcon} w={5} h={5} color="green.400" />
              <Heading
                as="h3"
                size="md"
                color="gray.800"
                _dark={{ color: "white" }}
              >
                SisNATO
              </Heading>
            </HStack>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              O futuro da certificação e assinatura digital no mercado
              imobiliário já começou. Ele se chama SisNATO — o ERP do Nato
              Digital.
            </Text>
            <Text
              fontSize="xs"
              color="gray.500"
              _dark={{ color: "gray.500" }}
              pt={4}
            >
              © {new Date().getFullYear()} INTERFACE CERTIFICADORA DIGITAL.
              Todos os direitos reservados.
            </Text>
          </VStack>

          {/* Coluna 2: Mapa do site */}
          <VStack align="flex-start">
            <Heading
              as="h4"
              size="sm"
              color="gray.800"
              _dark={{ color: "white" }}
            >
              Mapa do site
            </Heading>
            <VStack align="flex-start" spacing={2}>
              {sitemapLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  _hover={{ color: "green.500", _dark: { color: "green.300" } }}
                >
                  {link.label}
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Coluna 3: Contato */}
          <VStack align="flex-start">
            <Heading
              as="h4"
              size="sm"
              color="gray.800"
              _dark={{ color: "white" }}
            >
              Contato
            </Heading>
            <VStack align="flex-start" spacing={2} fontSize="sm">
              <Text>CNPJ: 20.220.831/0001-36</Text>
              <Link
                href="mailto:contato@sisnato.com.br"
                _hover={{ color: "green.500", _dark: { color: "green.300" } }}
              >
                contato@sisnato.com.br
              </Link>
              <Link
                href="tel:+551632897492"
                _hover={{ color: "green.500", _dark: { color: "green.300" } }}
              >
                (16) 3289-7402
              </Link>
              <Link
                href="https://www.sisnato.com.br"
                isExternal
                _hover={{ color: "green.500", _dark: { color: "green.300" } }}
              >
                www.sisnato.com.br
              </Link>
            </VStack>
          </VStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
