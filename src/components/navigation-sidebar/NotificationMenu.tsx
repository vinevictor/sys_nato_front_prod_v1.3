"use client";

import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Badge,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsBell, BsBellFill } from "react-icons/bs";
import { IoCheckmarkDone } from "react-icons/io5";
import { Notification } from "./types";

/**
 * Componente de menu de notificações
 * Exibe um popover com lista de notificações do usuário
 */
interface NotificationMenuProps {
  /** Lista de notificações */
  notifications: Notification[];
  /** Callback ao clicar em uma notificação */
  onNotificationClick?: (notification: Notification) => void;
  /** Callback ao marcar como lida */
  onMarkAsRead?: (notificationId: string) => void;
}

export default function NotificationMenu({
  notifications = [],
  onNotificationClick,
  onMarkAsRead,
}: NotificationMenuProps) {
  // Cores adaptativas ao tema
  const bgColor = useColorModeValue("white", "#023147");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "rgba(251, 133, 1, 0.1)");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const unreadBg = useColorModeValue("orange.50", "rgba(251, 133, 1, 0.15)");

  // Conta notificações não lidas
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /**
   * Formata timestamp para exibição amigável
   */
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  /**
   * Retorna cor do badge baseado no tipo de notificação
   */
  const getNotificationColor = (type?: string) => {
    switch (type) {
      case "error":
        return "red";
      case "warning":
        return "orange";
      case "success":
        return "green";
      default:
        return "blue";
    }
  };

  return (
    <Popover placement="right-start" closeOnBlur={true}>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Box position="relative" cursor="pointer">
              <IconButton
                aria-label="Notificações"
                icon={
                  <Icon
                    as={unreadCount > 0 ? BsBellFill : BsBell}
                    boxSize={5}
                  />
                }
                variant="ghost"
                colorScheme="gray"
                size="md"
                _hover={{
                  bg: hoverBg,
                  transform: "scale(1.05)",
                }}
                transition="all 0.2s"
              />
              {unreadCount > 0 && (
                <Badge
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  colorScheme="orange"
                  borderRadius="full"
                  fontSize="10px"
                  minW="18px"
                  h="18px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  animation="pulse 2s infinite"
                  sx={{
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1 },
                      "50%": { opacity: 0.7 },
                    },
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Box>
          </PopoverTrigger>

          <PopoverContent
            bg={bgColor}
            borderColor={borderColor}
            boxShadow="xl"
            maxW="380px"
            w="380px"
          >
            <PopoverArrow bg={bgColor} />
            <PopoverCloseButton />
            <PopoverHeader
              fontWeight="bold"
              fontSize="md"
              borderColor={borderColor}
            >
              <HStack justify="space-between" pr={6}>
                <Text>Notificações</Text>
                {unreadCount > 0 && (
                  <Badge colorScheme="orange" borderRadius="full">
                    {unreadCount} nova{unreadCount > 1 ? "s" : ""}
                  </Badge>
                )}
              </HStack>
            </PopoverHeader>

            <PopoverBody p={0} maxH="400px" overflowY="auto">
              {notifications.length === 0 ? (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  py={8}
                  px={4}
                >
                  <Icon as={BsBell} boxSize={12} color={mutedColor} mb={2} />
                  <Text color={mutedColor} fontSize="sm" textAlign="center">
                    Nenhuma notificação no momento
                  </Text>
                </Flex>
              ) : (
                <VStack spacing={0} align="stretch">
                  {notifications.map((notification, index) => (
                    <Box key={notification.id}>
                      <Flex
                        p={3}
                        bg={!notification.isRead ? unreadBg : "transparent"}
                        _hover={{ bg: hoverBg }}
                        cursor="pointer"
                        transition="all 0.2s"
                        onClick={() => {
                          onNotificationClick?.(notification);
                          if (!notification.isRead) {
                            onMarkAsRead?.(notification.id);
                          }
                        }}
                        position="relative"
                      >
                        <VStack align="stretch" spacing={1} flex={1}>
                          <HStack justify="space-between">
                            <Text
                              fontSize="sm"
                              fontWeight={
                                notification.isRead ? "normal" : "semibold"
                              }
                              color={textColor}
                              noOfLines={1}
                            >
                              {notification.title}
                            </Text>
                            {notification.type && (
                              <Badge
                                colorScheme={getNotificationColor(
                                  notification.type
                                )}
                                fontSize="9px"
                                px={2}
                              >
                                {notification.type}
                              </Badge>
                            )}
                          </HStack>

                          <Text
                            fontSize="xs"
                            color={mutedColor}
                            noOfLines={2}
                            lineHeight="1.4"
                          >
                            {notification.message}
                          </Text>

                          <HStack justify="space-between" mt={1}>
                            <Text fontSize="xs" color={mutedColor}>
                              {formatTimestamp(notification.timestamp)}
                            </Text>
                            {!notification.isRead && (
                              <IconButton
                                aria-label="Marcar como lida"
                                icon={<Icon as={IoCheckmarkDone} />}
                                size="xs"
                                variant="ghost"
                                colorScheme="green"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkAsRead?.(notification.id);
                                }}
                              />
                            )}
                          </HStack>
                        </VStack>

                        {!notification.isRead && (
                          <Box
                            position="absolute"
                            left={0}
                            top="50%"
                            transform="translateY(-50%)"
                            w="3px"
                            h="70%"
                            bg="#fb8501"
                            borderRadius="0 4px 4px 0"
                          />
                        )}
                      </Flex>
                      {index < notifications.length - 1 && (
                        <Divider borderColor={borderColor} />
                      )}
                    </Box>
                  ))}
                </VStack>
              )}

              {notifications.length > 0 && (
                <>
                  <Divider borderColor={borderColor} />
                  <Button
                    w="100%"
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    borderRadius={0}
                    onClick={() => {
                      // Aqui você pode adicionar navegação para página de notificações
                      console.log("Ver todas as notificações");
                      onClose();
                    }}
                  >
                    Ver todas
                  </Button>
                </>
              )}
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
