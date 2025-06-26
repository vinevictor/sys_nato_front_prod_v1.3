import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface ListAlertasProps {
  id: number;
}

export default function ListAlertas({ id }: ListAlertasProps) {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const req = await fetch(`/api/alerts/solicitacao/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (req.ok) {
        const res = await req.json();
        setData(res);
      }
    })();
  }, [id]);

  return (
    <Flex
      w="full"
      h="full"
      p={{ base: 3, md: 6 }}
      bg="white"
      borderRadius={8}
      boxShadow="2xl"
      direction="column"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.200"
    >
     
      <Box flexShrink={0}>
        <Text 
          fontSize={{ base: "lg", md: "xl", lg: "2xl" }} 
          fontWeight="semibold"
          color="gray.700"
        >
          Alertas
        </Text>
      </Box>

     
      <Box
        flex="1"
        overflow="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        }}
      >
        {data.length === 0 ? (
          <Flex
            h="full"
            align="center"
            justify="center"
            direction="column"
            color="gray.500"
            py={8}
          >
            <FaExclamationTriangle size={32} style={{ marginBottom: "8px" }} />
            <Text fontSize="sm" textAlign="center">
              Nenhum alerta encontrado
            </Text>
          </Flex>
        ) : (
          <Flex 
            gap={2} 
            flexDir="column"
            pr={1} 
          >
            {data.map((item: any) => (
              <Flex
                key={item.id}
                direction={{ base: "column", sm: "row" }}
                gap={{ base: 2, sm: 4 }}
                justify={{ base: "flex-start", sm: "space-between" }}
                align={{ base: "flex-start", sm: "center" }}
                px={{ base: 3, md: 4 }}
                py={{ base: 3, md: 2 }}
                borderRadius="md"
                bg="yellow.50"
                border="1px solid"
                borderColor="yellow.200"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ 
                  bg: "yellow.100",
                  transform: "translateY(-1px)",
                  shadow: "sm"
                }}
                minW={0} 
              >
                <Flex 
                  gap={3} 
                  align="center" 
                  flex="1"
                  minW={0}
                >
                  <Box flexShrink={0}>
                    <FaExclamationTriangle
                      size={16}
                      color="#d69e2e"
                    />
                  </Box>
                  <Text 
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.700"
                    noOfLines={{ base: 2, sm: 1 }}
                    wordBreak="break-word"
                    flex="1"
                  >
                    {item.descricao.length > 60 
                      ? `${item.descricao.slice(0, 60)}...` 
                      : item.descricao
                    }
                  </Text>
                </Flex>
                
                <Text 
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.500"
                  flexShrink={0}
                  mt={{ base: 1, sm: 0 }}
                  alignSelf={{ base: "flex-end", sm: "center" }}
                >
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""
                  }
                </Text>
              </Flex>
            ))}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}