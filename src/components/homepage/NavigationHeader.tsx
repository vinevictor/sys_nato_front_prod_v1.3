"use client";

import { Box, Button, Container, Flex, HStack, Image } from "@chakra-ui/react";
import Link from "next/link";

/**
 * Componente de navegação fixo no topo da página
 * Utiliza client component para interatividade dos links e botões
 */
export default function NavigationHeader() {
  return (
    <Box
      bg="rgba(0,0,0,0.3)"
      position="fixed"
      w="100%"
      zIndex={1000}
      backdropFilter="blur(10px)"
    >
      <Container maxW="7xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Box>
            <Image
              src="/SisnatoLogoL.png"
              alt="SisNATO"
              height="40px"
              objectFit="contain"
            />
          </Box>

          {/* Navigation Menu */}
          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            <Box _hover={{ color: "green.400" }} color="white">
              <Link href="#servicos">Serviços</Link>
            </Box>

            <Box _hover={{ color: "green.400" }} color="white">
              <Link href="#experiencia">
                Experiência
              </Link>
            </Box>
          </HStack>

          {/* Action Buttons */}
          <HStack spacing={4}>
            <Button
              as="a"
              href="/login"
              variant="outline"
              color="white"
              colorScheme="gray"
              size="sm"
            >
              Login
            </Button>

            <Button
              as="a"
              href="https://wa.me/5516992800713?text=Olá! Tenho interesse em me cadastrar no SisNATO e gostaria de saber mais sobre como criar minha conta na plataforma."
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="green"
              size="sm"
            >
              Cadastre-se
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
