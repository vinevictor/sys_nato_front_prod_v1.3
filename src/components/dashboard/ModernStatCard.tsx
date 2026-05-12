// components/dashboard/ModernStatCard.tsx
"use client";
import {
  Box,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Heading,
  Square,
  VStack,
} from "@chakra-ui/react";

type StatProps = {
  title: string;
  value: string | number;
  icon: any;
  trend?: string; // Ex: "+12%"
  isWarning?: boolean;
};

export default function ModernStatCard({
  title,
  value,
  icon: IconComponent,
  trend,
  isWarning,
}: StatProps) {
  const bg = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
    "rgba(23, 25, 35, 0.6)"
  );
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const iconBg = isWarning ? "orange.100" : "green.100";
  const iconColor = isWarning ? "orange.600" : "#00713C";
  const progressColor = isWarning ? "orange.400" : "green.400";

  return (
    <Box
      px={6}
      py={5}
      bg={bg}
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="24px"
      shadow="sm"
      transition="all 0.3s cubic-bezier(.08,.52,.52,1)"
      _hover={{
        transform: "translateY(-5px)",
        shadow: "2xl",
        borderColor: iconColor,
      }}
    >
      <Flex align="center" justify="space-between" mb={4}>
        <Square
          size="48px"
          bg={iconBg}
          color={iconColor}
          borderRadius="16px"
          shadow="0 8px 20px -6px rgba(72, 187, 120, 0.6)"
        >
          <Icon as={IconComponent} boxSize={5} />
        </Square>
        {trend && (
          <Box
            px={2}
            py={1}
            bg={isWarning ? "orange.50" : "green.50"}
            color={isWarning ? "orange.600" : "green.600"}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
          >
            {trend}
          </Box>
        )}
      </Flex>

      <VStack align="start" spacing={0}>
        <Text
          fontSize="sm"
          fontWeight="medium"
          color="gray.500"
          letterSpacing="wide"
        >
          {title.toUpperCase()}
        </Text>
        <Heading
          fontSize="3xl"
          fontWeight="800"
          color={useColorModeValue("gray.800", "white")}
          letterSpacing="tight"
        >
          {value}
        </Heading>
      </VStack>
    </Box>
  );
}
