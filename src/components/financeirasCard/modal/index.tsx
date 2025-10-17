"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
  Spinner,
  Flex,
  Text,
  Portal,
  Box,
  Heading,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { MdAutorenew } from "react-icons/md";
import FormFinanceira from "../form";
import { FinanceiraTypeById } from "@/types/financeira";
import { ConstrutoraTypeAll } from "@/types/construtora";
import { useEffect, useState } from "react";

interface ModalEditarFinanceiraProps {
  id?: number; // Se não tiver ID, é modo criação
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para editar ou criar financeira
 * 
 * Segue o padrão visual do modal de empreendimentos com:
 * - Overlay com blur
 * - Loading state com spinner
 * - Estados de erro
 * - Dark mode completo
 * 
 * @param id - ID da financeira (opcional para modo criação)
 * @param isOpen - Estado do modal
 * @param onClose - Callback para fechar modal
 */
export function ModalEditarFinanceira({
  id,
  isOpen,
  onClose,
}: ModalEditarFinanceiraProps) {
  const [financeira, setFinanceira] = useState<FinanceiraTypeById | null>(null);
  const [construtoras, setConstrutoras] = useState<ConstrutoraTypeAll[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Verifica se é modo criação ou edição
  const isCreateMode = !id;

  /**
   * Busca dados da financeira quando o modal abre (apenas em modo edição)
   */
  const fetchFinanceira = async (financeiraId: number) => {
    setIsLoading(true);
    try {
      const req = await fetch(`/api/financeira/get/${financeiraId}`);
      if (req.ok) {
        const data = await req.json();
        setFinanceira(data);
      } else {
        console.error("Erro ao buscar financeira");
        setFinanceira(null);
      }
    } catch (error) {
      console.error("Erro ao buscar financeira:", error);
      setFinanceira(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca lista de construtoras
   */
  const fetchConstrutoras = async () => {
    try {
      const req = await fetch("/api/construtora/getall");
      if (req.ok) {
        const data = await req.json();
        setConstrutoras(data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar construtoras:", error);
      setConstrutoras([]);
    }
  };

  /**
   * Carrega dados quando o modal abre
   */
  useEffect(() => {
    if (isOpen) {
      fetchConstrutoras();
      if (id) {
        fetchFinanceira(id);
      } else {
        // Modo criação: limpa dados anteriores
        setFinanceira(null);
        setIsLoading(false);
      }
    }
  }, [isOpen, id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent
        mx={4}
        my={8}
        _dark={{
          bg: "gray.800",
          borderColor: "gray.700",
        }}
      >
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          color="#023147"
          _dark={{ color: "gray.100" }}
        >
          {isCreateMode ? "Criar Nova Financeira" : "Editar Financeira"}
        </ModalHeader>
        <ModalCloseButton
          _hover={{
            bg: "red.50",
            _dark: { bg: "red.900" },
          }}
        />
        <Divider borderColor="gray.300" _dark={{ borderColor: "gray.600" }} />

        <ModalBody py={6}>
          {isLoading ? (
            <Flex
              justify="center"
              align="center"
              minH="300px"
              direction="column"
              gap={4}
            >
              <Spinner
                size="xl"
                thickness="4px"
                speed="0.65s"
                color="#00713D"
                emptyColor="gray.200"
              />
              <Text
                color="gray.600"
                _dark={{ color: "gray.400" }}
                fontSize="sm"
              >
                Carregando dados da financeira...
              </Text>
            </Flex>
          ) : isCreateMode || financeira ? (
            <FormFinanceira
              financeira={financeira}
              construtoras={construtoras}
              id={id ?? undefined}
              onSuccess={onClose}
              onSaving={setIsSaving}
            />
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={10}
              gap={3}
            >
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                Nenhum dado encontrado
              </Text>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>

      {/* Loading Global durante salvamento */}
      {isSaving && (
        <Portal>
          <Flex
            direction="column"
            align="center"
            justify="center"
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.800"
            backdropFilter="blur(8px)"
            zIndex={9999}
            p={{ base: 4, md: 8 }}
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
                {isCreateMode ? "Criando Financeira" : "Atualizando Financeira"}
              </Heading>

              {/* Descrição */}
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.600"
                _dark={{ color: "gray.300" }}
                lineHeight="1.8"
              >
                Aguarde enquanto processamos sua solicitação.
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
    </Modal>
  );
}
