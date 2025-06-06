"use client";
import {
  Button,
  Flex,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

interface CardChatProps {
  data?: any;
}
export default function CardChat({ data }: CardChatProps) {
  const [inputValue, setInputValue] = useState("");

  return (
    <Flex
      direction="column"
      w="100%"
      h="100%"
      bg={useColorModeValue("white", "gray.800")}
      rounded="md"
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      p={4}
      gap={4}
    >
      <Flex>
        <Text fontSize="2xl">Comunicação</Text>
      </Flex>

      <Textarea
        value={
          data
            ? data
            : "Aqui serão exibidas as mensagens do chat.\nÁrea apenas de leitura."
        }
        isReadOnly
        h="300px"
        resize="none"
        bg={useColorModeValue("gray.50", "gray.700")}
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.600")}
        _focusVisible={{ borderColor: "teal.500" }}
        fontSize="sm"
      />

      <Flex gap={2} align="flex-start">
        <Textarea
          placeholder="Digite sua mensagem..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          resize="none"
          h="100px"
          bg={useColorModeValue("gray.50", "gray.700")}
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.600")}
          _focusVisible={{ borderColor: "teal.500" }}
          fontSize="sm"
        />
        <Flex direction="column" gap={2}>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setInputValue("")}
            w="100px"
          >
            Apagar
          </Button>
          <Button colorScheme="teal" w="100px">
            Enviar
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
