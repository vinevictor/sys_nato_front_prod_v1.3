"use client";

import {
  Box,
  Flex,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaMapMarkedAlt } from "react-icons/fa";

/**
 * Componente de Card (Movido para cá)
 */
interface MenuCardProps {
  title: string;
  description: string;
  icon: any;
  href: string;
  colorScheme: string;
}

const MenuCard = ({
  title,
  description,
  icon,
  href,
  colorScheme,
}: MenuCardProps) => {
  return (
    <LinkBox
      as="article"
      bg="white"
      p={6}
      borderRadius="xl"
      shadow="md"
      borderWidth="1px"
      borderColor="gray.100"
      _dark={{ borderColor: "gray.600", bg: "gray.800" }}
      transition="all 0.3s"
      _hover={{
        shadow: "xl",
        transform: "translateY(-5px)",
        borderColor: colorScheme,
      }}
      role="group"
      cursor="pointer"
    >
      <VStack align="start" spacing={4}>
        <Flex
          w={12}
          h={12}
          align="center"
          justify="center"
          borderRadius="lg"
          // Modo Claro: Usa a cor passada com transparência manual (se for Hex)
          bg={`${colorScheme}20`}
          // Modo Escuro: Usa um fundo branco transparente para destacar o ícone
          _dark={{ bg: "whiteAlpha.200" }}
          _groupHover={{ bg: colorScheme }}
          transition="all 0.3s"
        >
          <Icon
            as={icon}
            w={6}
            h={6}
            color={colorScheme}
            _groupHover={{ color: "white" }}
            _dark={{ color: colorScheme }}
            transition="all 0.3s"
          />
        </Flex>
        <Box>
          <Heading size="md" mb={2} color="#023147" _dark={{ color: "white" }}>
            <LinkOverlay as={NextLink} href={href}>
              <Text as="span">{title}</Text>
            </LinkOverlay>
          </Heading>
          <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
            {description}
          </Text>
        </Box>
      </VStack>
    </LinkBox>
  );
};

export default function MenuGrid() {
  return (
    // Box Wrapper para dar as margens que você pediu
    <Box
      w="100%"
      py={{ base: 6, md: 10 }} // Margem Topo e Baixo (Padding Vertical)
      px={{ base: 4, md: 8 }} // Margem Laterais (Padding Horizontal)
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
        <MenuCard
          title="Geolocalização"
          description="Busque a unidade ou empreendimento mais próximo do endereço do cliente."
          icon={FaMapMarkedAlt}
          href="/geo"
          colorScheme="#00713D"
        />
      </SimpleGrid>
    </Box>
  );
}
