"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  VStack,
  Text,
  Icon,
  useDisclosure,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiLock } from "react-icons/fi";
import { SetStateAction, useEffect, useState } from "react";
import { SenhaComponent } from "../Senha";
import { Session } from "@/types/session";

/**
 * Interface para props do componente
 */
interface Props {
  session: Session.AuthUser;
}

/**
 * Modal de Primeiro Acesso
 * 
 * Funcionalidades:
 * - Força a troca de senha no primeiro acesso
 * - Validação de senha e confirmação
 * - Tema adaptativo
 * - Layout moderno e responsivo
 * 
 * @component
 */
export default function ModalPrimeAsses({ session }: Props) {
  const [Senha, setSenha] = useState("");
  const [ConfirmeSenha, setConfirmeSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const primeiro_asseso = session.reset_password;
  const ID = session.id;

  // Cores dinâmicas baseadas no tema
  const bgModal = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("#023147", "gray.100");
  const subtextColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    if (primeiro_asseso) {
      (async () => {
        const request = await fetch(`/api/usuario/getId/${ID}`);
        const data = await request.json();
        if (data.reset_password) {
          onOpen();
        }
      })();
    }
  }, [ID, onOpen, primeiro_asseso]);

  const OverlayTwo = () => (
    <ModalOverlay
      bg="blackAlpha.600"
      backdropFilter="blur(10px)"
    />
  );

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    // Validação de senha vazia
    if (!Senha || !ConfirmeSenha) {
      toast({
        title: "Atenção!",
        description: "Por favor, preencha todos os campos.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    // Validação de senha mínima
    if (Senha.length < 6) {
      toast({
        title: "Senha muito curta!",
        description: "A senha deve ter no mínimo 6 caracteres.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    // Validação de confirmação
    if (Senha !== ConfirmeSenha) {
      toast({
        title: "Erro!",
        description: "As senhas devem ser iguais!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const data = { password: Senha };
      const request = await fetch(`/api/reset_password/${ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (request.ok) {
        toast({
          title: "Sucesso!",
          description: "Senha alterada com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onClose();
      } else {
        toast({
          title: "Erro!",
          description: "Erro ao alterar senha. Tente novamente.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast({
        title: "Erro!",
        description: "Erro de conexão. Tente novamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered 
      size="md"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      {OverlayTwo()}
      <ModalContent bg={bgModal} borderRadius="xl" mx={4}>
        {/* Header com ícone */}
        <ModalHeader pt={6} pb={4}>
          <VStack spacing={3} align="center">
            <Box
              p={3}
              bg="orange.100"
              _dark={{ bg: "orange.900" }}
              borderRadius="full"
            >
              <Icon as={FiLock} fontSize="24" color="#FB8501" />
            </Box>
            <VStack spacing={1}>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                Primeiro Acesso
              </Text>
              <Text fontSize="sm" color={subtextColor} textAlign="center">
                Por favor, defina uma nova senha para continuar
              </Text>
            </VStack>
          </VStack>
        </ModalHeader>

        <FormControl as="form" onSubmit={handleSubmit}>
          <ModalBody px={6} py={4}>
            <VStack spacing={4} w="full">
              {/* Campo Nova Senha */}
              <Box w="full">
                <FormLabel 
                  fontSize="sm" 
                  fontWeight="medium" 
                  color={textColor}
                  mb={2}
                >
                  Nova Senha
                </FormLabel>
                <SenhaComponent
                  onvalue={(e: SetStateAction<string>) => setSenha(e)}
                  setvalue={Senha}
                  envClick={undefined}
                />
                <Text fontSize="xs" color={subtextColor} mt={1}>
                  Mínimo de 6 caracteres
                </Text>
              </Box>

              {/* Campo Confirmação de Senha */}
              <Box w="full">
                <FormLabel 
                  fontSize="sm" 
                  fontWeight="medium" 
                  color={textColor}
                  mb={2}
                >
                  Confirmar Nova Senha
                </FormLabel>
                <SenhaComponent
                  onvalue={(e: SetStateAction<string>) => setConfirmeSenha(e)}
                  setvalue={ConfirmeSenha}
                  envClick={handleSubmit}
                />
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter px={6} pb={6} pt={4}>
            <VStack w="full" spacing={3}>
              <Button
                w="full"
                colorScheme="orange"
                bg="#FB8501"
                _hover={{ bg: "#E67700" }}
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="Salvando..."
                size="lg"
              >
                Salvar Nova Senha
              </Button>
              <Text fontSize="xs" color={subtextColor} textAlign="center">
                Esta ação é obrigatória para continuar
              </Text>
            </VStack>
          </ModalFooter>
        </FormControl>
      </ModalContent>
    </Modal>
  );
}
