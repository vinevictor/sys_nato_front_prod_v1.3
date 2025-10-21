"use client";

import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Container,
  Grid,
  GridItem,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import SectionBackgroundPattern from "./SectionBackgroundPattern";

const audienceData = [
  {
    title: "Construtoras & Incorporadoras",
    description:
      "Centralize certificação e assinatura. Reduza fornecedores, custos e complexidade operacional.",
  },
  {
    title: "CCAs & Correspondentes",
    description:
      "Canal único para dossiê CEF, identificação ICP e envio de contratos. Mais agilidade e governança.",
  },
  {
    title: "Cartórios",
    description:
      "Receba, valide e confirme registros em um portal dedicado, reduzindo e-mails e prazos.",
  },
  {
    title: "Certificadoras (ARs)",
    description:
      "Cadastre-se no NatoHUB para receber clientes prontos e ampliar o faturamento sem prospecção ativa.",
  },
  {
    title: "Imobiliárias",
    description:
      "Use o NatoDireto para contratos de imóveis usados com o mesmo padrão de segurança das grandes construtoras.",
  },
  {
    title: "Time Financeiro",
    description:
      "Faturamento e cobrança centralizados. Relatórios, integrações e auditoria.",
  },
];

const leftColumnVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const rightColumnVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
  },
};

const MotionGridItem = motion(GridItem);

export default function ParaQuemESection() {
  return (
    <Box
      id="paraqueme"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 20, md: 28 }}
      position="relative"
      overflow="hidden"
    >
      <SectionBackgroundPattern />

      <Container maxW="6xl" position="relative" zIndex={1}>
        {/* Layout de duas colunas com Grid */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1.2fr" }}
          gap={{ base: 10, lg: 16 }}
          alignItems="center"
        >
          {/* Coluna da esquerda para o título e CTA */}
          <MotionGridItem
            variants={leftColumnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
          >
            <VStack align="flex-start" spacing={5}>
              <Heading as="h2" size="xl">
                <chakra.span
                  bgGradient="linear(to-r, green.500, teal.500)"
                  _dark={{ bgGradient: "linear(to-r, green.300, teal.300)" }}
                  bgClip="text"
                >
                  Para quem é
                </chakra.span>
              </Heading>
              <Text
                fontSize="lg"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Nossa plataforma foi desenhada para integrar todos os players do
                mercado imobiliário, da construtora ao cartório.
              </Text>
              <Button
                colorScheme="green"
                size="lg"
                mt={4}
                onClick={() =>
                  document
                    .getElementById("planos")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Ver Planos
              </Button>
            </VStack>
          </MotionGridItem>

          {/*  Coluna da direita com a lista de funcionalidades */}
          <MotionGridItem
            variants={rightColumnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
          >
            <List spacing={4}>
              {audienceData.map((audience) => (
                <ListItem
                  key={audience.title}
                  display="flex"
                  alignItems="center"
                >
                  <ListIcon
                    as={CheckIcon}
                    color="green.500"
                    _dark={{ color: "green.300" }}
                    boxSize={5}
                  />
                  <Text
                    as="span"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    <chakra.span
                      fontWeight="bold"
                      color="gray.800"
                      _dark={{ color: "white" }}
                    >
                      {audience.title}:
                    </chakra.span>{" "}
                    {audience.description}
                  </Text>
                </ListItem>
              ))}
            </List>
          </MotionGridItem>
        </Grid>
      </Container>
    </Box>
  );
}
