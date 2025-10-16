"use client";

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Icon,
  chakra,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import SectionBackgroundPattern from "./SectionBackgroundPattern";
import { FaBullseye, FaEye, FaGem } from "react-icons/fa";

const aboutData = [
  {
    icon: FaBullseye,
    title: "Missão",
    description:
      "Simplificar, unificar e dar segurança aos processos de identificação, certificação e assinatura digital no setor imobiliário.",
  },
  {
    icon: FaEye,
    title: "Visão",
    description:
      "Ser o principal hub nacional, reconhecido pela inovação, confiabilidade e integração total com a CEF e a ICP-Brasil.",
  },
  {
    icon: FaGem,
    title: "Valores",
    description:
      "Inovação • Segurança • Transparência • Eficiência • Conectividade",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const MotionVStack = motion(VStack);
const MotionSimpleGrid = motion(SimpleGrid);

export default function SobreSection() {
  return (
    <Box
      id="sobre"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 20, md: 28 }}
      position="relative"
      overflow="hidden"
    >
      <SectionBackgroundPattern />

      <Container maxW="6xl" position="relative" zIndex={1}>
        {/* Título e Subtítulo com animação */}
        <MotionVStack
          spacing={3}
          mb={12}
          align={"flex-start"}
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
        >
          <Heading as="h2" size="2xl">
            <chakra.span
              bgGradient="linear(to-r, green.500, teal.500)"
              _dark={{ bgGradient: "linear(to-r, green.300, teal.300)" }}
              bgClip="text"
            >
              Sobre o SisNATO
            </chakra.span>
          </Heading>
          <Text
            fontSize="lg"
            color="gray.600"
            _dark={{ color: "gray.400" }}
            maxW="2xl"
          >
            Mais do que uma plataforma, um ecossistema que conecta todos os
            agentes da jornada de compra e venda de imóveis.
          </Text>
        </MotionVStack>

        {/* Grid com os cards animados */}
        <MotionSimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={8}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {aboutData.map((item) => (
            <MotionVStack
              key={item.title}
              bg="whiteAlpha.700"
              _dark={{
                bg: "gray.800",
                borderColor: "whiteAlpha.300",
                boxShadow: "none",
              }}
              backdropFilter="blur(10px)"
              p={8}
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              spacing={5}
              align="flex-start"
              textAlign="left"
              boxShadow="md"
              transition={{
                transform: { duration: 0.2 },
                boxShadow: { duration: 0.2 },
              }}
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "lg",
              }}
              variants={itemVariants}
            >
              <Icon
                as={item.icon}
                boxSize={10}
                color="green.500"
                _dark={{ color: "green.300" }}
              />
              <Heading size="md" color="gray.800" _dark={{ color: "white" }}>
                {item.title}
              </Heading>
              <Text
                color="gray.600"
                _dark={{ color: "gray.300" }}
                lineHeight="tall"
              >
                {item.description}
              </Text>
            </MotionVStack>
          ))}
        </MotionSimpleGrid>
      </Container>
    </Box>
  );
}
