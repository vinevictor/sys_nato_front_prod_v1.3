"use client";
import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Td,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

/**
 * Skeleton apenas das linhas (Tr) para renderizar dentro do Tbody
 * Usado quando a tabela está carregando mas queremos manter header/footer visíveis
 */
export const TableRowsSkeleton = () => {
  return (
    <>
      {/* Renderiza 3 linhas skeleton */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Tr key={`skeleton-row-${index}`}>
          <Td p={{ base: "0.5rem", md: "0.8rem" }}>
            <Flex gap={2} justifyContent="center">
              <Skeleton height="32px" width="80px" borderRadius="md" />
              <Skeleton height="32px" width="80px" borderRadius="md" />
            </Flex>
          </Td>
          <Td p={{ base: "0.5rem", md: "0.8rem" }}>
            <Skeleton height="20px" width="40px" />
          </Td>
          <Td p={{ base: "0.5rem", md: "0.8rem" }}>
            <Skeleton height="20px" width="200px" />
          </Td>
          <Td p={{ base: "0.5rem", md: "0.8rem" }}>
            <Skeleton height="20px" width="120px" />
          </Td>
          <Td p={{ base: "0.5rem", md: "0.8rem" }}>
            <Skeleton height="20px" width="80px" mx="auto" />
          </Td>
          <Td p={{ base: "0.5rem", md: "0.8rem" }}>
            <Skeleton height="20px" width="100px" mx="auto" />
          </Td>
          <Td p={{ base: "0.5rem", md: "0.8rem" }}>
            <Skeleton height="20px" width="100px" mx="auto" />
          </Td>
          <Td p={{ base: "0.5rem", md: "0.8rem" }}>
            <Skeleton height="24px" width="90px" borderRadius="md" mx="auto" />
          </Td>
          <Td p={{ base: "0.5rem", md: "0.8rem" }}>
            <Flex justifyContent="center">
              <SkeletonCircle size="6" />
            </Flex>
          </Td>
        </Tr>
      ))}
    </>
  );
};

/**
 * Skeleton para cards mobile
 * Simula a estrutura do card de vendas diretas
 */
export const CardSkeleton = () => {
  const bgCard = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <Box
          key={index}
          bg={bgCard}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={4}
          mb={3}
          shadow="sm"
        >
          {/* Header do Card */}
          <Flex justify="space-between" align="center" mb={3}>
            <Flex align="center" gap={2}>
              <Skeleton height="24px" width="40px" />
              <Skeleton height="20px" width="150px" />
            </Flex>
            <Skeleton height="24px" width="80px" borderRadius="md" />
          </Flex>

          {/* Conteúdo do Card */}
          <Box mb={3}>
            <SkeletonText noOfLines={3} spacing={2} />
          </Box>

          {/* Footer do Card com ações */}
          <Flex gap={2} mt={3}>
            <Skeleton height="36px" flex={1} borderRadius="md" />
            <Skeleton height="36px" flex={1} borderRadius="md" />
          </Flex>
        </Box>
      ))}
    </>
  );
};

