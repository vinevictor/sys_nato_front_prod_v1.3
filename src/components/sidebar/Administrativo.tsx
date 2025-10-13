"use client";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Portal,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  FiUsers,
  FiHome,
  FiDollarSign,
  FiTag,
  FiSettings,
} from "react-icons/fi";

/**
 * Interface para definir um item do menu administrativo
 */
interface AdminMenuItem {
  name: string;
  icon: typeof FiUsers;
  href: string;
  description: string;
}

/**
 * Itens do menu administrativo
 */
const adminMenuItems: AdminMenuItem[] = [
  {
    name: "Usuários",
    icon: FiUsers,
    href: "/users",
    description: "Gerenciar usuários do sistema",
  },
  {
    name: "Empreendimentos",
    icon: FiHome,
    href: "/empreendimentos",
    description: "Gerenciar empreendimentos",
  },
  {
    name: "Construtoras",
    icon: FiSettings,
    href: "/construtoras",
    description: "Gerenciar construtoras",
  },
  {
    name: "Financeiras",
    icon: FiDollarSign,
    href: "/financeiras",
    description: "Gerenciar CCas/Financeiras",
  },
  {
    name: "Tags",
    icon: FiTag,
    href: "/tags",
    description: "Gerenciar tags do sistema",
  },
];

/**
 * Componente de Menu de Administração geral
 *
 * Funcionalidades:
 * - Menu Usuários que envia para rota /users
 * - Menu Empreendimentos que envia para rota /empreendimentos
 * - Menu Construtoras que envia para rota /construtoras
 * - Menu Financeiras que envia para rota /financeiras
 * - Menu Tags que envia para rota /tags
 *
 * @component
 */
export default function AdministrativoMenu() {
  // Cores dinâmicas baseadas no tema
  const bgButton = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const menuBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("#023147", "gray.100");
  const subtextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Menu placement="right-start" isLazy>
      <MenuButton
        as={Button}
        w="full"
        h="auto"
        p={2}
        bg={bgButton}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        _hover={{
          bg: hoverBg,
          borderColor: "#FB8501",
        }}
        transition="all 0.2s ease"
      >
        <HStack spacing={3} w="full">
          {/* Ícone de administração */}
          <Icon
            as={FiSettings}
            fontSize="20"
            color={textColor}
            transition="all 0.2s"
          />

          {/* Texto */}
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              Administração
            </Text>
          </VStack>
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
          p={2}
        >
          {adminMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <MenuItem
                bg={'transparent'}
                _hover={{ bg: hoverBg }}
                borderRadius="md"
                py={3}
                px={3}
              >
                <HStack spacing={3} w="full">
                  {/* Ícone do item */}
                  <Icon
                    as={item.icon}
                    fontSize="18"
                    color="#FB8501"
                  />

                  {/* Conteúdo */}
                  <VStack align="start" spacing={0} flex={1}>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color={textColor}
                    >
                      {item.name}
                    </Text>
                    <Text fontSize="xs" color={subtextColor}>
                      {item.description}
                    </Text>
                  </VStack>
                </HStack>
              </MenuItem>
            </Link>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
}
