"use client";
import { Flex, Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function BotaoCadastroconst() {
  const router = useRouter();

  return (
    <Flex>
      <Box
        h={"100%"}
        borderRadius={"15px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"20px"}
      >
        <Button
          bg={"#00713D"}
          textColor={"white"}
          variant="solid"
          _hover={{ bg: "#00631B" }}
          size="md"
          onClick={() => router.push("/registerconst")}
        >
          CADASTRAR CONSTRUTORA
        </Button>
      </Box>
    </Flex>
  );
}
