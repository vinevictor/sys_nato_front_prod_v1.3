"use client";
import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
  useToast,
  VStack,
  Badge,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback, memo } from "react";
import { MdDelete, MdNotificationsActive } from "react-icons/md";

interface AlertasProps {
  id: number;
  descricao: string;
  status: boolean;
  createAt: string;
  updatedAt: string;
}

/**
 * Componente de alertas gerais do sistema
 * Exibe lista de alertas com opção de exclusão
 * Otimizado com React.memo e useCallback
 */
const Alertas = memo(function Alertas() {
  const [alertas, setAlertas] = useState<AlertasProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const toast = useToast();

  const fetchAlertas = useCallback(async () => {
    setLoading(true);
    try {
      const req = await fetch("/api/bug_report");
      const data = await req.json();
      setAlertas(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlertas();
    
    // Timeout de 4 segundos - se não carregar, define array vazio
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [fetchAlertas]);

  const HandleDelete = useCallback(async (id: number) => {
    setDeletingId(id);
    try {
      const req = await fetch(`/api/bug_report/delete/${id}`, {
        method: "DELETE",
      });
      const data = await req.json();
      if (!req.ok) {
        toast({
          title: "Erro ao remover alerta",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }
      toast({
        title: "Alerta removido com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      fetchAlertas();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao remover alerta",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setDeletingId(null);
    }
  }, [toast, fetchAlertas]);

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "-";
    const date = dateString.split("T")[0].split("-").reverse().join("/");
    const time = dateString.split("T")[1]?.split(".")[0] || "";
    return `${date} ${time}`;
  }, []);

  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
      borderRadius={{ base: "lg", md: "xl" }}
      p={{ base: 4, md: 5, lg: 6 }}
      shadow={{ base: "sm", md: "md" }}
      borderWidth="1px"
      borderColor="gray.200"
      w="100%"
      h={{ base: "fit-content", lg: "fit-content" }}
      maxH={{ base: "500px", lg: "600px" }}
    >
      {/* Cabeçalho */}
      <Flex align="center" gap={2} mb={4}>
        <Box
          p={2}
          bg="orange.50"
          _dark={{ bg: "orange.900" }}
          borderRadius="md"
        >
          <MdNotificationsActive size={20} color="#dd6b20" />
        </Box>
        <Box flex="1">
          <Heading
            fontSize={{ base: "lg", md: "xl" }}
            color="#023147"
            _dark={{ color: "gray.100" }}
          >
            Alertas Gerais
          </Heading>
          <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
            {alertas.length} {alertas.length === 1 ? "alerta" : "alertas"}
          </Text>
        </Box>
        <Badge colorScheme="orange" fontSize="xs">
          {alertas.length}
        </Badge>
      </Flex>

      <Divider mb={4} borderColor="gray.200" _dark={{ borderColor: "gray.700" }} />

      {/* Lista de Alertas */}
      <VStack
        spacing={3}
        align="stretch"
        maxH="600px"
        overflowY="auto"
        pr={2}
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
        {loading ? (
          // Skeleton de 3 cards de alerta
          <>
            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                bg="gray.50"
                _dark={{ bg: "gray.900", borderColor: "gray.700" }}
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.200"
              >
                <Flex justify="space-between" align="start" gap={3}>
                  <Box flex="1">
                    <SkeletonText 
                      noOfLines={2} 
                      spacing={2}
                      skeletonHeight="3"
                      startColor="gray.100"
                      endColor="gray.300"
                    />
                    <Skeleton 
                      height="10px" 
                      width="60%" 
                      mt={2}
                      startColor="gray.100"
                      endColor="gray.300"
                    />
                  </Box>
                  <Skeleton 
                    height="32px" 
                    width="32px" 
                    borderRadius="md"
                    startColor="gray.100"
                    endColor="gray.300"
                  />
                </Flex>
              </Box>
            ))}
          </>
        ) : alertas.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={12}
            gap={2}
          >
            <MdNotificationsActive size={48} color="#CBD5E0" />
            <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm">
              Nenhum alerta no momento
            </Text>
          </Flex>
        ) : (
          alertas.map((alerta: AlertasProps) => (
            <Box
              key={alerta.id}
              bg="gray.50"
              _dark={{ bg: "gray.900", borderColor: "gray.700" }}
              p={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{
                shadow: "md",
                borderColor: "orange.300",
                transform: "translateY(-2px)",
              }}
            >
              <Flex justify="space-between" align="start" gap={3}>
                <Box flex="1">
                  <Text
                    fontSize="sm"
                    color="gray.700"
                    _dark={{ color: "gray.200" }}
                    mb={2}
                    lineHeight="1.5"
                  >
                    {alerta.descricao}
                  </Text>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    _dark={{ color: "gray.400" }}
                  >
                    {formatDate(alerta.createAt)}
                  </Text>
                </Box>
                <IconButton
                  aria-label="Excluir alerta"
                  icon={<MdDelete />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => HandleDelete(alerta.id)}
                  isLoading={deletingId === alerta.id}
                  isDisabled={deletingId !== null}
                  _hover={{ bg: "red.100" }}
                  _dark={{ _hover: { bg: "red.900" } }}
                />
              </Flex>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
});

export default Alertas;
