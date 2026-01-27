"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  chakra,
  SimpleGrid,
  Flex,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { IoCheckmark } from "react-icons/io5";
import SectionBackgroundPattern from "./SectionBackgroundPattern";

const Feature = (props: React.PropsWithChildren) => {
  return (
    <Flex alignSelf="start" w="full">
      <Icon
        boxSize={5}
        mt={1}
        mr={2}
        color="green.500"
        _dark={{ color: "green.300" }}
        viewBox="0 0 20 20"
        fill="currentColor"
        as={IoCheckmark}
      />
      <chakra.p
        fontSize="md"
        color="gray.600"
        _dark={{ color: "gray.400" }}
        {...props}
      />
    </Flex>
  );
};

interface PricingCardProps {
  name: string;
  price: string;
  features: string[];
  actionText: string;
  isHighlighted?: boolean;
}

function PricingCard({
  name,
  price,
  features,
  actionText,
  isHighlighted = false,
}: PricingCardProps) {
  const message = `Olá! Tenho interesse no plano "${name}" e gostaria de mais informações.`;
  const whatsappLink = `https://wa.me/5516992800713?text=${encodeURIComponent(
    message
  )}`;
  return (
    <Flex
      direction="column"
      bg="white"
      _dark={{
        bg: "gray.800",
        borderColor: isHighlighted ? "green.300" : "gray.700",
      }}
      shadow={isHighlighted ? "2xl" : "lg"}
      border="1px"
      borderColor={isHighlighted ? "green.400" : "gray.200"}
      borderRadius="xl"
      transform={isHighlighted ? { base: "none", lg: "scale(1.05)" } : "none"}
      zIndex={isHighlighted ? 1 : 0}
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{
        transform: {
          base: "translateY(-3px)",
          lg: isHighlighted ? "scale(1.07)" : "scale(1.02) translateY(-3px)",
        },
        boxShadow: "2xl",
      }}
    >
      {/* Seção Superior: Nome e Preço */}
      <VStack spacing={1} p={8} textAlign="center" w="full">
        <Heading fontSize="2xl" fontWeight="semibold">
          {name}
        </Heading>
        <HStack spacing={1} align="center" justify="center">
          <chakra.span
            fontWeight="bold"
            fontSize={{ base: "4xl", md: "5xl" }}
            whiteSpace="nowrap"
          >
            {price}
          </chakra.span>
          <chakra.span
            alignSelf="flex-end"
            fontSize="md"
            color="gray.500"
            _dark={{ color: "gray.400" }}
          >
            / processo mês
          </chakra.span>
        </HStack>
      </VStack>

      {/* Seção Inferior: Funcionalidades e Botão */}
      <VStack
        fontSize="sm"
        spacing={6}
        h="full"
        bg="gray.50"
        _dark={{ bg: "gray.700" }}
        borderBottomRadius="xl"
        p={8}
        flexGrow={1}
      >
        <VStack spacing={4} w="full" direction="column" alignItems="start">
          {features.map((feature, index) => (
            <Feature key={index}>{feature}</Feature>
          ))}
        </VStack>
        <Button
          as="a"
          href={whatsappLink}
          target="_blank"
          colorScheme={isHighlighted ? "green" : "gray"}
          variant={isHighlighted ? "solid" : "outline"}
          w="full"
          size="lg"
          mt="auto"
        >
          {actionText}
        </Button>
      </VStack>
    </Flex>
  );
}

const pricingData = [
  {
    range: "1-100 Certificações",
    price: "R$ 79,70",
    signer: "Assinador: R$ 5 / envelope",
    support: "Suporte via WhatsApp",
    benefits: "Gestor de conta exclusivo",
    actionText: "Fale Conosco",
    isHighlighted: false,
  },
  {
    range: "101-400 Certificações",
    price: "R$ 57,75",
    signer: "Assinador: R$ 3 / envelope",
    support: "Suporte via WhatsApp",
    benefits: "Gestor de conta exclusivo",
    actionText: "Fale Conosco",
    isHighlighted: false,
  },
  {
    range: "401-1000 Certificações",
    price: "R$ 47,25",
    signer: "Assinador: GRÁTIS",
    support: "Suporte via WhatsApp",
    benefits: "Personalização e Gestor",
    actionText: "Contratar Agora",
    isHighlighted: true,
  },
  {
    range: "1001-2000 Certificações",
    price: "R$ 36,65",
    signer: "Assinador: GRÁTIS",
    support: "Suporte via WhatsApp",
    benefits: "Personalização e Gestor",
    actionText: "Fale Conosco",
    isHighlighted: false,
  },
];

export default function PlanosSection() {
  return (
    <Box
      id="planos"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 20, md: 28 }}
      position="relative"
      overflow="hidden"
    >
      <SectionBackgroundPattern />

      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack spacing={4} mb={{ base: 10, md: 16 }} textAlign="center">
          <Heading as="h2" size="2xl">
            <chakra.span
              bgGradient="linear(to-r, green.500, teal.500)"
              _dark={{ bgGradient: "linear(to-r, green.300, teal.300)" }}
              bgClip="text"
            >
              Planos flexíveis para sua operação
            </chakra.span>
          </Heading>
          <Text
            fontSize="lg"
            color="gray.600"
            _dark={{ color: "gray.400" }}
            maxW="3xl"
          >
            Escolha o plano ideal para o volume de processos da sua operação.
            Todos incluem suporte via WhatsApp e integração completa ao
            ecossistema SisNATO.
          </Text>
        </VStack>

        <SimpleGrid
          columns={{ base: 1, lg: 4 }}
          spacing={{ base: 10, lg: 6 }}
          alignItems="center" // Alinha os cards verticalmente
        >
          {pricingData.map((plan) => (
            <PricingCard
              key={plan.range}
              name={plan.range}
              price={plan.price}
              features={[plan.signer, plan.support, plan.benefits]}
              actionText={plan.actionText}
              isHighlighted={plan.isHighlighted}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
