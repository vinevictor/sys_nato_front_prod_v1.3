"use client";

import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
// Ajuste o caminho do import conforme a estrutura da sua pasta actions
import { importarEstoqueVoucher } from "@/actions/voucher/voucherActions";

interface ImportVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Função para recarregar a lista pai
}

export function ImportVoucherModal({
  isOpen,
  onClose,
  onSuccess,
}: ImportVoucherModalProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleImport = async () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Campo vazio",
        description: "Cole o JSON antes de importar.",
        status: "warning",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Tenta parsear o JSON localmente para garantir que é válido
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (e) {
        throw new Error("O texto colado não é um JSON válido.");
      }

      // 2. Chama a Server Action
      const result = await importarEstoqueVoucher(parsedData);

      // 3. Sucesso
      toast({
        title: "Importação concluída!",
        description: result.mensagem || "Vouchers adicionados ao estoque.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setJsonInput(""); // Limpa o campo
      onSuccess(); // Recarrega a tabela na página pai
      onClose(); // Fecha o modal
    } catch (error: any) {
      toast({
        title: "Erro na importação",
        description: error.message || "Verifique o formato do JSON.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Importar Estoque (JSON)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.500">
              Cole abaixo o JSON retornado pelo sistema legado ou fornecido pela
              Soluti. O sistema irá extrair automaticamente os campos{" "}
              <b>gvs_voucher</b>.
            </Text>
            <FormControl>
              <FormLabel>Conteúdo JSON</FormLabel>
              <Textarea
                placeholder='{"data": { "result": [...] } }'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                height="300px"
                fontFamily="monospace"
                fontSize="sm"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            isDisabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleImport}
            isLoading={isLoading}
            loadingText="Importando..."
          >
            Processar Importação
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
