"use client";
import { Box, Button, IconButton } from "@chakra-ui/react";

import { useRouter } from "next/navigation";

type BotaoMenuProps = {
  name: string;
  path: string;
  icon: React.ReactElement;
};

export default function BotaoMenu({ name, path, icon }: BotaoMenuProps) {
  const router = useRouter();
  return (
    <>
      <Box display={{ base: "flex", xl: "none" }}>
        <IconButton
          textColor={"white"}
          variant="link"
          size={"lg"}
          aria-label={name}
          onClick={() => {
            if (name === "Sair") {
              (async () => {
                await fetch("/api/auth/logout");
                router.push("/login");
              })();
            }
            router.push(path);
          }}
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
          onClick={() => {
            if (name === "Sair") {
              (async () => {
                await fetch("/api/auth/logout");
              })();
              router.push("/login");
            }
            router.push(path);
          }}
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
