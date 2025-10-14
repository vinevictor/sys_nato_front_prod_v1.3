"use client";
import {
  Button,
  Flex,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdBlock, MdOutlineCancel, MdWarning } from "react-icons/md";

interface BtnSuspenderUserProps {
  id: number;
}

/**
 * Botão de suspensão de usuário
 * 
 * Permite suspender um usuário do sistema através de um modal de confirmação.
 * Exibe feedback visual e atualiza a lista após a ação.
 * 
 * @param id - ID do usuário a ser suspenso
 * @returns Botão com modal de confirmação
 */

export function BtnSuspenderUser({ id }: BtnSuspenderUserProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSuspender = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/usuario/suspense/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao suspender usuário");
      }

      toast({
        title: "Usuário suspenso!",
        description: "O usuário foi suspenso com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      onClose();
      
      // Aguarda um pouco antes de recarregar para o toast aparecer
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error) {
      console.error("Erro ao suspender usuário:", error);
      
      toast({
        title: "Erro ao suspender",
        description: "Não foi possível suspender o usuário. Tente novamente.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tooltip label="Suspender usuário" placement="top">
        <IconButton
          aria-label="Suspender usuário"
          icon={<MdBlock />}
          colorScheme="orange"
          variant="outline"
          onClick={onOpen}
          _hover={{
            bg: "orange.50",
            borderColor: "orange.600",
            _dark: { bg: "orange.900", opacity: 0.3 },
          }}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" />

        <ModalContent
          mx={4}
          borderRadius="xl"
          _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        >
          <ModalHeader
            borderBottomWidth="1px"
            borderBottomColor="orange.200"
            _dark={{ borderBottomColor: "orange.700" }}
          >
            <Flex align="center" gap={3}>
              <Icon
                as={MdWarning}
                boxSize={6}
                color="orange.500"
                _dark={{ color: "orange.400" }}
              />
              <Text color="gray.800" _dark={{ color: "gray.100" }}>
                Confirmar Suspensão
              </Text>
            </Flex>
          </ModalHeader>

          <ModalBody py={6}>
            <VStack spacing={4} align="stretch">
              <Text
                fontSize="md"
                color="gray.700"
                _dark={{ color: "gray.300" }}
                textAlign="center"
              >
                Você tem certeza que deseja suspender este usuário?
              </Text>
              
              <Flex
                bg="orange.50"
                _dark={{ bg: "orange.900", opacity: 0.3 }}
                p={3}
                borderRadius="md"
                borderLeftWidth="4px"
                borderLeftColor="orange.500"
              >
                <Text
                  fontSize="sm"
                  color="orange.700"
                  _dark={{ color: "orange.300" }}
                >
                  <strong>Atenção:</strong> O usuário ficará temporariamente sem acesso ao sistema.
                </Text>
              </Flex>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3} borderTopWidth="1px" borderTopColor="gray.200" _dark={{ borderTopColor: "gray.700" }}>
            <Button
              leftIcon={<MdOutlineCancel />}
              onClick={onClose}
              variant="ghost"
              isDisabled={isLoading}
            >
              Cancelar
            </Button>

            <Button
              leftIcon={<MdBlock />}
              onClick={handleSuspender}
              colorScheme="orange"
              isLoading={isLoading}
              loadingText="Suspendendo..."
              _dark={{
                bg: "orange.500",
                _hover: { bg: "orange.600" },
              }}
            >
              Suspender Usuário
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}