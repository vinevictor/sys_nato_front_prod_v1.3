"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  Image,
  Switch,
  useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Link from "next/link";

export default function NavigationHeader() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      bg="rgba(255,255,255,0.8)"
      _dark={{ bg: "rgba(22, 29, 42, 0.8)" }}
      position="fixed"
      w="100%"
      zIndex={1000}
      backdropFilter="blur(10px)"
    >
      <Container maxW="8xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Box>
            <Image
              src={"/SisnatoLogoL.png"}
              alt="SisNATO"
              height="40px"
              objectFit="contain"
            />
          </Box>

          {/* Navigation Menu */}
          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            <Box
              color="gray.800"
              _dark={{ color: "white" }}
              _hover={{ color: "green.500" }}
            >
              <Link href="#inicio">Inicio</Link>
            </Box>
            <Box
              color="gray.800"
              _dark={{ color: "white" }}
              _hover={{ color: "green.500" }}
            >
              <Link href="#sobre">Sobre</Link>
            </Box>
            <Box
              color="gray.800"
              _dark={{ color: "white" }}
              _hover={{ color: "green.500" }}
            >
              <Link href="#solucoes">Soluções</Link>
            </Box>
            <Box
              color="gray.800"
              _dark={{ color: "white" }}
              _hover={{ color: "green.500" }}
            >
              <Link href="#comofunciona">Como Funciona</Link>
            </Box>
            <Box
              color="gray.800"
              _dark={{ color: "white" }}
              _hover={{ color: "green.500" }}
            >
              <Link href="#paraqueme">Para quem é</Link>
            </Box>
            <Box
              color="gray.800"
              _dark={{ color: "white" }}
              _hover={{ color: "green.500" }}
            >
              <Link href="#resultadosbeneficios">Resultados e Beneficios</Link>
            </Box>
            <Box
              color="gray.800"
              _dark={{ color: "white" }}
              _hover={{ color: "green.500" }}
            >
              <Link href="#planos">Planos</Link>
            </Box>
            <Box
              color="gray.800"
              _dark={{ color: "white" }}
              _hover={{ color: "green.500" }}
            >
              <Link href="#parceiras">Parceiros</Link>
            </Box>
            <Box
              color="gray.800"
              _dark={{ color: "white" }}
              _hover={{ color: "green.500" }}
            >
              <Link href="#contato">Contato</Link>
            </Box>
          </HStack>

          {/* Action Buttons & Theme Switcher */}
          <HStack spacing={{ base: 2, md: 4 }}>
            <Button
              as="a"
              href="/login"
              variant="outline"
              colorScheme="gray"
              color="gray.800"
              _dark={{ color: "white" }}
              size="sm"
            >
              Login
            </Button>

            <Button
              as="a"
              href="#QuerSerParceiro"
              rel="noopener noreferrer"
              colorScheme="green"
              size="sm"
            >
              Cadastre-se
            </Button>

            {/*  Switch  */}
            <HStack spacing={2}>
              <Switch
                colorScheme="green"
                id="theme-switch"
                isChecked={colorMode === "dark"}
                onChange={toggleColorMode}
              />
              {colorMode === "light" ? (
                <Icon as={SunIcon} color="orange.400" />
              ) : (
                <Icon as={MoonIcon} color="blue.300" />
              )}
            </HStack>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
