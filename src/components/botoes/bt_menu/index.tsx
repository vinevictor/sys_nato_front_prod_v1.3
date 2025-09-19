"use client";
import { Box, Button, IconButton, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type BotaoMenuProps = {
  name: string;
  path: string;
  icon: React.ReactElement;
};

export default function BotaoMenu({ name, path, icon }: BotaoMenuProps) {
  const router = useRouter();

  const handleRoute = async () => {
    if (name === "Sair") {
      const logout = await fetch("/api/auth/logout");
      if (!logout.ok) {
        console.log("Erro ao fazer logout");
      }
      router.push("/login");
    }
    router.push(path);
  };
  return (
    <>
      <Box display={{ base: "flex", xl: "none" }}>
        <IconButton
          textColor={"white"}
          variant="link"
          size={"lg"}
          aria-label={name}
          onClick={handleRoute}
          icon={icon}
          px={3}
          _active={{ bg: "white", textColor: "green.500" }}
          _hover={{ bg: "whiteAlpha.800", textColor: "green" }}
        />
      </Box>
      <Box display={{ base: "none", xl: "flex" }}>
        <Button
          textColor={"white"}
          variant="link"
          size={{ sm: "xs", md: "md" }}
          fontWeight={"light"}
          leftIcon={icon}
          onClick={handleRoute}
          px={3}
          _active={{ bg: "white", textColor: "green.500" }}
          _hover={{ bg: "whiteAlpha.800", textColor: "green" }}
        >
          {name.toUpperCase()}
        </Button>
      </Box>
    </>
  );
}
