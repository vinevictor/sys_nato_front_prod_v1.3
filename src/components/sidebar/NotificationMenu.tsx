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
import { FiBell, FiCheck, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";
import { FaExclamationTriangle } from "react-icons/fa";

/**
 * Interface para definir uma notificação/alerta
 */
interface Notification {
  id: number;
  titulo: string;
  descricao: string;
  solicitacao_id: number | null;
  type: "warning" | "info";
  read: boolean;
}

/**
 * Interface para mensagens gerais (bug reports)
 */
interface BugReport {
  id: number;
  titulo: string;
  descricao: string;
  [key: string]: any;
}

/**
 * Interface para props do componente
 */
interface NotificationMenuProps {
  session: SessionNext.Client;
}

/**
 * Componente de Menu de Notificações/Alertas
 * 
 * Funcionalidades:
 * - Busca alertas gerais da API
 * - Exibe badge com contador de alertas
 * - Menu com lista de alertas
 * - Navegação ao clicar no alerta
 * - Auto-refresh a cada 30 segundos
 * - Loading state durante requisições
 * 
 * @component
 */
export default function NotificationMenu({ session }: NotificationMenuProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bugReports, setBugReports] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [cont, setCont] = useState(0);
  const [selectedBug, setSelectedBug] = useState<Notification | null>(null);
  
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Cores dinâmicas baseadas no tema
  const bgButton = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const menuBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("#023147", "gray.100");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const modalDescBg = useColorModeValue("gray.50", "gray.700");

  // Contador de alertas
  const unreadCount = cont;


  /**
   * Busca a lista de alertas
   */
  const handleFetchAlertas = async () => {
    if (session?.role?.alert) {
      setLoading(true);
      try {
        const url = "/api/alerts/geral/findAll";
        const req = await fetch(url);
        const res = await req.json();
        if (req.ok) {
          // Mapeia os alertas para o formato esperado
          const alertasMapeados = Array.isArray(res) ? res.map((item: any) => ({
            id: item.id,
            titulo: item.titulo,
            descricao: item.descricao,
            solicitacao_id: item.solicitacao_id,
            type: "warning" as const,
            read: false,
          })) : [];
          const filteredAlertas = alertasMapeados.filter((item) => item.solicitacao_id !== null);
          setNotifications(filteredAlertas);
          setCont(filteredAlertas.length);
        }
      } catch (error) {
        console.error("Erro ao buscar alertas:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }
  };

  /**
   * Busca mensagens gerais (bug reports)
   */
  const handleFetchBugReports = async () => {
    try {
      const response = await fetch(`/api/bug_report`);
      if (response.ok) {
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          if (Array.isArray(data) && data.length > 0) {
            // Mapeia bug reports para o formato de notificação
            const bugsMapeados = data.map((item: BugReport) => ({
              id: item.id,
              titulo: item.titulo,
              descricao: item.descricao,
              solicitacao_id: null,
              type: "info" as const,
              read: false,
            }));
            setBugReports(bugsMapeados);
          } else {
            setBugReports([]);
          }
        } else {
          setBugReports([]);
        }
      } else {
        console.error("Erro na resposta da API:", response.status);
        setBugReports([]);
      }
    } catch (error) {
      console.error("Erro ao buscar bug reports:", error);
      setBugReports([]);
    }
  };

  /**
   * Navega para a solicitação ao clicar no alerta ou abre modal para bug report
   */
  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "info") {
      // Bug report - abre modal
      setSelectedBug(notification);
      onOpen();
    } else if (notification.solicitacao_id) {
      // Alerta - navega para solicitação
      router.push(`/solicitacoes/${notification.solicitacao_id}`);
    }
  };

  /**
   * Combina e conta todas as notificações
   */
  const allNotifications = [...bugReports, ...notifications];
  const totalCount = allNotifications.length;

  /**
   * Carrega todos os dados ao abrir o menu
   */
  const handleOpenMenu = async () => {
    await Promise.all([handleFetchAlertas(), handleFetchBugReports()]);
  };

  // Carrega os dados ao montar o componente
  useEffect(() => {
    handleOpenMenu();
    // Atualiza a cada 30 segundos
    const interval = setInterval(handleOpenMenu, 30000);
    return () => clearInterval(interval);
  }, [session]);

  // Atualiza o contador total
  useEffect(() => {
    setCont(totalCount);
  }, [totalCount]);

  // Não renderiza se o usuário não tiver permissão
  if (!session?.role?.alert) {
    return null;
  }

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
        _hover={{
          bg: hoverBg,
          borderColor: "#FB8501",
        }}
        transition="all 0.2s ease"
        position="relative"
      >
        <HStack spacing={3} w="full">
          {/* Ícone de notificação com badge */}
          <Box position="relative">
            <Icon
              as={FiBell}
              fontSize="20"
              color={unreadCount > 0 ? "#FB8501" : textColor}
              transition="all 0.2s"
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

          {/* Texto */}
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
          w="380px"
          maxH="calc(68px + (5 * 90px))"
          overflowY="auto"
          zIndex={9999}
          p={0}
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: borderColor,
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#FB8501",
            },
          }}
        >
        {/* Header */}
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
              {unreadCount} {unreadCount === 1 ? "notificação" : "notificações"}
            </Badge>
          )}
        </Flex>

        {/* Loading state */}
        {loading ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={12}
            px={4}
          >
            <Spinner size="lg" color="#FB8501" mb={3} />
            <Text fontSize="sm" color={textColor} fontWeight="medium">
              Carregando alertas...
            </Text>
          </Flex>
        ) : notifications.length === 0 ? (
          // Estado vazio
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={12}
            px={4}
          >
            <Icon as={FiBell} fontSize="48" color={subtextColor} mb={3} />
            <Text fontSize="sm" color={textColor} fontWeight="medium">
              Nenhuma notificação
            </Text>
            <Text fontSize="xs" color={subtextColor} textAlign="center">
              Tudo tranquilo por aqui!
            </Text>
          </Flex>
        ) : (
          // Lista de notificações (Bug Reports + Alertas)
          <Box>
            {allNotifications.map((notification, index) => (
              <Box key={`${notification.type}-${notification.id}`}>
                <MenuItem
                  bg={notification.type === "info" ? "blue.50" : "yellow.50"}
                  _hover={{ 
                    bg: notification.type === "info" ? "blue.100" : "yellow.100" 
                  }}
                  _dark={{
                    bg: notification.type === "info" ? "blue.900" : "whiteAlpha.100",
                    _hover: { 
                      bg: notification.type === "info" ? "blue.800" : "whiteAlpha.200" 
                    },
                  }}
                  onClick={() => handleNotificationClick(notification)}
                  py={3}
                  px={4}
                  cursor="pointer"
                >
                  <HStack spacing={3} align="start" w="full">
                    {/* Ícone baseado no tipo */}
                    <Avatar
                      size="sm"
                      icon={
                        <Icon
                          as={notification.type === "info" ? FiInfo : FaExclamationTriangle}
                          fontSize="16"
                        />
                      }
                      bg={notification.type === "info" ? "#3182CE" : "#daa300"}
                      color="white"
                    />

                    {/* Conteúdo */}
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack justify="space-between" w="full">
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color={textColor}
                          noOfLines={1}
                        >
                          {notification.titulo}
                        </Text>
                        <Badge
                          colorScheme={notification.type === "info" ? "blue" : "yellow"}
                          fontSize="xs"
                        >
                          {notification.type === "info" ? "Geral" : "Alerta"}
                        </Badge>
                      </HStack>
                      <Text fontSize="xs" color={subtextColor} noOfLines={2}>
                        {notification.descricao}
                      </Text>
                    </VStack>
                  </HStack>
                </MenuItem>
                {index < allNotifications.length - 1 && <MenuDivider m={0} />}
              </Box>
            ))}
          </Box>
        )}
        </MenuList>
      </Portal>
    </Menu>

    {/* Modal para exibir detalhes do Bug Report */}
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
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                Mensagem Geral
              </Text>
              <Badge colorScheme="blue" fontSize="xs">
                Informação
              </Badge>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {selectedBug && (
            <VStack align="start" spacing={4} w="full">
              {/* Descrição */}
              <Box w="full">
                <Text fontSize="xs" color={subtextColor} fontWeight="medium" mb={1}>
                  DESCRIÇÃO
                </Text>
                <Text
                  fontSize="sm"
                  color={textColor}
                  whiteSpace="pre-wrap"
                  lineHeight="1.6"
                  p={3}
                  bg={modalDescBg}
                  borderRadius="md"
                  border="1px"
                  borderColor={borderColor}
                >
                  {selectedBug.descricao}
                </Text>
              </Box>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
}
