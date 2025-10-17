"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Icon,
  chakra,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaHandshake, FaArrowRight } from "react-icons/fa";

// Componentes com animação
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionButton = motion(Button);
const MotionChakraLink = chakra(motion.a);

// Variantes de animação
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ParceiroCtaSection() {
  return (
    // O Box principal agora é o próprio banner full-width
    <MotionBox
      id="QuerSerParceiro"
      scrollMarginTop="4rem"
      bg="gray.200"
      _dark={{
        bgGradient: "linear(to-r, gray.900, blue.900)", // Gradiente sutil no fundo escuro
      }}
      py={{ base: 16, md: 20 }}
      position="relative" // Necessário para o ícone de fundo
      overflow="hidden" // Garante que o ícone não vaze
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
    >
      {/* NOVO: Ícone decorativo de fundo */}
      <Icon
        as={FaHandshake}
        position="absolute"
        top="-20px"
        right="-50px"
        boxSize="250px"
        color="whiteAlpha.100"
        _light={{ color: "blackAlpha.100" }}
        transform="rotate(-20deg)"
        zIndex={0}
      />

      {/* Container para manter o conteúdo legível */}
      <Container maxW="6xl" position="relative" zIndex={1}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
        >
          {/* Lado esquerdo: Texto */}
          <MotionVStack
            align={{ base: "center", md: "flex-start" }}
            textAlign={{ base: "center", md: "left" }}
            mb={{ base: 8, md: 0 }}
            maxW={{ base: "full", md: "60%" }} // Limita a largura do texto
            variants={itemVariants}
          >
            <Heading as="h3" size="xl">
              <chakra.span
                // NOVO: Gradiente no título para consistência
                bgGradient="linear(to-r, green.500, teal.500)"
                _dark={{ bgGradient: "linear(to-r, green.300, teal.300)" }}
                bgClip="text"
              >
                Quer ser um parceiro NatoHUB?
              </chakra.span>
            </Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.300" }}>
              Junte-se à nossa rede de Autoridades Certificadoras (AR), receba
              clientes encaminhados pelo SisNATO e amplie sua receita sem
              esforço de prospecção.
            </Text>
          </MotionVStack>

          {/* Lado direito: Botão */}
          <MotionChakraLink
            href="https://wa.me/5516992800713?text=Olá! Tenho interesse em me cadastrar como parceiro no NatoHUB."
            target="_blank"
            rel="noopener noreferrer"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            px={6}
            py={3}
            fontSize="lg"
            fontWeight="semibold"
            borderRadius="md"
            bg="green.500"
            color="white"
            _hover={{ bg: "green.600" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            transition={"delay 0.4s, duration 0.6s"}
          >
            Conhecer o Sistema
            <Icon as={FaArrowRight} ml={2} />
          </MotionChakraLink>
          {/* <MotionButton
            as="a"
            href="https://wa.me/5516992800713?text=Olá! Tenho interesse em me cadastrar como parceiro no NatoHUB."
            target="_blank"
            colorScheme="green"
            size="lg"
            flexShrink={0}
            rightIcon={<FaArrowRight />}
            transition={{ duration: 0.3 }}
            _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
            variants={itemVariants}
          >
            Quero me cadastrar
          </MotionButton> */}
        </Flex>
      </Container>
    </MotionBox>
  );
}
