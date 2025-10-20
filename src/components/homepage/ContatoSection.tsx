"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  Link,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  chakra,
  useToast,
} from "@chakra-ui/react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaPaperPlane,
} from "react-icons/fa";
import { EmailIcon } from "@chakra-ui/icons";
import SectionBackgroundPattern from "./SectionBackgroundPattern";
import { motion } from "framer-motion";
import { useState } from "react";

// --- DADOS PARA O CARD DE INFORMAÇÕES ---
const contactInfo = [
  { icon: FaMapMarkerAlt, text: "Ribeirão Preto – SP" },
  {
    icon: EmailIcon,
    text: "contato@sisnato.com.br",
    href: "mailto:contato@sisnato.com.br",
  },
  { icon: FaPhoneAlt, text: "(16) 3289-7492", href: "tel:+551632897492" },
  {
    icon: FaGlobe,
    text: "www.sisnato.com.br",
    href: "https://www.sisnato.com.br",
    isExternal: true,
  },
];

// --- ANIMAÇÕES ---
const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const leftColumnVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const rightColumnVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
  },
};
const MotionGridItem = motion(GridItem);
const MotionVStack = motion(VStack);

export default function ContatoSection() {
  // --- LÓGICA DO FORMULÁRIO ---
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    empresa: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar a mensagem.");
      }

      toast({
        title: "Mensagem Enviada!",
        description: "Obrigado pelo seu contato. Responderemos em breve.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Limpa o formulário
      setFormData({ nome: "", email: "", empresa: "", mensagem: "" });
    } catch (error) {
      toast({
        title: "Erro!",
        description:
          "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const inputStyles = {
    bg: "whiteAlpha.600",
    borderColor: "gray.300",
    _dark: {
      bg: "blackAlpha.500",
      borderColor: "whiteAlpha.300",
    },
    _hover: {
      borderColor: "gray.400",
      _dark: { borderColor: "whiteAlpha.400" },
    },
    _focus: {
      borderColor: "green.400",
      boxShadow: `0 0 0 1px var(--chakra-colors-green-400)`,
    },
  };

  return (
    <Box
      id="contato"
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
          mb={12}
          align="flex-start"
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
              Contato
            </chakra.span>
          </Heading>
        </MotionVStack>

        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1.5fr" }}
          gap={{ base: 10, lg: 8 }}
        >
          {/* Coluna da Esquerda: Informações (Animada) */}
          <MotionGridItem
            variants={leftColumnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <VStack
              align="flex-start"
              spacing={6}
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
              boxShadow="md"
              height="100%"
            >
              <Box>
                <Heading size="md" color="gray.800" _dark={{ color: "white" }}>
                  INTERFACE CERTIFICADORA DIGITAL
                </Heading>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                >
                  CNPJ: 20.220.831/0001-36
                </Text>
              </Box>

              <VStack spacing={5} align="flex-start" w="full">
                {contactInfo.map((item) => (
                  <Flex key={item.text} align="center">
                    <Flex
                      boxSize={10}
                      bg="green.500"
                      _dark={{ bg: "green.300" }}
                      borderRadius="lg"
                      align="center"
                      justify="center"
                      mr={4}
                    >
                      <Icon
                        as={item.icon}
                        color="white"
                        _dark={{ color: "gray.800" }}
                      />
                    </Flex>
                    <Link
                      href={item.href}
                      isExternal={item.isExternal}
                      color="blue.500"
                      _dark={{ color: "blue.300" }}
                      fontWeight="medium"
                    >
                      {item.text}
                    </Link>
                  </Flex>
                ))}
              </VStack>

              <Text color="gray.600" _dark={{ color: "gray.400" }} pt={4}>
                Responderemos sua mensagem o mais breve possível.
              </Text>
            </VStack>
          </MotionGridItem>

          {/* Coluna da Direita: Formulário (Animada) */}
          <MotionGridItem
            variants={rightColumnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <VStack
              as="form"
              spacing={5}
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
              boxShadow="md"
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="full">
                <FormControl>
                  <FormLabel color="gray.700" _dark={{ color: "gray.200" }}>
                    Nome
                  </FormLabel>
                  <Input placeholder="Seu nome" {...inputStyles} />
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.700" _dark={{ color: "gray.200" }}>
                    E-mail
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="voce@empresa.com"
                    {...inputStyles}
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel color="gray.700" _dark={{ color: "gray.200" }}>
                  Empresa
                </FormLabel>
                <Input placeholder="Nome da sua empresa" {...inputStyles} />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.700" _dark={{ color: "gray.200" }}>
                  Mensagem
                </FormLabel>
                <Textarea
                  placeholder="Como podemos ajudar?"
                  rows={5}
                  {...inputStyles}
                />
              </FormControl>

              <Flex w="full" align="center" justify="flex-start">
                <Button
                  colorScheme="green"
                  rightIcon={<FaPaperPlane />}
                  transition="transform 0.2s"
                  _hover={{ transform: "translateY(-2px)" }}
                >
                  Enviar Mensagem
                </Button>
              </Flex>
            </VStack>
          </MotionGridItem>
        </Grid>
      </Container>
    </Box>
  );
}
