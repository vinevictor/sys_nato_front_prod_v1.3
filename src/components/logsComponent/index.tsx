import {
  Box,
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
  VStack,
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
  const hasLogs = logs && logs.length > 0;

  return (
    <VStack spacing={0} align="stretch" w="full">
      {/* Cabeçalho de Logs */}
      <Flex
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderBottomWidth="2px"
        borderBottomColor="#00713D"
        p={{ base: 3, md: 4 }}
        align="center"
      >
        <Heading
          size={{ base: "sm", md: "md" }}
          color="#023147"
          _dark={{ color: "gray.100" }}
        >
          Registro de Atividades
        </Heading>
      </Flex>

      {/* Conteúdo de Logs */}
      <Box
        flex={1}
        overflowY="auto"
        bg="white"
        _dark={{ bg: "gray.800" }}
        p={{ base: 3, md: 4 }}
        minH="300px"
        maxH="500px"
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#48bb78",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#38a169",
          },
        }}
      >
        {!hasLogs ? (
          <Flex
            h="full"
            align="center"
            justify="center"
            direction="column"
            color="gray.500"
            _dark={{ color: "gray.400" }}
            py={8}
          >
            <Text fontSize="sm" textAlign="center">
              Nenhum log disponível no momento.
            </Text>
          </Flex>
        ) : (
          <List spacing={3}>
            {logs.map((log, index) => (
              <ListItem key={log.id}>
                <VStack align="flex-start" spacing={2} width="full">
                  {index > 0 && (
                    <Divider
                      borderColor="gray.200"
                      _dark={{ borderColor: "gray.600" }}
                    />
                  )}
                  <Box
                    w="full"
                    p={3}
                    borderRadius="lg"
                    bg="blue.50"
                    border="1px solid"
                    borderColor="blue.200"
                    _dark={{
                      bg: "blue.900",
                      borderColor: "blue.700",
                    }}
                  >
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color="gray.700"
                      _dark={{ color: "gray.200" }}
                      lineHeight="1.5"
                    >
                      {log.descricao}
                    </Text>
                    {log.createAt && (
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        _dark={{ color: "gray.400" }}
                        mt={2}
                      >
                        {new Date(log.createAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    )}
                  </Box>
                </VStack>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </VStack>
  );
}
