"use client";
import { Flex, Box, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaUserGroup } from "react-icons/fa6";

export default function BotaoUser() {
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
        <IconButton
          icon={<FaUserGroup />}
          size="md"
          textColor={"white"}
          variant={"link"}
          onClick={() => router.push("/usuarios")}
          aria-label={""}
        ></IconButton>
      </Box>
    </Flex>
  );
}
