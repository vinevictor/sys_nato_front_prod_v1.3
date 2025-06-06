"use client";

import {
  VStack,
  Text,
  Tag as ChakraTag,
  IconButton,
  Box,
  useToast, // Para feedback ao usuário
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation"; // Importar useRouter

interface TagType {
  id: number;
  label: string;
}

interface TagListProps {
  tags: TagType[];
  // A prop handleDeleteTag ou revalidate não é mais necessária aqui
  // se a deleção e revalidação são tratadas internamente.
}

export function TagList({ tags }: TagListProps) {
  const router = useRouter();
  const toast = useToast();

  const handleDelete = async (tagId: number) => {
    try {
      // Substitua pela URL da sua API de deleção
      const response = await fetch(`/api/tag-list/${tagId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao deletar tag");
      }

      toast({
        title: "Tag deletada.",
        description: "A tag foi removida com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.refresh(); // Revalida o cache e atualiza a UI

    } catch (error: any) {
      console.error("Erro ao deletar tag:", error);
      toast({
        title: "Erro ao deletar.",
        description: error.message || "Não foi possível remover a tag.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      h={{ base: "200px", md: "calc(100% - 60px)" }}
      overflowY="auto"
      pr={2} /* Adiciona padding à direita para a scrollbar */
    >
      {/* O Form não é mais necessário aqui para a deleção individual via API */}
      {tags.length > 0 ? (
        <VStack spacing={3} align="stretch">
          {tags.map((tag) => (
            <ChakraTag
              key={tag.id}
              size="lg"
              variant="subtle"
              colorScheme="blue"
              p={2}
              borderRadius="md"
              w="100%"
              justifyContent="space-between"
            >
              <Text>{tag.label}</Text>
              <IconButton
                aria-label="Excluir tag"
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                _hover={{ bg: "red.100" }}
                onClick={() => handleDelete(tag.id)} // Chama handleDelete ao clicar
              />
            </ChakraTag>
          ))}
        </VStack>
      ) : (
        <Text textAlign="center" color="gray.500">
          Nenhuma tag cadastrada ainda.
        </Text>
      )}
    </Box>
  );
}
