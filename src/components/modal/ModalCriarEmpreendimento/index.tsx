"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
} from "@chakra-ui/react";
import { CardUpdateEmpreendimento } from "@/components/card_EditarEmpreendimento";

// ===== TYPES =====
interface Construtora {
  id: number;
  fantasia: string;
}

interface ModalCriarEmpreendimentoProps {
  lista: Construtora[];
  listEstado: any[];
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para criar novo empreendimento
 * Utiliza o CardUpdateEmpreendimento em modo de criação (sem ID)
 */
export function ModalCriarEmpreendimento({
  isOpen,
  lista,
  listEstado,
  onClose,
}: ModalCriarEmpreendimentoProps) {
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
          Criar Novo Empreendimento
        </ModalHeader>
        <ModalCloseButton
          _hover={{
            bg: "red.50",
            _dark: { bg: "red.900" },
          }}
        />
        <Divider borderColor="gray.300" _dark={{ borderColor: "gray.600" }} />

        <ModalBody py={6}>
          <CardUpdateEmpreendimento
            lista={lista}
            listEstado={listEstado}
            onSuccess={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
