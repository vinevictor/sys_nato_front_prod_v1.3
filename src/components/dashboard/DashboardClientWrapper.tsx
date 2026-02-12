"use client";
import { Box, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Box minH="100vh" bg="white" _dark={{ bg: "gray.900" }} />;
  }

  return (
    <Box
      key={colorMode}
      minH="100vh"
      w="100%"
      bg={bgColor}
      transition="background 0.2s ease-in-out"
    >
      {children}
    </Box>
  );
}
