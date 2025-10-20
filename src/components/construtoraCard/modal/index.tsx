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
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdAutorenew } from "react-icons/md";
import { useEffect, useState } from "react";
import ConstrutoraForm from "@/components/construtoraCard/form";

interface ModalEditarConstrutoraProps {
  isOpen: boolean;
  onClose: () => void;
  construtoraId?: number;
  onSuccess?: () => void;
}

/**
 * Modal para criar ou editar construtora
 * 
 * @param isOpen - Controla se o modal está aberto
 * @param onClose - Função para fechar o modal
 * @param construtoraId - ID da construtora (opcional, se vazio = modo criação)
 * @param onSuccess - Callback executado após sucesso
 */
export default function ModalEditarConstrutora({
  isOpen,
  onClose,
  construtoraId,
  onSuccess,
}: ModalEditarConstrutoraProps) {
  const [loading, setLoading] = useState(false);
  const [construtoraData, setConstrutoraData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Busca dados da construtora quando o modal abre (apenas em modo edição)
  useEffect(() => {
    if (isOpen && construtoraId) {
      fetchConstrutoraData();
    } else if (isOpen && !construtoraId) {
      setConstrutoraData(null);
      setLoading(false);
    }
  }, [isOpen, construtoraId]);

  const fetchConstrutoraData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/construtora/get/${construtoraId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados da construtora");
      }

      const result = await response.json();
      setConstrutoraData(result.data);
    } catch (error) {
      console.error("Erro ao buscar construtora:", error);
      setConstrutoraData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    onClose();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
        <ModalOverlay
          bg="blackAlpha.600"
          backdropFilter="blur(10px)"
        />
        <ModalContent>
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            color="#023147"
            _dark={{ color: "white" }}
          >
            {construtoraId ? "Editar Construtora" : "Criar Nova Construtora"}
          </ModalHeader>
          <ModalCloseButton
            _hover={{
              bg: "red.500",
              color: "white",
            }}
          />

          <ModalBody py={6}>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minH="400px"
                flexDirection="column"
                gap={4}
              >
                <Spinner size="xl" color="#00713D" thickness="4px" />
                <Text color="gray.600" _dark={{ color: "gray.400" }}>
                  Carregando dados...
                </Text>
              </Box>
            ) : (
              <ConstrutoraForm
                construtoraId={construtoraId}
                construtoraData={construtoraData}
                onCancel={onClose}
                onSuccess={handleSuccess}
                onSaving={setIsSaving}
              />
            )}
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
                {construtoraId ? "Atualizando Construtora" : "Criando Construtora"}
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
