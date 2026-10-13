"use client";

import {
  Button,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiMessageCircle } from "react-icons/fi";

/**
 * Botão do webchat de atendimento (página /atendimento)
 * Visível para ADM ou usuários com role.chat
 */
export default function ChatButton() {
  const bgButton = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const textColor = useColorModeValue("#023147", "gray.100");

  return (
    <Link href="/atendimento" style={{ textDecoration: "none", width: "100%" }}>
      <Button
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
          <Icon as={FiMessageCircle} fontSize="20" color={textColor} />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              Chat
            </Text>
          </VStack>
        </HStack>
      </Button>
    </Link>
  );
}
