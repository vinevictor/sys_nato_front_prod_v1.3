"use client";

import {
  Box,
  Flex,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUserAlt } from "react-icons/fa";

interface MiniTopListProps {
  title: string;
  items: {
    label: string;
    value: string;
  }[];
}

export default function MiniTopList({ title, items }: MiniTopListProps) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const badgeBg = useColorModeValue("green.50", "rgba(0, 113, 60, 0.15)");
  const badgeColor = useColorModeValue("#00713C", "#00d672");

  return (
    <Box
      bg={bg}
      p={6}
      borderRadius="24px"
      border="1px solid"
      borderColor={borderColor}
      shadow="sm"
    >
      <Flex align="center" gap={2} mb={4}>
        <Icon as={FaUserAlt} color="gray.400" boxSize={3.5} />
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="gray.500"
          letterSpacing="wider"
        >
          {title.toUpperCase()}
        </Text>
      </Flex>

      {items && items.length > 0 ? (
        <VStack spacing={3} align="stretch">
          {items.map((item, index) => (
            <Flex
              key={index}
              justify="space-between"
              align="center"
              py={2}
              borderBottom={index !== items.length - 1 ? "1px dashed" : "none"}
              borderColor={borderColor}
            >
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color={textColor}
                noOfLines={1}
                maxW="70%"
              >
                {item.label}
              </Text>
              <Box
                px={2.5}
                py={1}
                bg={badgeBg}
                color={badgeColor}
                borderRadius="lg"
                fontSize="xs"
                fontWeight="bold"
              >
                {item.value}
              </Box>
            </Flex>
          ))}
        </VStack>
      ) : (
        <Text fontSize="xs" color="gray.500" textAlign="center" py={4}>
          Nenhum registro encontrado no período.
        </Text>
      )}
    </Box>
  );
}
