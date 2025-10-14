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
} from "@chakra-ui/react";
import { CardUpdateEmpreendimento } from "@/components/card_EditarEmpreendimento";
import { useEffect, useState } from "react";

// ===== TYPES =====
interface Construtora {
  id: number;
  [key: string]: unknown;
}

interface EmpreendimentoCard {
  construtora?: Construtora;
  nome?: string;
  estado?: string;
  cidade?: string;
  financeiros?: string;
}

interface ModalEditarEmpreendimentoProps {
  id: number;
  isOpen: boolean;
  onClose: () => void;
}

// ===== COMPONENT =====
/**
 * Modal para edição de empreendimento
 *
 * Exibe o formulário de edição em um modal ao invés de uma página separada.
 * Busca os dados do empreendimento pela API e passa para o formulário.
 *
 * @param id - ID do empreendimento a ser editado
 * @param isOpen - Estado de abertura do modal
 * @param onClose - Função para fechar o modal
 * @returns Modal com formulário de edição
 */
export function ModalEditarEmpreendimento({
  id,
  isOpen,
  onClose,
}: ModalEditarEmpreendimentoProps) {
  const [data, setData] = useState<EmpreendimentoCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmpreendimento = async (id: number) => {
    setIsLoading(true);
    try {
      const req = await fetch(`/api/empreendimento/get/${id}`);
      const res = await req.json();
      console.log("🚀 ~ fetchEmpreendimento ~ res:", res);
      setData(res);
    } catch (error) {
      console.error("Erro ao buscar empreendimento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && id) {
      fetchEmpreendimento(id);
    }
  }, [id, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay
        bg="blackAlpha.600"
        backdropFilter="blur(4px)"
      />
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
          Editar Empreendimento
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
                Carregando dados do empreendimento...
              </Text>
            </Flex>
          ) : data ? (
            <CardUpdateEmpreendimento id={id} setEmpreendimentoCard={data} />
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
    </Modal>
  );
}
