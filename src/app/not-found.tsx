import Link from "next/link";
import { Metadata } from "next";
import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <Flex
      w={"full"}
      h={"100vh"}
      flexDir="column"
      justifyContent={"center"}
      alignItems={"center"}
      bg={"#f3f3f3"}
    >
      <Box>
        <Image
          src="/images/access-denied.svg"
          alt="404"
          width={300}
          height={300}
        />
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/home">Return Home</Link>
      </Box>
    </Flex>
  );
}
