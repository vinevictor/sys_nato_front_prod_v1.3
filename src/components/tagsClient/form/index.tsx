"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdSave } from "react-icons/md";

interface TagFormProps {
  onSuccess?: () => void;
  onSaving?: (isSaving: boolean) => void;
}

/**
 * Formulário de criação de tags
 *
 * @param onSuccess - Callback executado após sucesso
 * @param onSaving - Callback para controlar estado de salvamento
 * @returns Componente de formulário
 */
export default function TagForm({
  onSuccess,
  onSaving,
}: TagFormProps) {
  const [label, setLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const toast = useToast();

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!label.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome da tag.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);
    if (onSaving) onSaving(true);

    try {
      const response = await fetch("/api/tags/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: `${label.trim()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar tag");
      }

      toast({
        title: "Tag criada",
        description: "A tag foi criada com sucesso!",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });

      router.refresh();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro ao salvar tag:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar a tag.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
      if (onSaving) onSaving(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        {/* Header informativo */}
        <Box
          bg="gray.50"
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
          _dark={{ bg: "gray.900", borderColor: "gray.700" }}
        >
          <Heading
            size="sm"
            color="#023147"
            _dark={{ color: "gray.100" }}
            mb={2}
          >
            Preencha os Dados da Tag
          </Heading>
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            Informe o nome da tag que deseja cadastrar.
          </Text>
        </Box>

        {/* Seção: Dados da Tag */}
        <Box>
          <Heading
            size="sm"
            mb={4}
            color="#023147"
            _dark={{ color: "gray.100" }}
          >
            Dados da Tag
          </Heading>

          <SimpleGrid columns={{ base: 1 }} spacing={4}>
            {/* Nome da Tag */}
            <FormControl isRequired>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Nome da Tag
              </FormLabel>
              <Input
                type="text"
                placeholder="Digite o nome da tag"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: "green.500" }}
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                }}
                size="lg"
                _dark={{ bg: "gray.800", borderColor: "gray.600" }}
              />
            </FormControl>
          </SimpleGrid>
        </Box>

        {/* Botões de Ação */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
          <Button
            variant="outline"
            colorScheme="gray"
            size="lg"
            onClick={() => onSuccess && onSuccess()}
            isDisabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            leftIcon={<MdSave />}
            colorScheme="green"
            bg="#00713D"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Criando..."
            _hover={{ bg: "#005a31" }}
            _dark={{
              bg: "#00d672",
              color: "gray.900",
              _hover: { bg: "#00c060" },
            }}
          >
            Criar Tag
          </Button>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
