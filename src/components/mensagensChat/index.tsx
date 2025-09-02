"use client";
import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import React from "react";

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

 
  const mensagens = chat.map((item: MensagemObj) => {
    if (!session?.id) return null;
    const isCurrentUser = item.autor_id === session?.id;

    return (
      <Flex
        key={item.id}
        justify={isCurrentUser ? "flex-end" : "flex-start"}
        width="100%"
        mb={3}
        px={{ base: 2, md: 3 }}
      >
        <Box
          maxW={{ base: "90%", sm: "85%", md: "75%" }}
          bg={isCurrentUser ? "blue.500" : "white"}
          color={isCurrentUser ? "white" : "gray.800"}
          p={{ base: 3, md: 4 }}
          borderRadius={isCurrentUser ? "20px 20px 5px 20px" : "20px 20px 20px 5px"}
          boxShadow="md"
          border={!isCurrentUser ? "1px solid" : "none"}
          borderColor={!isCurrentUser ? "gray.200" : "transparent"}
          position="relative"
        >
          {!isCurrentUser && (
            <Text
              fontSize="xs"
              color="gray.500"
              mb={1}
              fontWeight="medium"
            >
              {item.autor}
            </Text>
          )}

          <Text
            mb={2}
            wordBreak="break-word"
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1.4"
          >
            {item.mensagem}
          </Text>

          <Text
            fontSize="xs"
            color={isCurrentUser ? "blue.100" : "gray.500"}
            textAlign="right"
            fontWeight="medium"
          >
            {item.hora}
          </Text>
        </Box>
      </Flex>
    );
  });

  if (!id) {
    return (
      <Box
        h="full"
        w="full"
        display="flex"
        bg="gray.50"
        borderRadius="lg"
        boxShadow="md"
        border="1px solid"
        borderColor="gray.200"
        p={{ base: 3, md: 4 }}
        flexDir="column"

        justifyContent={"center"}
        position="relative"
        overflow="hidden"
      >
        
        <Box
          bg="green.50"
          borderRadius="lg"
          flex="1"
          mb={4}
          border="1px solid"
          borderColor="green.200"
          position="relative"
        />

       
        <Flex gap={2} align="flex-end">
          <Textarea
            placeholder="Selecione uma conversa para começar..."
            h="60px"
            resize="none"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.300"
            bg="gray.100"
            isDisabled
            fontSize={{ base: "sm", md: "md" }}
          />
          <Button
            leftIcon={<FiSend />}
            colorScheme="green"
            isDisabled
            size={{ base: "md", md: "lg" }}
            px={{ base: 4, md: 6 }}
          >
            Enviar
          </Button>
        </Flex>

        
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="whiteAlpha.300"
          backdropFilter="blur(1px)"
          borderRadius="lg"
          zIndex={1}
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Text
            color="gray.600"
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="medium"
            textAlign="center"
            bg="white"
            px={4}
            py={2}
            borderRadius="md"
            shadow="sm"
          >
            Chat indisponível
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      h="full"
      w="full"
      display="flex"
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      border="1px solid"
      borderColor="gray.200"
      p={{ base: 3, md: 4 }}
      flexDir="column"
      overflow="hidden"
    >
      
      <Box
        bg="gradient(to-b, green.50, green.100)"
        borderRadius="lg"
        flex="1"
        overflowY="auto"
        mb={4}
        p={2}
        border="1px solid"
        borderColor="green.200"
        position="relative"
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
        {chat.length === 0 ? (
          <Flex
            h="full"
            align="center"
            justify="center"
            direction="column"
            color="gray.500"
            textAlign="center"
            p={4}
          >
            <Text fontSize={{ base: "sm", md: "md" }} mb={2}>
              Nenhuma mensagem ainda
            </Text>
            <Text fontSize="xs">
              Comece uma conversa digitando uma mensagem abaixo
            </Text>
          </Flex>
        ) : (
          <Flex flexDirection="column" gap={1} minH="full" justify="flex-end">
            {mensagens}
            <div ref={messagesEndRef} />
          </Flex>
        )}
      </Box>

      
      <Flex gap={2} align="flex-end">
        <Box flex={1}>
          <Textarea
            placeholder="Digite sua mensagem..."
            h="60px"
            minH="60px"
            resize="none"
            borderRadius="lg"
            border="2px solid"
            borderColor="gray.200"
            bg="gray.50"
            fontSize={{ base: "sm", md: "md" }}
            _hover={{ borderColor: "gray.300", bg: "white" }}
            _focus={{
              borderColor: "blue.400",
              bg: "white",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
          isDisabled={!message.trim()}
          size={{ base: "md", md: "lg" }}
          px={{ base: 4, md: 6 }}
          shadow="md"
          _hover={{
            transform: "translateY(-1px)",
            shadow: "lg",
          }}
          transition="all 0.2s"
        >
          <Text display={{ base: "none", sm: "block" }}>Enviar</Text>
        </Button>
      </Flex>
    </Box>
  );
}