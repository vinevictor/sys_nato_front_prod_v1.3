"use client";

import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import NotificationMenu from "./NotificationMenu";
import UserProfilePopover from "./UserProfilePopover";
import { SidebarNavigationProps } from "./types";

/**
 * Componente principal de navegação lateral
 * Sidebar responsiva com menu de navegação, notificações e perfil do usuário
 */
export default function SidebarNavigation({
  menuItems,
  session,
  notifications = [],
  onNotificationClick,
  onMarkAsRead,
}: SidebarNavigationProps) {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Detecta se é mobile/tablet
  const isMobile = useBreakpointValue(
    { base: true, md: true, lg: false },
    { ssr: false }
  );

  // Fecha drawer ao mudar de rota
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Cores adaptativas ao tema
  const bgColor = useColorModeValue("white", "#023147");
  const borderColor = useColorModeValue("gray.200", "rgba(246, 243, 233, 0.1)");
  const textColor = useColorModeValue("gray.700", "#f6f3e9");
  const mutedColor = useColorModeValue("gray.500", "rgba(246, 243, 233, 0.7)");
  const hoverBg = useColorModeValue("gray.50", "rgba(251, 133, 1, 0.1)");
  const activeBg = useColorModeValue(
    "rgba(251, 133, 1, 0.1)",
    "rgba(251, 133, 1, 0.2)"
  );
  const activeColor = "#fb8501";

  /**
   * Conteúdo da sidebar (reutilizado no drawer mobile)
   */
  const SidebarContent = () => (
    <Flex
      direction="column"
      h="100%"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
    >
      {/* Logo/Header da Sidebar */}
      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={activeColor}
          textAlign="center"
        >
          SISNATO
        </Text>
      </Box>

      {/* Menu de Navegação */}
      <VStack
        flex={1}
        spacing={1}
        align="stretch"
        p={3}
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: borderColor,
            borderRadius: "2px",
          },
        }}
      >
        {menuItems.map((item) => {
          const isActive = pathname === item.href || item.isActive;

          return (
            <Link key={item.id} href={item.href} passHref>
              <Box
                as="a"
                display="block"
                px={3}
                py={3}
                borderRadius="lg"
                bg={isActive ? activeBg : "transparent"}
                borderLeft="3px solid"
                borderLeftColor={isActive ? activeColor : "transparent"}
                color={isActive ? activeColor : textColor}
                _hover={{
                  bg: hoverBg,
                  transform: "translateX(2px)",
                  boxShadow: "sm",
                }}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                cursor="pointer"
                position="relative"
              >
                <HStack spacing={3} justify="space-between">
                  <HStack spacing={3} flex={1}>
                    <Icon
                      as={item.icon}
                      boxSize={5}
                      color={isActive ? activeColor : mutedColor}
                    />
                    <Text
                      fontSize="sm"
                      fontWeight={isActive ? "semibold" : "normal"}
                      noOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </HStack>

                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge
                      colorScheme="orange"
                      borderRadius="full"
                      fontSize="10px"
                      minW="20px"
                      textAlign="center"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                  )}
                </HStack>
              </Box>
            </Link>
          );
        })}
      </VStack>

      {/* Seção Inferior: Notificações + Perfil */}
      <Box
        p={3}
        borderTop="1px solid"
        borderColor={borderColor}
        bg={useColorModeValue("gray.50", "rgba(2, 49, 71, 0.5)")}
      >
        <VStack spacing={3} align="stretch">
          {/* Menu de Notificações */}
          <Flex justify="center">
            <NotificationMenu
              notifications={notifications}
              onNotificationClick={onNotificationClick}
              onMarkAsRead={onMarkAsRead}
            />
          </Flex>

          {/* Botão de Perfil do Usuário */}
          <UserProfilePopover user={session} />
        </VStack>
      </Box>
    </Flex>
  );

  // Mobile: Renderiza botão hambúrguer + drawer
  if (isMobile) {
    return (
      <>
        {/* Botão Hambúrguer Flutuante */}
        <IconButton
          aria-label="Abrir menu"
          icon={<Icon as={HiMenuAlt2} boxSize={6} />}
          onClick={onOpen}
          position="fixed"
          top={4}
          left={4}
          zIndex={999}
          colorScheme="orange"
          size="md"
          boxShadow="lg"
          _hover={{
            transform: "scale(1.05)",
          }}
          transition="all 0.2s"
        />

        {/* Drawer Mobile */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
          <DrawerOverlay />
          <DrawerContent bg={bgColor}>
            <DrawerCloseButton color={textColor} />
            <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
              <Text color={activeColor} fontWeight="bold">
                Menu
              </Text>
            </DrawerHeader>
            <DrawerBody p={0}>
              <Box h="100%">
                <SidebarContent />
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop: Renderiza sidebar fixa
  return (
    <Box
      w="260px"
      h="100%"
      flexShrink={0}
      position="relative"
      boxShadow="sm"
    >
      <SidebarContent />
    </Box>
  );
}
