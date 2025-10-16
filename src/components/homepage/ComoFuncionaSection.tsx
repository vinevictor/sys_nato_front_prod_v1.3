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
import { motion } from "framer-motion";
import SectionBackgroundPattern from "./SectionBackgroundPattern";


// --- SUB-COMPONENTE PARA O CARD DE PASSO ---
interface StepCardProps {
  index: number;
  text: string;
}

const MotionBox = motion(Box);
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

function StepCard({ index, text }: StepCardProps) {
  return (
    <MotionBox
      position="relative"
      bg="white"
      _dark={{ bg: "gray.800" }}
      shadow="lg"
      rounded="xl"
      p={8}
      variants={itemVariants}
      transition={{
        transform: { duration: 0.2 },
        boxShadow: { duration: 0.2 },
      }}
      _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
    >
      {/* Círculo Numerado no canto superior direito */}
      <Flex
        align="center"
        justify="center"
        position="absolute"
        top={0}
        right={0}
        transform="translateX(50%) translateY(-50%)"
        bg="green.500"
        _dark={{ bg: "green.300", color: "gray.800", borderColor: "gray.900" }}
        color="white"
        borderRadius="full"
        boxSize={16}
        fontSize="2xl"
        fontWeight="bold"
        border="4px solid"
        borderColor="gray.100"
        zIndex={2}
      >
        {index + 1}
      </Flex>

      {/* Conteúdo do Card */}
      <Text
        textAlign="left"
        fontSize={{ base: "md", md: "lg" }}
        color="gray.600"
        _dark={{ color: "gray.300" }}
        minH="100px"
        display="flex"
        alignItems="center"
      >
        {text}
      </Text>
    </MotionBox>
  );
}

const stepsData = [
  "Cliente inicia o processo no portal da construtora.",
  "O SisNATO executa a identificação com o NatoID.",
  "Se necessário, agenda atendimento presencial via NatoHUB.",
  "Certificado emitido, contrato segue para NatoSign.",
  "Cartório recebe pelo SisNATO-Doc para registro.",
  "Tudo monitorado com relatórios e auditoria.",
];

const MotionSimpleGrid = motion(SimpleGrid);
const MotionVStack = motion(VStack);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ComoFuncionaSection() {
  return (
    <Box
      id="comofunciona"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 20, md: 28 }}
      position="relative"
      overflow="hidden"
    >
      <SectionBackgroundPattern />
      <Container maxW="6xl" position="relative" zIndex={1}>
        <MotionVStack
          spacing={3}
          mb={{ base: 16, md: 20 }} // Aumentei a margem inferior do título
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
              Como funciona
            </chakra.span>
          </Heading>
          <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
            Fluxo completo, do onboarding do cliente ao registro do imóvel.
          </Text>
        </MotionVStack>

        <MotionSimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacingX={12}
          spacingY={{ base: 16, md: 20 }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {stepsData.map((step, index) => (
            <StepCard key={index} index={index} text={step} />
          ))}
        </MotionSimpleGrid>
      </Container>
    </Box>
  );
}
