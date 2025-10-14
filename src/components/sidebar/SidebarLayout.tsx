"use client";

import { Box, Flex, Link, Text, chakra } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import SidebarNavigation from "./SidebarNavigation";
import { PhoneIcon } from "@chakra-ui/icons";

/**
 * Props do SidebarLayout
 * @param session - Dados da sessão do usuário
 * @param children - Conteúdo da página
 */
interface SidebarLayoutProps {
  session: SessionNext.Client | null;
  children: React.ReactNode;
}

/**
 * Layout wrapper para gerenciar sidebar e conteúdo
 * 
 * Funcionalidades:
 * - Gerencia estado de collapse da sidebar
 * - Ajusta margem do conteúdo baseado no estado
 * - Responsivo para mobile/tablet/desktop
 * 
 * @component
 */
export default function SidebarLayout({ session, children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Flex w="100vw" h="100dvh" overflow="hidden" position="relative">
      {/* Sidebar de navegação */}
      <SidebarNavigation session={session} onCollapse={setIsCollapsed} />

      {/* Área de conteúdo principal */}
      <Flex
        flex={1}
        direction="column"
        ml={{ base: 0, md: isCollapsed ? "0" : "280px" }}
        h="100dvh"
        bg="gray.50"
        _dark={{ bg: "gray.900" }}
        transition="margin-left 0.3s ease"
      >
        {/* Conteúdo principal com scroll */}
        <Box px={4} flex={1} overflowY="auto">
          {children}
        </Box>

        {/* Footer fixo na parte inferior */}
        <chakra.footer
          display="flex"
          flexDirection={{ base: "column", lg: "row" }}
          justifyContent="space-evenly"
          alignItems="center"
          gap={{ base: 3, lg: 4 }}
          py={4}
          px={6}
          borderTop="1px"
          borderColor="gray.200"
          bg="white"
          _dark={{
            bg: "gray.800",
            borderColor: "gray.700",
          }}
        >
          {/* Copyright */}
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            © 2024 SISNATO. Todos os direitos reservados.
          </Text>

          {/* Links de termos */}
          <Flex gap={4} fontSize="sm">
            <Link
              href="/termos/uso"
              color="blue.600"
              _hover={{ textDecoration: "underline" }}
              _dark={{ color: "blue.400" }}
            >
              Termos de Uso
            </Link>
            <Link
              href="/termos/privacidade"
              color="blue.600"
              _hover={{ textDecoration: "underline" }}
              _dark={{ color: "blue.400" }}
            >
              Política de Privacidade
            </Link>
          </Flex>

          {/* Suporte */}
          <Flex alignItems="center" gap={2} fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            <Text>Precisa de Ajuda?</Text>
            <PhoneIcon />
            <Link
              href="https://wa.me/5516992800713?text=Olá,%20preciso%20de%20ajuda%20com%20o%20SISNATO"
              target="_blank"
              rel="noopener noreferrer"
              color="blue.600"
              fontWeight="medium"
              _hover={{ textDecoration: "underline" }}
              _dark={{ color: "blue.400" }}
            >
              (16) 9 9280-0713
            </Link>
          </Flex>

          {/* Versão */}
          <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.500" }}>
            Versão: {process.env.NEXT_PUBLIC_DEPLOY_VERSION || "1.0.0"}
          </Text>
        </chakra.footer>
      </Flex>
    </Flex>
  );
}
