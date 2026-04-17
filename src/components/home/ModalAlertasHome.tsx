"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Icon,
  Box,
  useDisclosure,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaExclamationTriangle, FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ModalAlertasHome() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.300");

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts/geral/findAll", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        // Filtramos apenas os não lidos para o modal de entrada
        const unread = data.filter(
          (a: any) => !a.lido && a.solicitacao_id !== null
        );
        if (unread.length > 0) {
          setAlerts(unread);
          onOpen();
        }
      }
    } catch (error) {
      console.error("Erro ao buscar alertas iniciais:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleGoToSolicitacao = (id: number) => {
    onClose();
    router.push(`/solicitacoes/${id}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent border="1px solid" borderColor="yellow.400">
        <ModalHeader
          bg="yellow.50"
          _dark={{ bg: "yellow.900" }}
          borderRadius="md"
        >
          <HStack>
            <Icon as={FaExclamationTriangle} color="yellow.600" />
            <Text color={useColorModeValue("#023147", "white")}>
              Alertas Pendentes ({alerts.length})
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <Text fontSize="sm" mb={4} color="gray.500">
            Você possui atualizações importantes nas seguintes solicitações:
          </Text>

          <VStack spacing={3} align="stretch">
            {alerts.map((alert) => (
              <Box
                key={alert.id}
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                bg={useColorModeValue("gray.50", "whiteAlpha.100")}
                cursor="pointer"
                onClick={() => handleGoToSolicitacao(alert.solicitacao_id)}
                _hover={{ shadow: "md", borderColor: "green.400" }}
              >
                <HStack justify="space-between" mb={2}>
                  <Badge colorScheme="green">ID: {alert.solicitacao_id}</Badge>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(alert.createdAt).toLocaleDateString("pt-BR")}
                  </Text>
                </HStack>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  noOfLines={1}
                  color={textColor}
                  mb={1}
                >
                  {alert.descricao}
                </Text>
                <Text fontSize="xs" color="green.500" fontWeight="bold">
                  Clique para visualizar →
                </Text>
              </Box>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>
            Ver mais tarde
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
