"use client";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdAutorenew } from "react-icons/md";
import { useState } from "react";
import TagForm from "../form";

interface ModalCriarTagProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Modal para criar tag
 * 
 * @param isOpen - Controla se o modal está aberto
 * @param onClose - Função para fechar o modal
 * @param onSuccess - Callback executado após sucesso
 * @returns Componente de modal
 */
export function ModalCriarTag({
  isOpen,
  onClose,
  onSuccess,
}: ModalCriarTagProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent
          bg="white"
          _dark={{ bg: "gray.800" }}
          borderRadius="xl"
          shadow="2xl"
        >
          <ModalHeader
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color="#023147"
            borderBottomWidth="1px"
            borderBottomColor="gray.200"
            _dark={{ color: "gray.100", borderBottomColor: "gray.700" }}
          >
            Criar Nova Tag
          </ModalHeader>
          <ModalCloseButton
            _hover={{ bg: "red.100", color: "red.600" }}
            _dark={{ _hover: { bg: "red.900", color: "red.300" } }}
          />

          <ModalBody py={6}>
            <TagForm
              onSuccess={handleSuccess}
              onSaving={setIsSaving}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Loading global durante salvamento */}
      {isSaving && (
        <Portal>
          <Flex
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            direction="column"
            align="center"
            justify="center"
            bg="blackAlpha.800"
            backdropFilter="blur(10px)"
            zIndex={9999}
            p={{ base: 4, md: 8 }}
            overflow="hidden"
          >
            {/* Efeito de fundo decorativo */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width="600px"
              height="600px"
              borderRadius="full"
              bg="green.50"
              _dark={{ bg: "green.900", opacity: 0.1 }}
              opacity={0.3}
              filter="blur(100px)"
              pointerEvents="none"
            />

            <VStack
              spacing={{ base: 6, md: 8 }}
              textAlign="center"
              maxW={{ base: "90%", md: "500px" }}
              bg="white"
              p={{ base: 6, md: 10 }}
              borderRadius="2xl"
              shadow="2xl"
              borderWidth="1px"
              borderColor="gray.200"
              _dark={{ bg: "gray.800", borderColor: "gray.700" }}
              position="relative"
              zIndex={1}
            >
              {/* Ícone animado */}
              <Box position="relative">
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  width={{ base: "120px", md: "160px" }}
                  height={{ base: "120px", md: "160px" }}
                  borderRadius="full"
                  bg="green.100"
                  _dark={{ bg: "green.900", opacity: 0.2 }}
                  filter="blur(20px)"
                />
                <Icon
                  as={MdAutorenew}
                  w={{ base: 20, md: 24 }}
                  h={{ base: 20, md: 24 }}
                  color="green.500"
                  _dark={{ color: "green.400" }}
                  position="relative"
                  animation="spin 2s linear infinite"
                />
              </Box>

              {/* Título */}
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="semibold"
                color="gray.800"
                _dark={{ color: "gray.100" }}
              >
                Criando Tag
              </Heading>

              {/* Descrição */}
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.600"
                _dark={{ color: "gray.300" }}
                lineHeight="1.8"
              >
                Aguarde enquanto processamos sua solicitação
              </Text>

              {/* Mensagem adicional */}
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.500"
                _dark={{ color: "gray.400" }}
              >
                Isso não deve demorar muito...
              </Text>
            </VStack>

            {/* Keyframes para animação */}
            <style>
              {`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}
            </style>
          </Flex>
        </Portal>
      )}
    </>
  );
}
