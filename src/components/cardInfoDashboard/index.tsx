import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

type CardInfoDashboardProps = {
  title: string;
  value: string | number;
  icon: React.ReactElement;
};

export default function CardInfoDashboard({
  title,
  value,
  icon,
}: CardInfoDashboardProps) {
  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
      p={{ base: 3, sm: 3.5, md: 4 }}
      borderRadius={{ base: "lg", md: "xl" }}
      shadow={{ base: "sm", md: "md" }}
      borderWidth="1px"
      borderColor="gray.200"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "xl",
        borderColor: "#00713D",
      }}
      position="relative"
      overflow="hidden"
      minH={{ base: "130px", sm: "140px", md: "160px" }}
      w="100%"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="4px"
        bgGradient="linear(to-r, #00713D, #00d672)"
      />

      <Flex direction="column" gap={3} align="flex-start" w="full">
        <Box
          p={{ base: 1.5, md: 2 }}
          bg="green.50"
          _dark={{ bg: "green.900", color: "#00d672" }}
          borderRadius="lg"
          color="#00713D"
          fontSize="1.4rem"
        >
          {icon}
        </Box>

        <Text
          fontSize={{ base: "xs", md: "xs" }}
          fontWeight="medium"
          color="gray.600"
          _dark={{ color: "gray.400" }}
          lineHeight="1.2"
          noOfLines={2}
        >
          {title}
        </Text>

        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#023147"
          _dark={{ color: "gray.100" }}
          fontWeight="extrabold"
          lineHeight={1}
        >
          {value}
        </Heading>
      </Flex>
    </Box>
  );
}
