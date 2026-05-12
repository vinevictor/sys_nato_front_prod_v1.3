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
import { FiBarChart2, FiActivity, FiPieChart } from "react-icons/fi";

/**
 * Interface para os itens de Dashboard
 */
interface DashboardMenuItem {
  name: string;
  icon: any;
  href: string;
  description: string;
}

/**
 * Itens do menu de Dashboards
 */
const dashboardMenuItems: DashboardMenuItem[] = [
  {
    name: "Dashboard Global",
    icon: FiPieChart,
    href: "/dashboard",
    description: "Visão geral e status em tempo real",
  },
  {
    name: "Analytics",
    icon: FiActivity,
    href: "/analytics",
    description: "Performance, SLAs e rankings detalhados",
  },
];

/**
 * Componente de Menu de Dashboards
 * * Substitui o antigo MetricsButton por um menu drop-side
 * @component
 */
export default function DashboardsMenu() {
  // Cores dinâmicas baseadas no tema (seguindo seu padrão)
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
          {/* Ícone principal de Dashboards */}
          <Icon
            as={FiBarChart2}
            fontSize="20"
            color={textColor}
            transition="all 0.2s"
          />

          {/* Texto principal */}
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              Dashboards
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
          {dashboardMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <MenuItem
                bg={"transparent"}
                _hover={{ bg: hoverBg }}
                borderRadius="md"
                py={3}
                px={3}
              >
                <HStack spacing={3} w="full">
                  {/* Ícone com a cor laranja padrão do seu sistema */}
                  <Icon as={item.icon} fontSize="18" color="#FB8501" />

                  {/* Conteúdo do item */}
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                      {item.name}
                    </Text>
                    <Text fontSize="xs" color={subtextColor} noOfLines={1}>
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
