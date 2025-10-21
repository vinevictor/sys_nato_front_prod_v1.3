"use client";

import {
  Box,
  Flex,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  VStack,
  HStack,
  Icon,
  Switch,
  useColorMode,
  useColorModeValue,
  Button,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiUser, FiMoon, FiSun, FiBell, FiChevronRight, FiLogOut } from "react-icons/fi";
import Link from "next/link";

/**
 * Props do componente UserProfilePopover
 * @param session - Dados da sessão do usuário
 */
interface UserProfilePopoverProps {
  session: SessionNext.Client | null;
}

/**
 * Componente Menu de Perfil do Usuário
 * 
 * Funcionalidades:
 * - Exibe avatar e nome do usuário
 * - Menu com opções: Perfil, Tema (Dark/Light), Notificações
 * - Switch para alternar tema
 * - Switch para ativar/desativar notificações
 * - Não quebra o layout (usa Menu ao invés de Popover)
 * 
 * @component
 */
export default function UserProfilePopover({
  session,
}: UserProfilePopoverProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Cores dinâmicas baseadas no tema
  const bgButton = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const menuBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("#023147", "gray.100");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const theme = useColorModeValue("light", "dark");

  /**
   * Handler para alternar notificações
   */
  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    console.log("Notificações:", !notificationsEnabled ? "ativadas" : "desativadas");
  };

  // Nome e cargo do usuário
  const userName = session?.nome || "Usuário";
  const userCargo = session?.cargo || "Cargo não definido";

  return (
    <Menu placement="right-end" isLazy>
      <MenuButton
        as={Button}
        w="full"
        h="auto"
        p={3}
        mt={3}
        bg={bgButton}
        borderRadius="xl"
        _hover={{
          bg: hoverBg,
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(251, 133, 1, 0.3)",
        }}
        _active={{
          transform: "translateY(0)",
        }}
        transition="all 0.2s ease"
        position="relative"
        overflow="hidden"
      >
        {/* Gradiente decorativo sutil */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="2px"
          bgGradient="linear(to-r, #023147, #FB8501)"
        />

        <HStack spacing={3} w="full">
          {/* Avatar do usuário */}
          <Avatar
            size="md"
            name={userName}
            bg="#023147"
            color="white"
            fontWeight="bold"
            border="2px solid"
            borderColor="#FB8501"
          />

          {/* Informações do usuário */}
          <VStack align="start" spacing={0} flex={1} overflow="hidden">
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={textColor}
              noOfLines={1}
              w="full"
            >
              {userName}
            </Text>
          </VStack>

          {/* Ícone indicador */}
          <Icon as={FiChevronRight} color="#FB8501" fontSize="16" />
        </HStack>
      </MenuButton>

      <Portal>
        <MenuList
          bg={menuBg}
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="2xl"
          w="280px"
          zIndex={9999}
          py={2}
        >
          {/* Header com informações do usuário */}
          <Box px={4} py={3}>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>
              {userName}
            </Text>
            <Text fontSize="xs" color={subtextColor}>
              {userCargo}
            </Text>
          </Box>

          <MenuDivider />

          {/* Opção: Perfil */}
          {/* <MenuItem
            as={Link}
            bg="transparent"
            href="/perfil"
            icon={
              <Icon
                as={FiUser}
                fontSize="18"
                color={theme === "light" ? "#023147" : "white"}
              />
            }
            _hover={{ bg: hoverBg }}
            fontSize="sm"
            color={textColor}
          >
            Meu Perfil
          </MenuItem> */}

          {/* Opção: Tema (Dark/Light Mode) */}
          <MenuItem
            onClick={toggleColorMode}
            icon={
              <Icon
                as={colorMode === "light" ? FiSun : FiMoon}
                fontSize="18"
                color="#FB8501"
              />
            }
            bg="transparent"
            _hover={{ bg: hoverBg }}
            closeOnSelect={false}
          >
            <Flex justify="space-between" align="center" w="full">
              <VStack align="start" spacing={0} flex={1}>
                <Text fontSize="sm" color={textColor}>
                  Tema {colorMode === "light" ? "Claro" : "Escuro"}
                </Text>
                <Text fontSize="xs" color={subtextColor}>
                  Alternar aparência
                </Text>
              </VStack>
              <Switch
                colorScheme="orange"
                isChecked={colorMode === "dark"}
                onChange={toggleColorMode}
                size="md"
                ml={2}
              />
            </Flex>
          </MenuItem>

          {/* Opção: Notificações */}
          {/* <MenuItem
            onClick={handleNotificationToggle}
            icon={
              <Icon
                as={FiBell}
                fontSize="18"
                color={theme === "light" ? "#023147" : "white"}
              />
            }
            _hover={{ bg: hoverBg }}
            bg="transparent"
            closeOnSelect={false}
          >
            <Flex justify="space-between" align="center" w="full">
              <VStack align="start" spacing={0} flex={1}>
                <Text fontSize="sm" color={textColor}>
                  Notificações
                </Text>
                <Text fontSize="xs" color={subtextColor}>
                  {notificationsEnabled ? "Ativadas" : "Desativadas"}
                </Text>
              </VStack>
              <Switch
                colorScheme="orange"
                isChecked={notificationsEnabled}
                onChange={handleNotificationToggle}
                size="md"
                ml={2}
              />
            </Flex>
          </MenuItem> */}

          <MenuDivider />

          {/* Botão de Sair */}
          <MenuItem
            as={Link}
            bg="transparent"
            href="/api/auth/logout"
            icon={<Icon as={FiLogOut} fontSize="18" color="red.500" />}
            _hover={{ bg: "red.50" }}
            color="red.500"
            fontSize="sm"
          >
            Sair da conta
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
}
