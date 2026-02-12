"use client";

import {
  Box,
  Flex,
  Link,
  Text,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import SidebarNavigation from "./SidebarNavigation";
import { PhoneIcon } from "@chakra-ui/icons";
import { Session } from "@/types/session";

interface SidebarLayoutProps {
  session: Session.AuthUser | null;
  children: React.ReactNode;
}

export default function SidebarLayout({
  session,
  children,
}: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Cores dinâmicas para evitar conflito de hidratação
  const mainBg = useColorModeValue("gray.50", "gray.900");
  const footerBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Se não estiver montado, renderizamos um container neutro para evitar o flash de cor errada
  if (!mounted) {
    return (
      <Flex w="100vw" h="100dvh" bg="gray.50" _dark={{ bg: "gray.900" }} />
    );
  }

  return (
    <Flex
      w="100vw"
      h="100dvh"
      overflow="hidden"
      position="relative"
      bg={mainBg}
    >
      <SidebarNavigation session={session} onCollapse={setIsCollapsed} />

      <Flex
        flex={1}
        direction="column"
        ml={{ base: 0, md: isCollapsed ? "0" : "280px" }}
        h="100dvh"
        bg={mainBg} // Usando a cor reativa aqui
        transition="margin-left 0.3s ease"
      >
        <Box px={4} flex={1} overflowY="auto">
          {children}
        </Box>

        <chakra.footer
          display="flex"
          flexDirection={{ base: "column", lg: "row" }}
          justifyContent="space-evenly"
          alignItems="center"
          gap={{ base: 3, lg: 4 }}
          py={4}
          px={6}
          borderTop="1px"
          borderColor={borderColor} // Cor reativa
          bg={footerBg} // Cor reativa
        >
          <Text fontSize="sm" color={textColor}>
            © 2024 SISNATO. Todos os direitos reservados.
          </Text>

          <Flex gap={4} fontSize="sm">
            <Link
              href="/termos/uso"
              color="blue.600"
              _dark={{ color: "blue.400" }}
              _hover={{ textDecoration: "underline" }}
            >
              Termos de Uso
            </Link>
            <Link
              href="/termos/privacidade"
              color="blue.600"
              _dark={{ color: "blue.400" }}
              _hover={{ textDecoration: "underline" }}
            >
              Política de Privacidade
            </Link>
          </Flex>

          <Flex alignItems="center" gap={2} fontSize="sm" color={textColor}>
            <Text>Precisa de Ajuda?</Text>
            <PhoneIcon />
            <Link
              href="https://wa.me/5516992800713?text=Olá,%20preciso%20de%20ajuda%20com%20o%20SISNATO"
              target="_blank"
              rel="noopener noreferrer"
              color="blue.600"
              fontWeight="medium"
              _dark={{ color: "blue.400" }}
              _hover={{ textDecoration: "underline" }}
            >
              (16) 9 9280-0713
            </Link>
          </Flex>

          <Text fontSize="xs" color="gray.500">
            Versão: {process.env.NEXT_PUBLIC_DEPLOY_VERSION || "1.0.0"}
          </Text>
        </chakra.footer>
      </Flex>
    </Flex>
  );
}
