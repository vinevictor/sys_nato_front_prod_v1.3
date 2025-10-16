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
  Icon,
  Tag,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import {
  FaArrowRight,
  FaComments,
  FaTools,
  FaUniversity,
  FaFileSignature,
  FaTruck,
} from "react-icons/fa";

const features = [
  {
    icon: FaUniversity,
    tag: "Integração CEF",
    description: "ICP-Brasil & Assinatura Simples",
  },
  {
    icon: FaTruck,
    tag: "Logística",
    description: "Atendimento virtual e presencial",
  },
  {
    icon: FaFileSignature,
    tag: "Faturamento",
    description: "Cobrança centralizada",
  },
  {
    icon: FaTools,
    tag: "Relatórios",
    description: "Métricas em tempo real",
  },
];

export default function HeroSection() {
  return (
    <Box
      id="inicio"
      scrollMarginTop="4rem"
      minH="100vh"
      display="flex"
      alignItems="center"
      position="relative"
      overflow="hidden"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage="url('/heroimage.jpg')"
        bgSize="cover"
        bgPosition="center"
        opacity={0.1}
        _dark={{ opacity: 0.2 }}
      />
      <Container maxW="7xl" zIndex={1}>
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={{ base: 12, lg: 16 }}
          alignItems="center"
        >
          {/* Coluna da Esquerda */}
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
                size={{ base: "2xl", md: "3xl" }}
                lineHeight="shorter"
                fontWeight="extrabold"
              >
                <chakra.span
                  bgGradient="linear(to-r, green.400, teal.400)"
                  _dark={{ bgGradient: "linear(to-r, green.300, teal.300)" }}
                  bgClip="text"
                >
                  Transforme a gestão de certificação e assinatura digital
                </chakra.span>
                <chakra.span color="gray.800" _dark={{ color: "white" }}>
                  {" "}
                  da sua construtora.
                </chakra.span>
              </Heading>

              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="gray.600"
                _dark={{ color: "gray.300" }}
              >
                Unimos Construtoras, CCAs, Cartórios e Certificadoras em um
                único ambiente integrado, inteligente e seguro.
              </Text>

              <HStack spacing={4} paddingTop={4}>
                <Button
                  colorScheme="green"
                  size="lg"
                  rightIcon={<FaComments />}
                  transition="transform 0.2s"
                  _hover={{ transform: "translateY(-2px)" }}
                >
                  Fale com nosso time
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  rightIcon={<FaArrowRight />}
                  colorScheme="gray"
                  color="gray.700"
                  _dark={{ color: "whiteAlpha.900" }}
                  transition="transform 0.2s"
                  _hover={{
                    transform: "translateY(-2px)",
                    bg: "blackAlpha.50",
                    _dark: { bg: "whiteAlpha.200" },
                  }}
                >
                  Ver soluções
                </Button>
              </HStack>
            </VStack>
          </GridItem>

          {/* Coluna da Direita */}
          <GridItem>
            <VStack
              bg="whiteAlpha.700"
              _dark={{
                bg: "blackAlpha.600",
                borderColor: "whiteAlpha.300",
                boxShadow: "none",
              }}
              backdropFilter="blur(12px)"
              p={8}
              borderRadius="2xl"
              spacing={5}
              align="flex-start"
              border="1px"
              borderColor="whiteAlpha.400"
              boxShadow="lg"
            >
              {features.map((feature) => (
                <Flex key={feature.tag} align="center" w="100%">
                  <Icon
                    as={feature.icon}
                    boxSize={6}
                    color="green.500"
                    _dark={{ color: "green.300" }}
                    mr={4}
                  />
                  <VStack align="flex-start" spacing={0}>
                    <Text
                      fontWeight="bold"
                      color="gray.800"
                      _dark={{ color: "white" }}
                    >
                      {feature.tag}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.300" }}
                    >
                      {feature.description}
                    </Text>
                  </VStack>
                </Flex>
              ))}
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
