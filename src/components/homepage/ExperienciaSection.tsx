"use client";

import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import {
  FaChartLine,
  FaUsers,
  FaRocket,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import SectionBackgroundPattern from "./SectionBackgroundPattern";

const MotionVStack = motion(VStack);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);
const MotionSimpleGrid = motion(SimpleGrid);
const MotionChakraLink = chakra(motion.a);

const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const containerCardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemCardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * Seção de experiência no mercado com estatísticas, agora animada e mais bonita.
 */
export default function ExperienciaSection() {
  return (
    <Box
      id="experiencia"
      scrollMarginTop="4rem"
      py={{ base: 20, md: 28 }} // Aumentei um pouco o padding vertical
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      position="relative"
      overflow="hidden"
    >
      <SectionBackgroundPattern />

      <Container maxW="7xl" position={"relative"} zIndex={1}>
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={12}
          alignItems="center"
        >
          {/* Coluna da Esquerda: Textos e Botão (Animados) */}
          <GridItem>
            <VStack align="flex-start" spacing={6}>
              <MotionHeading
                as="h2" // Alterei para h2 sem quebrar o estilo
                size="xl"
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
              >
                <chakra.span
                  bgGradient="linear(to-r, green.500, teal.500)"
                  _dark={{ bgGradient: "linear(to-r, green.300, teal.300)" }}
                  bgClip="text"
                >
                  Agilidade, Segurança e Confiabilidade
                </chakra.span>
              </MotionHeading>

              <MotionText
                fontSize="lg"
                color="gray.600"
                _dark={{ color: "gray.300" }}
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 0.2, duration: 0.6 }} // Atraso para aparecer depois do título
              >
                O SisNATO oferece gestão completa de documentos imobiliários com
                certificação digital ICP-Brasil, garantindo validade jurídica e
                proteção contra fraudes.
              </MotionText>

              <MotionText
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
                fontStyle="italic"
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 0.4, duration: 0.6 }} // Mais atraso
              >
                *Certificação ICP-Brasil garante autenticidade, integridade e
                validade jurídica dos documentos assinados digitalmente.
              </MotionText>

              <MotionChakraLink
                href="https://wa.me/5516992800713?text=Olá! Gostaria de conhecer mais sobre a agilidade, segurança e confiabilidade do SisNATO e como ele pode otimizar minha gestão de documentos imobiliários."
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
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                transition={"delay 0.4s, duration 0.6s"}
              >
                Conhecer o Sistema
                <Icon as={FaArrowRight} ml={2} />
              </MotionChakraLink>
            </VStack>
          </GridItem>

          {/* Coluna da Direita: Cards de Estatísticas (Animados e Glassmorphism) */}
          <GridItem>
            <MotionSimpleGrid
              columns={2}
              spacing={6}
              variants={containerCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.4 }}
            >
              {/* Card 1: Precisão */}
              <MotionVStack
                p={6}
                bg="whiteAlpha.700"
                _dark={{
                  bg: "gray.800",
                  borderColor: "whiteAlpha.300",
                  boxShadow: "none",
                }}
                backdropFilter="blur(10px)"
                borderRadius="xl"
                textAlign="center"
                border="1px"
                borderColor="gray.200"
                boxShadow="md"
                variants={itemCardVariants}
              >
                <Icon
                  as={FaChartLine}
                  boxSize={8}
                  color="green.500"
                  _dark={{ color: "green.300" }}
                  mb={2}
                />
                <Heading
                  size="xl"
                  color="green.600"
                  _dark={{ color: "green.300" }}
                >
                  99,8%
                </Heading>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Precisão antifraude
                </Text>
              </MotionVStack>

              {/* Card 2: Documentos */}
              <MotionVStack
                p={6}
                bg="whiteAlpha.700"
                _dark={{
                  bg: "gray.800",
                  borderColor: "whiteAlpha.300",
                  boxShadow: "none",
                }}
                backdropFilter="blur(10px)"
                borderRadius="xl"
                textAlign="center"
                border="1px"
                borderColor="gray.200"
                boxShadow="md"
                variants={itemCardVariants}
              >
                <Icon
                  as={FaUsers}
                  boxSize={8}
                  color="blue.500"
                  _dark={{ color: "blue.300" }}
                  mb={2}
                />
                <Heading
                  size="xl"
                  color="blue.600"
                  _dark={{ color: "blue.300" }}
                >
                  5.000+
                </Heading>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Documentos processados
                </Text>
              </MotionVStack>

              {/* Card 3: Tempo */}
              <MotionVStack
                p={6}
                bg="whiteAlpha.700"
                _dark={{
                  bg: "gray.800",
                  borderColor: "whiteAlpha.300",
                  boxShadow: "none",
                }}
                backdropFilter="blur(10px)"
                borderRadius="xl"
                textAlign="center"
                border="1px"
                borderColor="gray.200"
                boxShadow="md"
                variants={itemCardVariants}
              >
                <Icon
                  as={FaRocket}
                  boxSize={8}
                  color="purple.500"
                  _dark={{ color: "purple.300" }}
                  mb={2}
                />
                <Heading
                  size="xl"
                  color="purple.600"
                  _dark={{ color: "purple.300" }}
                >
                  10h
                </Heading>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Tempo médio de certificação
                </Text>
              </MotionVStack>

              {/* Card 4: Conformidade */}
              <MotionVStack
                p={6}
                bg="whiteAlpha.700"
                _dark={{
                  bg: "gray.800",
                  borderColor: "whiteAlpha.300",
                  boxShadow: "none",
                }}
                backdropFilter="blur(10px)"
                borderRadius="xl"
                textAlign="center"
                border="1px"
                borderColor="gray.200"
                boxShadow="md"
                variants={itemCardVariants}
              >
                <Icon
                  as={FaShieldAlt}
                  boxSize={8}
                  color="orange.500"
                  _dark={{ color: "orange.300" }}
                  mb={2}
                />
                <Heading
                  size="xl"
                  color="orange.600"
                  _dark={{ color: "orange.300" }}
                >
                  100%
                </Heading>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Conformidade ICP-Brasil
                </Text>
              </MotionVStack>
            </MotionSimpleGrid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
