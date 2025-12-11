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
import ArParceiraForm from "./form"; // Importa o form criado acima
import { getArParceiraById } from "@/actions/ar-parceira/arParceiraActions"; // Importa a action

interface ModalEditarArParceiraProps {
  isOpen: boolean;
  onClose: () => void;
  parceiraId?: number; // Se vier ID, é edição
  onSuccess?: () => void;
}

export default function ModalEditarArParceira({
  isOpen,
  onClose,
  parceiraId,
  onSuccess,
}: ModalEditarArParceiraProps) {
  const [loading, setLoading] = useState(false);
  const [parceiraData, setParceiraData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Busca dados quando o modal abre (se for edição)
  useEffect(() => {
    if (isOpen && parceiraId) {
      fetchData();
    } else if (isOpen && !parceiraId) {
      setParceiraData(null); // Reseta para modo criação
      setLoading(false);
    }
  }, [isOpen, parceiraId]);

  const fetchData = async () => {
    if (!parceiraId) return;
    setLoading(true);
    try {
      // Chama a Server Action diretamente
      const data = await getArParceiraById(parceiraId);
      if (data) {
        setParceiraData(data);
      } else {
        throw new Error("Dados não encontrados");
      }
    } catch (error) {
      console.error("Erro ao buscar parceira:", error);
      setParceiraData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
        <ModalContent>
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            color="#023147"
            _dark={{ color: "white" }}
          >
            {parceiraId ? "Editar AR Parceira" : "Nova AR Parceira"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody py={6}>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minH="300px"
                flexDirection="column"
                gap={4}
              >
                <Spinner size="xl" color="#00713D" thickness="4px" />
                <Text color="gray.500">Carregando dados...</Text>
              </Box>
            ) : (
              <ArParceiraForm
                parceiraId={parceiraId}
                initialData={parceiraData}
                onCancel={onClose}
                onSuccess={handleSuccess}
                onSaving={setIsSaving}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Loading Screen Global (Overlay) */}
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
          >
            <VStack
              spacing={6}
              bg="white"
              p={10}
              borderRadius="2xl"
              shadow="2xl"
              _dark={{ bg: "gray.800" }}
            >
              <Icon
                as={MdAutorenew}
                w={20}
                h={20}
                color="green.500"
                animation="spin 2s linear infinite"
              />
              <Heading size="md" color="gray.700" _dark={{ color: "white" }}>
                Salvando alterações...
              </Heading>
              <Text color="gray.500">Por favor, aguarde.</Text>
            </VStack>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </Flex>
        </Portal>
      )}
    </>
  );
}
