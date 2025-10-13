"use client";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { FiUser, FiBell, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

/**
 * Componente de popover do perfil do usuário
 * Exibe menu com perfil, tema e configurações de notificação
 */
interface UserProfilePopoverProps {
  /** Dados do usuário da sessão */
  user: SessionNext.Client;
  /** Estado inicial das notificações */
  notificationsEnabled?: boolean;
  /** Callback ao alterar notificações */
  onNotificationToggle?: (enabled: boolean) => void;
}

export default function UserProfilePopover({
  user,
  notificationsEnabled = true,
  onNotificationToggle,
}: UserProfilePopoverProps) {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const [notifEnabled, setNotifEnabled] = useState(notificationsEnabled);

  // Cores adaptativas ao tema
  const bgColor = useColorModeValue("white", "#023147");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "rgba(251, 133, 1, 0.1)");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const buttonBg = useColorModeValue("white", "#023147");
  const buttonHoverBg = useColorModeValue("gray.50", "rgba(251, 133, 1, 0.15)");
  const buttonActiveBg = useColorModeValue("gray.100", "rgba(251, 133, 1, 0.25)");

  /**
   * Gera iniciais do nome do usuário para o avatar
   */
  const getInitials = (name: string): string => {
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  /**
   * Handler para toggle de notificações
   */
  const handleNotificationToggle = () => {
    const newState = !notifEnabled;
    setNotifEnabled(newState);
    onNotificationToggle?.(newState);
    
    // Salva preferência no localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("notifications_enabled", JSON.stringify(newState));
    }
  };

  /**
   * Handler para logout
   */
  const handleLogout = async () => {
    try {
      // Chama a API de logout
      await fetch("/api/auth/logout", { method: "POST" });
      // Redireciona para login
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <Popover placement="right-end" closeOnBlur={true}>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Button
              w="100%"
              h="auto"
              py={3}
              px={3}
              bg={buttonBg}
              _hover={{
                bg: buttonHoverBg,
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              _active={{
                bg: buttonActiveBg,
              }}
              borderRadius="lg"
              border="2px solid"
              borderColor="#fb8501"
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bg: "linear-gradient(135deg, rgba(251, 133, 1, 0.1) 0%, transparent 100%)",
                opacity: 0,
                transition: "opacity 0.3s",
              }}
              _focusVisible={{
                outline: "2px solid #fb8501",
                outlineOffset: "2px",
              }}
              sx={{
                "&:hover::before": {
                  opacity: 1,
                },
              }}
            >
              <HStack spacing={3} w="100%" position="relative" zIndex={1}>
                <Avatar
                  size="sm"
                  name={user.nome}
                  bg="#023147"
                  color="white"
                  fontWeight="bold"
                  border="2px solid"
                  borderColor="#fb8501"
                  getInitials={getInitials}
                />
                <VStack align="start" spacing={0} flex={1} overflow="hidden">
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color={textColor}
                    noOfLines={1}
                    w="100%"
                  >
                    {user.nome}
                  </Text>
                  <Text fontSize="xs" color={mutedColor} noOfLines={1} w="100%">
                    {user.cargo || user.hierarquia}
                  </Text>
                </VStack>
              </HStack>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            bg={bgColor}
            borderColor={borderColor}
            boxShadow="2xl"
            maxW="280px"
            w="280px"
          >
            <PopoverArrow bg={bgColor} />
            <PopoverBody p={3}>
              <VStack spacing={2} align="stretch">
                {/* Header do Perfil */}
                <Flex direction="column" align="center" py={2}>
                  <Avatar
                    size="lg"
                    name={user.nome}
                    bg="#023147"
                    color="white"
                    fontWeight="bold"
                    border="3px solid"
                    borderColor="#fb8501"
                    mb={2}
                    getInitials={getInitials}
                  />
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    color={textColor}
                    textAlign="center"
                  >
                    {user.nome}
                  </Text>
                  <Text fontSize="xs" color={mutedColor} textAlign="center">
                    {user.cargo || user.hierarquia}
                  </Text>
                  {user.telefone && (
                    <Text fontSize="xs" color={mutedColor} textAlign="center">
                      {user.telefone}
                    </Text>
                  )}
                </Flex>

                <Divider borderColor={borderColor} />

                {/* Menu de Perfil */}
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={FiUser} />}
                  size="sm"
                  _hover={{ bg: hoverBg }}
                  onClick={() => {
                    router.push("/perfil");
                    onClose();
                  }}
                >
                  Meu Perfil
                </Button>

                <Divider borderColor={borderColor} />

                {/* Toggle de Tema */}
                <HStack
                  justify="space-between"
                  px={3}
                  py={2}
                  borderRadius="md"
                  _hover={{ bg: hoverBg }}
                  cursor="pointer"
                  onClick={toggleColorMode}
                >
                  <HStack spacing={2}>
                    <Icon
                      as={colorMode === "light" ? BsSun : BsMoon}
                      color={colorMode === "light" ? "#fb8501" : "#f6f3e9"}
                    />
                    <Text fontSize="sm" color={textColor}>
                      Tema {colorMode === "light" ? "Claro" : "Escuro"}
                    </Text>
                  </HStack>
                  <Box
                    w="40px"
                    h="20px"
                    bg={colorMode === "dark" ? "#fb8501" : "gray.300"}
                    borderRadius="full"
                    position="relative"
                    transition="all 0.3s"
                  >
                    <Box
                      w="16px"
                      h="16px"
                      bg="white"
                      borderRadius="full"
                      position="absolute"
                      top="2px"
                      left={colorMode === "dark" ? "22px" : "2px"}
                      transition="all 0.3s"
                      boxShadow="sm"
                    />
                  </Box>
                </HStack>

                {/* Toggle de Notificações */}
                <HStack
                  justify="space-between"
                  px={3}
                  py={2}
                  borderRadius="md"
                  _hover={{ bg: hoverBg }}
                >
                  <HStack spacing={2}>
                    <Icon as={FiBell} color={notifEnabled ? "#fb8501" : mutedColor} />
                    <Text fontSize="sm" color={textColor}>
                      Notificações
                    </Text>
                  </HStack>
                  <Switch
                    colorScheme="orange"
                    isChecked={notifEnabled}
                    onChange={handleNotificationToggle}
                    size="sm"
                  />
                </HStack>

                <Divider borderColor={borderColor} />

                {/* Botão de Logout */}
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={FiLogOut} />}
                  size="sm"
                  colorScheme="red"
                  _hover={{ bg: "red.50" }}
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
