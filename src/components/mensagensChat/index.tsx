"use client";
import { Box, Button, Flex, Heading, Text, Textarea } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { FiSend, FiMessageSquare } from "react-icons/fi";
import React from "react";

interface MensagensProps {
  id: number;
  data: MensagemObj[];
  session: SessionNext.Client;
  onSend: (message: MensagemObj[]) => void;
  disabled?: boolean;
}

type MensagemObj = {
  id: string;
  mensagem: string;
  data: string;
  hora: string;
  autor: string;
  autor_id: number;
};

/**
 * @param id id do chamado ou solicitacao para liberar o chat
 * @param data [{id: string, mensagem: string, data: string, hora: string, autor: string, autor_id: number}] array de mensagens deve conter id, mensagem, data, hora, autor e autor_id
 * @param session dados do usuario logado
 * @param onSend função para enviar mensagem separada do componente
 * @returns JSX.Element
 */
export default function MensagensChat({
  id,
  data,
  session,
  onSend,
  disabled = false,
}: MensagensProps): React.ReactElement {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chat: MensagemObj[] = data || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = () => {
    if (!message.trim() || !session?.nome) return;

    const newMessage: MensagemObj = {
      id: new Date().getTime().toString(),
      mensagem: message.trim(),
      data: new Date().toLocaleDateString("pt-BR"),
      hora: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      autor: session.nome,
      autor_id: session.id,
    };

    onSend([...chat, newMessage]);
    setMessage("");
  };

  const mensagens = chat
    .map((item: MensagemObj) => {
      if (!session?.id) return null;
      const isCurrentUser = item.autor_id === session?.id;

      return (
        <Flex
          key={item.id}
          justify={isCurrentUser ? "flex-end" : "flex-start"}
          width="100%"
          mb={2}
        >
          <Box
            maxW={{ base: "85%", md: "75%" }}
            bg={isCurrentUser ? "#00713D" : "white"}
            color={isCurrentUser ? "white" : "gray.800"}
            p={3}
            borderRadius="lg"
            borderBottomRightRadius={isCurrentUser ? "4px" : "lg"}
            borderBottomLeftRadius={isCurrentUser ? "lg" : "4px"}
            boxShadow="sm"
            border={!isCurrentUser ? "1px solid" : "none"}
            borderColor={!isCurrentUser ? "gray.200" : "transparent"}
            _dark={{
              bg: isCurrentUser ? "#00d672" : "gray.700",
              color: isCurrentUser ? "gray.900" : "gray.100",
              borderColor: !isCurrentUser ? "gray.600" : "transparent",
            }}
          >
            {!isCurrentUser && (
              <Text
                fontSize="xs"
                color="gray.500"
                _dark={{ color: "gray.400" }}
                mb={1}
                fontWeight="semibold"
              >
                {item.autor}
              </Text>
            )}

            <Text
              mb={1}
              wordBreak="break-word"
              fontSize="sm"
              lineHeight="1.5"
            >
              {item.mensagem}
            </Text>

            <Text
              fontSize="xs"
              color={isCurrentUser ? "whiteAlpha.800" : "gray.500"}
              _dark={{
                color: isCurrentUser ? "blackAlpha.700" : "gray.400",
              }}
              textAlign="right"
            >
              {item.hora}
            </Text>
          </Box>
        </Flex>
      );
    })
    .filter(Boolean);

  // Estado quando não há ID (chat não disponível)
  if (!id) {
    return (
      <Flex
        h="full"
        w="full"
        direction="column"
        bg="gray.50"
        borderRadius="lg"
        boxShadow="md"
        border="1px solid"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700", bg: "gray.900"}}
        overflow="hidden"
      >
        {/* Header */}
        <Box
          px={4}
          py={3}
          borderBottom="1px solid"
          borderColor="gray.200"
          _dark={{ borderColor: "gray.700" }}
        >
          <Heading size="sm" color="#023147" _dark={{ color: "gray.100" }}>
            Mensagens
          </Heading>
        </Box>

        {/* Estado Vazio */}
        <Flex
          flex="1"
          direction="column"
          align="center"
          justify="center"
          p={6}
          gap={3}
        >
          <Box color="gray.400" _dark={{ color: "gray.600" }}>
            <FiMessageSquare size={48} />
          </Box>
          <Text
            fontSize="md"
            color="gray.600"
            _dark={{ color: "gray.400" }}
            textAlign="center"
            fontWeight="medium"
          >
            Chat indisponível
          </Text>
          <Text
            fontSize="sm"
            color="gray.500"
            _dark={{ color: "gray.500" }}
            textAlign="center"
          >
            Salve o chamado para habilitar o chat
          </Text>
        </Flex>
      </Flex>
    );
  }

  // Estado normal (chat disponível)
  return (
    <Flex
      h="full"
      w="full"
      direction="column"
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      border="1px solid"
      borderColor="gray.200"
      _dark={{ borderColor: "gray.700", bg: "gray.800" }}
      overflow="hidden"
    >
      {/* Header */}
      <Box
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700", bg: "gray.900"}}
        bg="gray.50"
      >
        <Heading size="sm" color="#023147" _dark={{ color: "gray.100" }}>
          Mensagens
        </Heading>
      </Box>

      {/* Área de Mensagens */}
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
        {chat.length === 0 ? (
          <Flex
            h="full"
            align="center"
            justify="center"
            direction="column"
            textAlign="center"
            gap={2}
          >
            <Box color="gray.400" _dark={{ color: "gray.600" }}>
              <FiMessageSquare size={40} />
            </Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.500"
              _dark={{ color: "gray.400" }}
            >
              Nenhuma mensagem ainda
            </Text>
            <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
              Comece uma conversa digitando abaixo
            </Text>
          </Flex>
        ) : (
          <Flex flexDirection="column" gap={2}>
            {mensagens}
            <div ref={messagesEndRef} />
          </Flex>
        )}
      </Box>

      {/* Input de Mensagem */}
      <Box
        p={4}
        borderTop="1px solid"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700", bg: "gray.800" }}
        bg="white"
      >
        <Flex gap={2} align="flex-end">
          <Box flex={1}>
            <Textarea
              placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={disabled}
              minH="60px"
              maxH="120px"
              resize="none"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.300"
              bg="gray.50"
              fontSize="sm"
              _hover={{ borderColor: "#00713D" }}
              _focus={{
                borderColor: "#00713D",
                boxShadow: "0 0 0 1px #00713D",
                bg: "white",
              }}
              _dark={{
                bg: "gray.700",
                borderColor: "gray.600",
                color: "gray.100",
                _hover: { borderColor: "#00d672" },
                _focus: {
                  borderColor: "#00d672",
                  boxShadow: "0 0 0 1px #00d672",
                  bg: "gray.600",
                },
              }}
              aria-label="Campo de mensagem"
            />
          </Box>
          <Button
            leftIcon={<FiSend />}
            colorScheme="green"
            bg="#00713D"
            onClick={handleSend}
            isDisabled={!message.trim() || disabled}
            size="md"
            minW="100px"
            _hover={{
              bg: "#005a31",
              transform: "translateY(-2px)",
              shadow: "md",
            }}
            _active={{ transform: "translateY(0)" }}
            _dark={{
              bg: "#00d672",
              color: "gray.900",
              _hover: { bg: "#00c060" },
            }}
            transition="all 0.2s"
            aria-label="Enviar mensagem"
          >
            <Text display={{ base: "none", sm: "block" }}>Enviar</Text>
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
