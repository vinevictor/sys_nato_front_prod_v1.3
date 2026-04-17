"use client";

import {
  Box,
  Flex,
  Text,
  Icon,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Button,
  Avatar,
  Portal,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiBell, FiCheck, FiX, FiInfo } from "react-icons/fi";
import { FaExclamationTriangle } from "react-icons/fa";
import { Session } from "@/types/session";

interface Notification {
  id: number;
  titulo: string;
  descricao: string;
  solicitacao_id: number | null;
  type: "warning" | "info";
  read: boolean;
  lido: boolean;
  status: boolean;
}

interface BugReport {
  id: number;
  titulo: string;
  descricao: string;
  [key: string]: any;
}

interface NotificationMenuProps {
  session: Session.AuthUser;
}

export default function NotificationMenu({ session }: NotificationMenuProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bugReports, setBugReports] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBug, setSelectedBug] = useState<Notification | null>(null);

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgButton = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const menuBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("#023147", "gray.100");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const modalDescBg = useColorModeValue("gray.50", "gray.700");

  const allNotifications = [...bugReports, ...notifications];
  const unreadCount = allNotifications.filter((n) => !n.lido).length;

  const handleFetchAlertas = async () => {
    setLoading(true);
    try {
      const url = "/api/alerts/geral/findAll";
      const req = await fetch(url, { cache: "no-store" });
      const res = await req.json();
      if (req.ok) {
        const alertasMapeados: Notification[] = Array.isArray(res)
          ? res.map((item: any) => ({
              id: item.id,
              titulo: `Solicitação: ${item.solicitacao_id}`,
              descricao: item.descricao,
              solicitacao_id: item.solicitacao_id,
              type: "warning" as const,
              read: item.lido,
              lido: item.lido,
              status: item.status,
            }))
          : [];
        const filteredAlertas = alertasMapeados.filter(
          (item) => item.solicitacao_id !== null
        );
        setNotifications(filteredAlertas);
      }
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchBugReports = async () => {
    try {
      const response = await fetch(`/api/bug_report`);
      if (response.ok) {
        const data = await response.json();
        const bugsMapeados: Notification[] = Array.isArray(data)
          ? data.map((item: BugReport) => ({
              id: item.id,
              titulo: "Notificação Geral", // Título solicitado
              descricao: item.descricao,
              solicitacao_id: null,
              type: "info" as const,
              read: true,
              lido: false,
              status: true,
            }))
          : [];
        setBugReports(bugsMapeados);
      }
    } catch (error) {
      console.error("Erro ao buscar bug reports:", error);
      setBugReports([]);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "info") {
      setSelectedBug(notification);
      onOpen();
    } else if (notification.solicitacao_id) {
      router.push(`/solicitacoes/${notification.solicitacao_id}`);
    }
  };

  const handleOpenMenu = async () => {
    await Promise.all([handleFetchAlertas(), handleFetchBugReports()]);
  };

  useEffect(() => {
    handleOpenMenu();
    const interval = setInterval(handleOpenMenu, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const handleMarkAsRead = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/alerts/read/${id}`, { method: "PUT" });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, lido: true } : n))
        );
      }
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const handleArchive = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/alerts/delete/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Erro ao arquivar:", error);
    }
  };

  return (
    <>
      <Menu placement="right-start" isLazy onOpen={handleOpenMenu}>
        <MenuButton
          as={Button}
          w="full"
          h="auto"
          p={2}
          bg={bgButton}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          _hover={{ bg: hoverBg, borderColor: "#FB8501" }}
          transition="all 0.2s ease"
        >
          <HStack spacing={3} w="full">
            <Box position="relative">
              <Icon
                as={FiBell}
                fontSize="20"
                color={unreadCount > 0 ? "#FB8501" : textColor}
              />
              {unreadCount > 0 && (
                <Badge
                  position="absolute"
                  top="-6px"
                  right="-6px"
                  colorScheme="orange"
                  borderRadius="full"
                  fontSize="10px"
                  minW="18px"
                  h="18px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Box>
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                Notificações
              </Text>
            </VStack>
          </HStack>
        </MenuButton>

        <Portal>
          <MenuList
            bg={menuBg}
            borderColor={borderColor}
            borderRadius="xl"
            boxShadow="2xl"
            w="420px" // Aumentei um pouco para caber os botões com texto
            maxH="500px"
            overflowY="auto"
            zIndex={9999}
            p={0}
          >
            <Flex
              p={4}
              borderBottom="1px"
              borderColor={borderColor}
              justify="space-between"
              align="center"
            >
              <HStack>
                <Icon as={FiBell} color="#FB8501" fontSize="20" />
                <Text fontSize="md" fontWeight="bold" color={textColor}>
                  Alertas
                </Text>
              </HStack>
              {unreadCount > 0 && (
                <Badge colorScheme="orange" fontSize="xs" px={2} py={1}>
                  {unreadCount} novas
                </Badge>
              )}
            </Flex>

            {loading ? (
              <Flex direction="column" align="center" justify="center" py={12}>
                <Spinner size="lg" color="#FB8501" mb={3} />
                <Text fontSize="sm" color={textColor}>
                  Carregando alertas...
                </Text>
              </Flex>
            ) : allNotifications.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py={12}>
                <Icon as={FiBell} fontSize="48" color={subtextColor} mb={3} />
                <Text fontSize="sm" color={textColor}>
                  Nenhuma notificação
                </Text>
              </Flex>
            ) : (
              <Box>
                {allNotifications.map((notification, index) => (
                  <Box key={`${notification.type}-${notification.id}`}>
                    <MenuItem
                      bg={
                        notification.lido
                          ? "transparent"
                          : useColorModeValue("orange.50", "whiteAlpha.100")
                      }
                      _hover={{ bg: hoverBg }}
                      onClick={() => handleNotificationClick(notification)}
                      py={4}
                      px={4}
                    >
                      <VStack align="start" spacing={3} w="full">
                        <HStack spacing={3} align="start" w="full">
                          <Avatar
                            size="sm"
                            icon={
                              <Icon
                                as={
                                  notification.type === "info"
                                    ? FiInfo
                                    : FaExclamationTriangle
                                }
                              />
                            }
                            bg={
                              notification.type === "info"
                                ? "#3182CE"
                                : "#daa300"
                            }
                            color="white"
                          />
                          <VStack align="start" spacing={0} flex={1}>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color={textColor}
                            >
                              {/* Título dinâmico conforme sua solicitação */}
                              {notification.type === "info"
                                ? "Notificação Geral"
                                : `Solicitação: ${notification.solicitacao_id}`}
                            </Text>
                            <Text
                              fontSize="xs"
                              color={subtextColor}
                              noOfLines={2}
                            >
                              {notification.descricao}
                            </Text>
                          </VStack>
                        </HStack>

                        {/* Botões: Apenas para notificações de Solicitação (warning) */}
                        {notification.type !== "info" && (
                          <HStack spacing={2} w="full" justify="flex-end">
                            {/* O botão de lida SÓ aparece se lido for false */}
                            {!notification.lido ? (
                              <Button
                                size="xs"
                                variant="outline"
                                colorScheme="green"
                                leftIcon={<FiCheck />}
                                onClick={(e) =>
                                  handleMarkAsRead(e, notification.id)
                                }
                              >
                                Marcar como lido
                              </Button>
                            ) : (
                              /* Opcional: Um badge de "Lido" ou apenas espaço vazio */
                              <Badge
                                colorScheme="gray"
                                variant="subtle"
                                fontSize="9px"
                              >
                                Lida
                              </Badge>
                            )}

                            <Button
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              leftIcon={<FiX />}
                              onClick={(e) => handleArchive(e, notification.id)}
                            >
                              Arquivar
                            </Button>
                          </HStack>
                        )}
                      </VStack>
                    </MenuItem>
                    {index < allNotifications.length - 1 && (
                      <MenuDivider m={0} />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </MenuList>
        </Portal>
      </Menu>

      {/* Modal permanece igual */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Avatar
                size="sm"
                icon={<Icon as={FiInfo} fontSize="16" />}
                bg="#3182CE"
                color="white"
              />
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                Notificação Geral
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedBug && (
              <Box
                p={3}
                bg={modalDescBg}
                borderRadius="md"
                border="1px"
                borderColor={borderColor}
              >
                <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap">
                  {selectedBug.descricao}
                </Text>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
