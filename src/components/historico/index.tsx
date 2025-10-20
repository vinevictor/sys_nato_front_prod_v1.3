import { Box, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";

interface HistoricoPropsComponent {
  data: HistoricoProps[];
}

type HistoricoProps = {
  id: number;
  descricao: string;
  createAt: Date | string | any;
};

/**
 * HistoricoComponent
 * Renderiza uma linha do tempo com os itens de histórico.
 * Os itens são ordenados por `createAt` em ordem decrescente antes da renderização.
 */
export default function HistoricoComponent({
  data,
}: HistoricoPropsComponent) {
  // Ordena os itens por createAt em ordem decrescente (mais recente primeiro)
  const orderedData = [...(data ?? [])].sort((a, b) => {
    const ta = new Date(a.createAt).getTime();
    const tb = new Date(b.createAt).getTime();
    return tb - ta;
  });

  return (
    <Flex
      h={{ base: "25rem", lg: "full" }}
      w="full"
      direction="column"
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700"
      }}
    >
      {/* Header */}
      <Box
        px={4}
        py={3}
        borderBottom="2px solid"
        borderBottomColor="#00713D"
        bg="gray.50"
        _dark={{
          borderBottomColor: "#00d672",
          bg: "gray.900"
        }}
      >
        <Flex align="center" gap={2}>
          <Icon
            as={FiClock}
            color="#00713D"
            _dark={{ color: "#00d672" }}
            boxSize={5}
          />
          <Heading
            size="sm"
            color="#023147"
            _dark={{ color: "gray.100" }}
          >
            Linha do tempo
          </Heading>
        </Flex>
      </Box>

      {/* Timeline Items */}
      <Box
        flex="1"
        overflowY="auto"
        p={4}
        bg="gray.50"
        _dark={{ bg: "gray.900" }}
        css={{
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#CBD5E0",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#A0AEC0",
          },
        }}
      >
        {orderedData.length === 0 ? (
          <Flex
            h="full"
            align="center"
            justify="center"
            direction="column"
            textAlign="center"
            gap={2}
          >
            <Box color="gray.400" _dark={{ color: "gray.600" }}>
              <FiClock size={40} />
            </Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.500" _dark={{ color: "gray.400" }}>
              Sem histórico
            </Text>
            <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.500" }}>
              Nenhuma alteração registrada ainda
            </Text>
          </Flex>
        ) : (
          <Flex direction="column" gap={3}>
            {orderedData.map((item) => (
              <Box
                key={item.id}
                p={3}
                borderRadius="md"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.200"
                bg="white"
                transition="all 0.2s"
                _hover={{
                  borderColor: "#00713D",
                  shadow: "md",
                  transform: "translateX(4px)",
                  _dark: {
                    borderColor: "#00d672",
                  },
                }}
                _dark={{
                  bg: "gray.800",
                  borderColor: "gray.600",
                }}
              >
                <Text
                  fontSize="sm"
                  color="gray.800"
                  _dark={{ color: "gray.100" }}
                  mb={1}
                  fontWeight="medium"
                  lineHeight="1.5"
                >
                  {item.descricao}
                </Text>
                <Flex align="center" gap={1}>
                  <Icon
                    as={FiClock}
                    boxSize={3}
                    color="gray.500"
                    _dark={{ color: "gray.400" }}
                  />
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    _dark={{ color: "gray.400" }}
                  >
                    {new Date(item.createAt).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
