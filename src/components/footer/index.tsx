"use client";

import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import { FaPhoneVolume } from "react-icons/fa";

export default function FooterComponent() {
  const bg = "#00713D";

  return (
    <Flex
      w="100%"
      py={{ base: 1, md: 3 }}
      px={{ base: 1, md: 5 }}
      bg={bg}
      justifyContent={{ base: "center", md: "space-evenly" }}
      alignItems="center"
      flexDirection={{ base: "column", md: "row" }}
      gap="5px"
      textAlign="center"
    >
      <Flex
        w={"100%"}
        h="100%"
        gap="1rem"
        alignItems="center"
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <Text color="white">Precisa de Ajuda?</Text>
        <Button
          variant="link"
          color="white"
          leftIcon={<FaPhoneVolume />}
          size="sm"
        >
          (16) 3325-4134
        </Button>
      </Flex>

      <Box
        gap="1rem"
        justifyContent="center"
        mt={{ base: "10px", md: "0" }}
        flexDirection={{ base: "column", md: "row" }}
        display={{ base: "none", md: "flex" }}
      >
        <Button variant="link" color="white" size="sm">
          <Link href="/suportefaq" isExternal>
            FAQ
          </Link>
        </Button>
        <Button variant="link" color="white" size="sm">
          <Link href="/termos/uso">Termos de Uso</Link>
        </Button>
        <Button variant="link" color="white" size="sm">
          <Link href="/termos/privacidade">Politica de Privacidade</Link>
        </Button>
      </Box>
    

      <Flex
        w={{ base: "100%", md: "33%" }}
        h="100%"
        gap="1rem"
        alignItems="center"
        justifyContent={{ base: "center", md: "flex-end" }}
        flexDirection={{ base: "column", md: "row" }}
        mt={{ base: "10px", md: "0" }}
      >
        <Text color="white">Copyright © 2024 Rede BrasilRP</Text>
        <Text color="white">Versão Atual Sisnato: {process.env.NEXT_PUBLIC_DEPLY_VERSION}</Text>
      </Flex>
    </Flex>
  );
}
