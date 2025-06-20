import {
  Box,
  Heading,
  List,
  ListItem,
  VStack,
  HStack,
  Divider,
  Text,
  Flex,
} from "@chakra-ui/react";

interface Log {
  User: number;
  createAt: string;
  descricao: string;
  id: number;
}

interface LogProps {
  logs: Log[];
}

export default function LogsComponent({ logs }: LogProps) {
  if (!logs || logs.length === 0) {
    return (
      <Flex w={"full"} p={4} bg="gray.50">
        <Text textAlign="center" color="gray.600">
          Nenhum log disponível no momento.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      m={2}
      w={"full"}
      border={"1px solid #ccc"}
      rounded={"md"}
      direction="column"
      p={6}
      shadow="md"
      bg="white"
    >
      <Heading as="h2" size="lg" mb={6} textAlign="center" color="teal.600">
        Registro de Atividades
      </Heading>
      <Box
        maxHeight="300px"
        overflowY="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "gray.100",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.400",
            borderRadius: "10px",
            border: "2px solid gray.100",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "gray.500",
          },
        }}
        
      >
        <List>
          {logs.map((log) => (
            <ListItem>
              <VStack align="flex-start">
                <HStack justifyContent="space-between" width="full">                  

                </HStack>
                <Divider/>
                <Text fontSize="md" color="gray.700">
                  {log.descricao}
                </Text>
              </VStack>
            </ListItem>
          ))}
        </List>
      </Box>
    </Flex>
  );
}
