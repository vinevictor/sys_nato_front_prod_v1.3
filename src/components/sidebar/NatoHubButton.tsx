"use client";

import { Session } from "@/types/session";
import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { FiGrid } from "react-icons/fi"; // Ícone de Grid para representar um "Hub"

interface NatoHubButtonProps {
  session: Session.AuthUser;
}

export default function NatoHubButton({ session }: NatoHubButtonProps) {
  // Cores padronizadas com o seu NavItemComponent
  const hoverBg = useColorModeValue("rgba(2, 49, 71, 0.08)", "whiteAlpha.200");
  const textColor = useColorModeValue("#023147", "gray.200");

  // VERIFICAÇÃO DE SEGURANÇA: Só renderiza se for ADM
  // Ajuste aqui se a regra for diferente (ex: session.hierarquia === 'ADM')
  if (!session?.role?.adm) {
    return null;
  }

  return (
    <Link href="/hub" style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p={2}
        mx={2}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={textColor}
        _hover={{
          bg: hoverBg,
          transform: "translateX(4px)",
        }}
        transition="all 0.2s ease"
      >
        <Icon
          as={FiGrid}
          fontSize="20"
          mr={3}
          transition="all 0.2s"
          _groupHover={{ transform: "scale(1.1)", color: "#FB8501" }}
        />
        <Text fontSize="sm" fontWeight="medium">
          Nato Hub
        </Text>
      </Flex>
    </Link>
  );
}
