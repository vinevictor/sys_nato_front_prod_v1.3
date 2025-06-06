import { Box, Flex, Heading, Text } from "@chakra-ui/react";

interface CardAdmUsuarioProps {
  count: number | string;
  title: string;
  icon: React.ReactNode;
}

export default function CardAdmUsuario({ count, title, icon }: CardAdmUsuarioProps) {
  return (
    <>
      <Box w={"100%"} bg={"gray.100"} p={4} h={"10rem"}>
        <Flex justifyContent={"space-between"}>
          <Box py={8} ps={4}>
            <Text fontSize={"sm"} fontWeight={"light"}>Usuários</Text>
            <Heading size={"lg"}>{count}</Heading>
          </Box>
          <Box>
            {icon}
          </Box>
        </Flex>
      </Box>
    </>
  );
}