"use client";
import {
  Box,
  Flex,
  Text,
  Heading,
  VStack,
  HStack, // Importado corretamente agora
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState, memo, useCallback, useMemo } from "react";
import { FaExclamationTriangle, FaCheck } from "react-icons/fa";

interface ListAlertasProps {
  id: number;
  data?: any;
  ContainerAlertas?: string;
}

function ListAlertas({ id, data }: ListAlertasProps) {
  const [dataAlert, setDataAlert] = useState<any[]>(data || []);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Cores dinâmicas para melhor visibilidade
  const modalBg = useColorModeValue("white", "gray.800");
  const modalHeaderColor = useColorModeValue("#023147", "white");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const messageBoxBg = useColorModeValue("gray.50", "gray.900");
  const messageBoxBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  const fetchAlerts = useCallback(async () => {
    const req = await fetch(`/api/alerts/solicitacao/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (req.ok) {
      const res = await req.json();
      setDataAlert(res || []);
    }
  }, [id]);

  useEffect(() => {
    if (data && data.length > 0) {
      setDataAlert(data);
    } else {
      fetchAlerts();
    }
  }, [id, data, fetchAlerts]);

  const handleMarkAsRead = async (e: React.MouseEvent, alertId: number) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/alerts/read/${alertId}`, { method: "PUT" });
      if (res.ok) {
        setDataAlert((prev) =>
          prev.map((item) =>
            item.id === alertId ? { ...item, lido: true } : item
          )
        );
      }
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const handleOpenDetail = (item: any) => {
    setSelectedAlert(item);
    onOpen();
  };

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

  return (
    <VStack spacing={0} align="stretch" h="full" w="full">
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        borderBottomWidth="2px"
        borderBottomColor="#00713D"
        p={4}
        align="center"
      >
        <Heading size="md" color={modalHeaderColor}>
          Histórico de Alertas
        </Heading>
      </Flex>

      <Box
        flex={1}
        overflowY="auto"
        p={4}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        {!hasAlerts ? (
          <Flex
            h="full"
            align="center"
            justify="center"
            direction="column"
            color="gray.500"
            py={10}
          >
            <FaExclamationTriangle size={32} style={{ marginBottom: "8px" }} />
            <Text>Nenhum alerta encontrado</Text>
          </Flex>
        ) : (
          <VStack spacing={3} align="stretch">
            {dataAlert.map((item: any) => (
              <Box
                key={item.id}
                p={4}
                borderRadius="lg"
                bg={
                  item.lido
                    ? useColorModeValue("white", "whiteAlpha.50")
                    : useColorModeValue("yellow.50", "yellow.900")
                }
                border="1px solid"
                borderColor={item.lido ? "transparent" : "yellow.400"}
                cursor="pointer"
                onClick={() => handleOpenDetail(item)}
                transition="all 0.2s"
                _hover={{ shadow: "md" }}
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <HStack spacing={2}>
                    <Icon
                      as={item.lido ? FaCheck : FaExclamationTriangle}
                      color={item.lido ? "green.500" : "yellow.500"}
                    />
                    <Text fontSize="xs" fontWeight="bold" color={labelColor}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </HStack>
                  {!item.lido && (
                    <Button
                      size="xs"
                      colorScheme="green"
                      variant="solid"
                      onClick={(e) => handleMarkAsRead(e, item.id)}
                    >
                      Marcar lido
                    </Button>
                  )}
                </Flex>
                <Text fontSize="sm" color={textColor} noOfLines={2}>
                  {item.descricao}
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* Modal Ajustado para Legibilidade */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent
          bg={modalBg}
          borderRadius="xl"
          border="1px solid"
          borderColor={messageBoxBorder}
        >
          <ModalHeader
            color={modalHeaderColor}
            borderBottomWidth="1px"
            borderColor={messageBoxBorder}
          >
            Detalhes do Alerta
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody py={6}>
            <VStack align="start" spacing={5}>
              <Box>
                <Text
                  fontWeight="extrabold"
                  fontSize="xs"
                  color={labelColor}
                  letterSpacing="wider"
                  mb={1}
                >
                  DATA E HORA
                </Text>
                <Text fontSize="md" color={textColor} fontWeight="medium">
                  {selectedAlert && formatDate(selectedAlert.createdAt)}
                </Text>
              </Box>

              <Box w="full">
                <Text
                  fontWeight="extrabold"
                  fontSize="xs"
                  color={labelColor}
                  letterSpacing="wider"
                  mb={2}
                >
                  MENSAGEM COMPLETA
                </Text>
                <Box
                  p={4}
                  bg={messageBoxBg}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={messageBoxBorder}
                  boxShadow="inner"
                >
                  <Text
                    fontSize="md"
                    color={textColor}
                    whiteSpace="pre-wrap"
                    lineHeight="tall"
                  >
                    {selectedAlert?.descricao}
                  </Text>
                </Box>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter
            borderTopWidth="1px"
            borderColor={messageBoxBorder}
            gap={3}
          >
            {!selectedAlert?.lido && (
              <Button
                colorScheme="green"
                leftIcon={<FaCheck />}
                onClick={(e) => {
                  handleMarkAsRead(e, selectedAlert.id);
                  onClose();
                }}
              >
                Marcar como Lido
              </Button>
            )}
            <Button variant="ghost" color={textColor} onClick={onClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default memo(ListAlertas);
