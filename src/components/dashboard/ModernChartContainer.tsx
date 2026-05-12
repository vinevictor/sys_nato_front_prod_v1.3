// components/dashboard/ModernChartContainer.tsx
"use client";
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Spacer,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FaExpandAlt, FaEllipsisH } from "react-icons/fa";

export default function ModernChartContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box
      bg={cardBg}
      borderRadius="24px"
      p={6}
      border="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      shadow="sm"
      h="full"
    >
      <Flex align="center" mb={6}>
        <Heading size="md" fontWeight="700" letterSpacing="tight">
          {title}
        </Heading>
        <Spacer />
        <HStack spacing={2}>
          <Button size="xs" variant="ghost" leftIcon={<FaExpandAlt />}>
            Focar
          </Button>
          <Button size="xs" variant="ghost">
            <FaEllipsisH />
          </Button>
        </HStack>
      </Flex>
      <Box h="300px" w="100%">
        {children}
      </Box>
    </Box>
  );
}
