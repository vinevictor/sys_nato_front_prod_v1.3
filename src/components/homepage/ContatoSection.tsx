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
  HStack,
  Icon,
  Input,
  Link,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
// Usaremos react-icons para ter mais variedade de ícones
import { FaMapMarkerAlt, FaPhoneAlt, FaGlobe } from "react-icons/fa";
import { EmailIcon } from "@chakra-ui/icons";

export default function ContatoSection() {
  // Estilo para os inputs no modo escuro
  const inputStyles = {
    bg: "white",
    borderColor: "gray.300",
    _dark: {
      bg: "gray.800",
      borderColor: "gray.600",
    },
    _hover: {
      borderColor: "gray.400",
      _dark: {
        borderColor: "gray.500",
      },
    },
  };

  return (
    <Box
      id="contato"
      scrollMarginTop="4rem"
      bg="gray.100"
      _dark={{ bg: "gray.900" }}
      py={{ base: 10, md: 14 }}
    >
      <Container maxW="6xl">
        <VStack spacing={3} mb={12} align="flex-start">
          <Heading
            as="h2"
            size="xl"
            color="green.600"
            _dark={{ color: "green.300" }}
          >
            Contato
          </Heading>
        </VStack>

        {/* Layout de duas colunas */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1.5fr" }} // Coluna da direita um pouco maior
          gap={8}
        >
          {/* Coluna da Esquerda: Informações */}
          <GridItem>
            <VStack
              align="flex-start"
              spacing={6}
              bg="white"
              _dark={{
                bg: "blackAlpha.400",
                borderColor: "gray.700",
                boxShadow: "none",
              }}
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

              <VStack spacing={4} align="flex-start" w="full">
                <HStack>
                  <Icon as={FaMapMarkerAlt} color="gray.500" />
                  <Text color="gray.700" _dark={{ color: "gray.300" }}>
                    Ribeirão Preto – SP
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={EmailIcon} color="gray.500" />
                  <Link
                    href="mailto:contato@sisnato.com.br"
                    color="blue.500"
                    _dark={{ color: "blue.300" }}
                  >
                    contato@sisnato.com.br
                  </Link>
                </HStack>
                <HStack>
                  <Icon as={FaPhoneAlt} color="gray.500" />
                  <Link
                    href="tel:+551632897492"
                    color="blue.500"
                    _dark={{ color: "blue.300" }}
                  >
                    (16) 3289-7492
                  </Link>
                </HStack>
                <HStack>
                  <Icon as={FaGlobe} color="gray.500" />
                  <Link
                    href="https://www.sisnato.com.br"
                    isExternal
                    color="blue.500"
                    _dark={{ color: "blue.300" }}
                  >
                    www.sisnato.com.br
                  </Link>
                </HStack>
              </VStack>

              <Text color="gray.600" _dark={{ color: "gray.400" }} pt={4}>
                Responderemos sua mensagem o mais breve possível.
              </Text>
            </VStack>
          </GridItem>

          {/* Coluna da Direita: Formulário */}
          <GridItem>
            <VStack
              as="form"
              spacing={5}
              bg="white"
              _dark={{
                bg: "blackAlpha.400",
                borderColor: "gray.700",
                boxShadow: "none",
              }}
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

              <Flex w="full" align="center" justify="space-between">
                <Button colorScheme="green">Enviar</Button>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  _dark={{ color: "gray.400" }}
                  fontStyle="italic"
                ></Text>
              </Flex>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
