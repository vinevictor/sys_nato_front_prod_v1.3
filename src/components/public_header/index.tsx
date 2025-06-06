"use client";
import {
  Box,
  Button,
  Flex} from "@chakra-ui/react";


export default function PublicHeader() {

  return (
    <Flex
      pt={"20px"}
      pb={"20px"}
    //   justifyContent={"space-evenly"}
      alignItems={"center"}
      w={"100%"}
      h={"5vh"}
      bg={"#00713D"}
      px={"11rem"}
    >
      <Box
        display={"flex"}
        gap={"20px"}
        w={"100%"}
      > 
            <Button
              textColor={"white"}
              variant="link"
              size="sm"
              onClick={() => window.location.href = "/login"}
            >
                HOME
            </Button>
      </Box>
    </Flex>
  );
}
