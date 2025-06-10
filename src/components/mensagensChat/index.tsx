"use client";
import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import React from "react";
import Loading from "@/app/loading";

interface MensagensProps {
  id: number;
  data: MensagemObj[];
  session: SessionNext.Client;
  onSend: (message: MensagemObj[]) => void;
}

type MensagemObj = {
  id: string;
  mensagem: string;
  data: string;
  hora: string;
  autor: string;
  autor_id: number;
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString("pt-BR");
};

const formatarHora = (hora: string) => {
  return new Date(hora).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
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
}: MensagensProps): React.ReactElement {
  const [message, setMessage] = useState("");
  const chat: MensagemObj[] = data || [];
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

  // Renderiza as mensagens separando por autor
  const mensagens = chat.map((item: MensagemObj) => {
    if (!session?.id) return null;
    const isCurrentUser = item.autor_id === session?.id;
    return (
      <Flex
        key={item.id}
        justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
        width="100%"
        mb={2}
        px={2}
      >
        <Box
          maxW={{ base: "85%", md: "70%" }}
          bg={isCurrentUser ? "blue.100" : "gray.100"}
          p={3}
          borderRadius="1rem"
          boxShadow="sm"
        >
          {!isCurrentUser && (
            <Text fontSize="xs" color="gray.500" mb={1}>
              {item.autor}
            </Text>
          )}
          <Text mb={1} wordBreak="break-word">
            {item.mensagem}
          </Text>
          <Flex gap={2} justifyContent="flex-end">
            <Text fontSize="xs" color="gray.500">
              {item.hora}
            </Text>
          </Flex>
        </Box>
      </Flex>
    );
  });

  return (
    <>
      {id ? (
        <Box
          h={"full"}
          w={"full"}
          display="flex"
          bg="gray.100"
          borderRadius="1rem"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
          px={4}
          py={8}
          flexDir="column"
          justifyContent="space-between"
          position="relative"
        >
          <Box
            bg="green.200"
            p={4}
            borderRadius="1rem"
            h={{ base: "25rem", lg: "30rem" }}
            overflowY="auto"
            mb={3}
            boxShadow="inner"
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
          >
            <Flex flexDirection="column" gap={2} width="100%">
              {mensagens}
            </Flex>
          </Box>
          <Flex gap={2} alignItems="flex-end">
            <Box flex={1}>
              <Textarea
                placeholder="Digite sua mensagem..."
                h="4.5rem"
                minH="4.5rem"
                resize="none"
                borderRadius="1rem"
                border="1px solid"
                borderColor="gray.300"
                _hover={{ borderColor: !id ? "gray.300" : "gray.400" }}
                _focus={{
                  borderColor: !id ? "gray.300" : "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                isDisabled={!id}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </Box>
            <Button
              leftIcon={<FiSend />}
              colorScheme="green"
              onClick={handleSend}
              isDisabled={!id || !message.trim()}
            >
              Enviar
            </Button>
          </Flex>
        </Box>
      ) : (
        <Box
          h={"full"}
          w={"full"}
          display="flex"
          bg="gray.100"
          borderRadius="1rem"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
          px={4}
          py={8}
          flexDir="column"
          justifyContent="space-between"
          position="relative"
        >
          <Box>
            <Flex
              bg={"green.200"}
              p={2}
              borderRadius="1rem"
              w={"full"}
              h={"25rem"}
              overflowY="auto"
              mb={{ base: "4", md: "8" }}
            >
              {" "}
            </Flex>
          </Box>
          <Flex gap={2} alignItems="end">
            <Textarea
              placeholder="Mensagem"
              h={"4rem"}
              resize="none"
              borderRadius="1rem"
              border="1px solid"
              borderColor="gray.300"
              _hover={{ borderColor: "gray.300" }}
              _focus={{ borderColor: "gray.300" }}
            />
            <Button leftIcon={<FiSend />} colorScheme="green" isDisabled={true}>
              Enviar
            </Button>
          </Flex>
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="whiteAlpha.700"
            backdropFilter="blur(2px)"
            borderRadius="1rem"
            zIndex={1}
          />
        </Box>
      )}
    </>
  );
}
