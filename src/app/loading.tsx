import { Box, Center, CircularProgress, Flex, Heading } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Flex
      w={"100%"}
      h={"100vh"}
      flexDir="column"
      justifyContent={"center"}
      alignItems={"center"}
      bg={"#f3f3f3"}
    >
      <Box>
        <Center>
          <CircularProgress color="green.500" isIndeterminate size="250px" />
        </Center>
        <Center mt="30px">
          <Heading color="green.500" variant="H1">
            CARREGANDO ....
          </Heading>
        </Center>
      </Box>
    </Flex>
  );
}
