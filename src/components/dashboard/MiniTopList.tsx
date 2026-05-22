"use client";

import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUserAlt } from "react-icons/fa";

interface MiniTopListItem {
  label: string;
  value: string;
  construtoras?: string[];
  financeiras?: string[];
}

interface MiniTopListProps {
  title: string;
  items: MiniTopListItem[];
}

export default function MiniTopList({ title, items }: MiniTopListProps) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const badgeBg = useColorModeValue("green.50", "rgba(0, 113, 60, 0.15)");
  const badgeColor = useColorModeValue("#00713C", "#00d672");

  const formatBadgeText = (text: string) => {
    if (!text) return "";
    return text.length > 10 ? `${text.substring(0, 10)}...` : text;
  };

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
        <VStack spacing={4} align="stretch">
          {items.map((item, index) => (
            <Box
              key={index}
              pb={3}
              borderBottom={index !== items.length - 1 ? "1px dashed" : "none"}
              borderColor={borderColor}
            >
              {/* Linha Superior: Nome do usuário e total de acessos */}
              <Flex justify="space-between" align="center" mb={1.5}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={textColor}
                  noOfLines={1}
                  maxW="65%"
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

              {/* Linha Inferior: Badges de Construtoras e Financeiras vinculadas */}
              <HStack spacing={1.5} wrap="wrap" rowGap={1}>
                {/* Renderiza as Construtoras */}
                {item.construtoras?.map((constName, idx) => (
                  <Badge
                    key={`c-${idx}`}
                    colorScheme="green"
                    variant="subtle"
                    fontSize="10px"
                    borderRadius="md"
                    px={1.5}
                    textTransform="none"
                    title={constName}
                  >
                    🏢 {formatBadgeText(constName)}
                  </Badge>
                ))}

                {/* Renderiza as Financeiras / CCAs */}
                {item.financeiras?.map((finName, idx) => (
                  <Badge
                    key={`f-${idx}`}
                    colorScheme="blue"
                    variant="subtle"
                    fontSize="10px"
                    borderRadius="md"
                    px={1.5}
                    textTransform="none"
                    title={finName}
                  >
                    💰 {formatBadgeText(finName)}
                  </Badge>
                ))}

                {/* Caso o usuário não tenha nenhum vínculo ativo */}
                {!item.construtoras?.length && !item.financeiras?.length && (
                  <Text fontSize="10px" color="gray.400" fontStyle="italic">
                    Sem vínculos cadastrados
                  </Text>
                )}
              </HStack>
            </Box>
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
