"use client";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Icon,
  Link,
  Flex,
  chakra,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FaCube,
  FaFingerprint,
  FaPenNib,
  FaNetworkWired,
  FaBook,
  FaHome,
} from "react-icons/fa";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import SectionBackgroundPattern from "./SectionBackgroundPattern";

interface SolutionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const MotionFlex = motion(Flex);
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

function SolutionCard({ icon, title, description }: SolutionCardProps) {
  return (
    <MotionFlex
      direction="column"
      bg="white"
      _dark={{ bg: "gray.800" }}
      shadow="lg"
      rounded="xl"
      overflow="hidden"
      variants={itemVariants}
      transition={{
        transform: { duration: 0.2 },
        boxShadow: { duration: 0.2 },
      }}
      _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
    >
      {/* Área de conteúdo principal */}
      <VStack p={8} spacing={5} align="flex-start" flexGrow={1}>
        <Icon
          as={icon}
          boxSize={12}
          color="green.500"
          _dark={{ color: "green.300" }}
        />
        <Heading
          fontSize="2xl"
          fontWeight="bold"
          textTransform="uppercase"
          color="gray.800"
          _dark={{ color: "white" }}
        >
          {title}
        </Heading>
        <Text fontSize="md" color="gray.600" _dark={{ color: "gray.400" }}>
          {description}
        </Text>
      </VStack>

      {/* Footer com cor de fundo distinta */}
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px={6}
        py={4}
        bg="green.600"
        _dark={{ bg: "green.700" }}
      >
        <chakra.h3 color="white" fontWeight="bold" fontSize="lg">
          {title}
        </chakra.h3>
        <Button
          as={Link}
          href="#contato"
          px={3}
          py={1}
          bg="white"
          fontSize="sm"
          color="green.700"
          fontWeight="bold"
          rounded="lg"
          textTransform="uppercase"
          rightIcon={<ArrowForwardIcon />}
          _hover={{ bg: "gray.200" }}
        >
          Saiba Mais
        </Button>
      </Flex>
    </MotionFlex>
  );
}

const solutionsData = [
  {
    icon: FaCube,
    title: "SisNATO",
    description:
      "Núcleo do ecossistema. Centraliza solicitações, integrações com construtoras, CEF e gestão de certificação e assinaturas.",
  },
  {
    icon: FaFingerprint,
    title: "NatoID",
    description:
      "Identificação segura via reconhecimento facial, envio de Documento com operação remota.",
  },
  {
    icon: FaPenNib,
    title: "NatoSign",
    description:
      "Assinatura eletrônica simples (sem ICP) e assinatura digital ICP (com certificado) em um único fluxo, com auditoria completa.",
  },
  {
    icon: FaNetworkWired,
    title: "NatoHUB",
    description:
      "Rede nacional de certificadoras parceiras para atendimento presencial. Agenda automática do ponto mais próximo.",
  },
  {
    icon: FaBook,
    title: "SisNATO-Doc",
    description:
      "Portal para Cartórios receberem, validarem e confirmarem registros, com comunicação organizada e recibos digitais.",
  },
  {
    icon: FaHome,
    title: "NatoDireto",
    description:
      "Versão voltada a imobiliárias e mercado secundário, com o mesmo padrão de segurança e organização.",
  },
];

const MotionSimpleGrid = motion(SimpleGrid);
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function SolucoesSection() {
  return (
    <Box
      id="solucoes"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 20, md: 28 }}
      position="relative"
      overflow="hidden"
    >
      <SectionBackgroundPattern />
      <Container maxW="6xl" position="relative" zIndex={1}>
        <VStack spacing={3} mb={12} align={"flex-start"}>
          <Heading as="h2" size="xl">
            <chakra.span
              bgGradient="linear(to-r, green.500, teal.500)"
              _dark={{ bgGradient: "linear(to-r, green.300, teal.300)" }}
              bgClip="text"
            >
              Soluções
            </chakra.span>
          </Heading>
          <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
            Todos os módulos que você precisa, trabalhando de forma integrada.
          </Text>
        </VStack>

        <MotionSimpleGrid
          columns={{ base: 1, sm: 2, md: 3 }}
          spacing={8}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {solutionsData.map((solution) => (
            <SolutionCard
              key={solution.title}
              icon={solution.icon}
              title={solution.title}
              description={solution.description}
            />
          ))}
        </MotionSimpleGrid>
      </Container>
    </Box>
  );
}
