"use client";
import { Box, Flex, Text, Heading, VStack } from "@chakra-ui/react";
import { useEffect, useState, memo, useCallback, useMemo } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface ListAlertasProps {
  id: number;
  data?: any;
  ContainerAlertas?: string;
}

function ListAlertas({ id, data, ContainerAlertas }: ListAlertasProps) {
  const [dataAlert, setDataAlert] = useState(data || []);

  useEffect(() => {
    if (data && data.length > 0) {
      setDataAlert(data);
      return;
    }

    const fetchAlerts = async () => {
      const req = await fetch(`/api/alerts/solicitacao/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (req.ok) {
        const res = await req.json();
        setDataAlert(res || []);
      }
    };

    fetchAlerts();
  }, [id, data]);

  const hasAlerts = useMemo(() => dataAlert.length > 0, [dataAlert.length]);

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const truncateText = useCallback((text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  }, []);
  
  return (
    <VStack spacing={0} align="stretch" h="full">
      {/* Cabeçalho de Alertas */}
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
          Alertas
        </Heading>
      </Flex>

      {/* Conteúdo de Alertas */}
      <Box
        flex={1}
        overflow="auto"
        bg="white"
        _dark={{ bg: "gray.800" }}
        p={{ base: 3, md: 4 }}
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
        {!hasAlerts ? (
          <Flex
            h="full"
            align="center"
            justify="center"
            direction="column"
            color="gray.500"
            _dark={{ color: "gray.400" }}
            py={8}
          >
            <FaExclamationTriangle size={32} style={{ marginBottom: "8px" }} />
            <Text fontSize="sm" textAlign="center">
              Nenhum alerta encontrado
            </Text>
          </Flex>
        ) : (
          <Flex gap={2} flexDir="column" pr={1}>
            {dataAlert.map((item: any) => (
              <Flex
                key={item.id}
                direction={{ base: "column", sm: "row" }}
                gap={{ base: 2, sm: 4 }}
                justify={{ base: "flex-start", sm: "space-between" }}
                align={{ base: "flex-start", sm: "center" }}
                px={{ base: 3, md: 4 }}
                py={{ base: 3, md: 2 }}
                borderRadius="lg"
                bg="yellow.50"
                border="1px solid"
                borderColor="yellow.200"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  bg: "yellow.100",
                  transform: "translateY(-1px)",
                  shadow: "sm",
                }}
                _dark={{
                  bg: "yellow.900",
                  borderColor: "yellow.700",
                  _hover: {
                    bg: "yellow.800",
                  }
                }}
                minW={0}
              >
                <Flex gap={3} align="center" flex="1" minW={0}>
                  <Box flexShrink={0}>
                    <FaExclamationTriangle size={16} color="#d69e2e" />
                  </Box>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.700"
                    _dark={{ color: "gray.200" }}
                    noOfLines={{ base: 2, sm: 1 }}
                    wordBreak="break-word"
                    flex="1"
                  >
                    {truncateText(item.descricao)}
                  </Text>
                </Flex>

                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.500"
                  _dark={{ color: "gray.400" }}
                  flexShrink={0}
                  mt={{ base: 1, sm: 0 }}
                  alignSelf={{ base: "flex-end", sm: "center" }}
                >
                  {formatDate(item.createdAt)}
                </Text>
              </Flex>
            ))}
          </Flex>
        )}
      </Box>
    </VStack>
  );
}

export default memo(ListAlertas);
