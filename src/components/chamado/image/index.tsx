"use client";
import {
  Button,
  Flex,
  FormLabel,
  Icon,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, DragEvent, useCallback, useEffect } from "react";
import { FiUpload } from "react-icons/fi";

// Interface interna para gerenciar todas as imagens (existentes e novas)
export interface ManagedImage {
  id: string; // ID único para cada imagem (gerado para novas, pode ser url_view para existentes se único)
  url_view: string; // URL para visualização (blob URL para novas, prop url_view para existentes)
  url_download?: string; // URL para download (apenas para existentes)
  file?: File; // Objeto File para novas imagens
  isNew: boolean; // Flag para identificar se é uma nova imagem
}

interface ImageComponentProps {
  // Callback chamado com a lista atualizada de ManagedImage
  onImagesChange: (images: ManagedImage[]) => void;
  // Lista de imagens gerenciadas pelo componente pai
  images: ManagedImage[];
  maxImages?: number;
}

export const ImageComponent = ({
  onImagesChange,
  images,
  maxImages = 5,
}: ImageComponentProps) => {
  const toast = useToast();

  // Efeito para atualizar o callback de onChange quando as imagens gerenciadas mudarem
  useEffect(() => {
    // Envia todas as imagens gerenciadas (novas e existentes) para o callback.
    // O componente pai pode então usar a flag 'isNew' para diferenciar
    // quais imagens precisam ser enviadas para o backend, por exemplo.
    onImagesChange(images);
  }, [images, onImagesChange]);

  // Efeito para limpar blob URLs ao desmontar o componente
  useEffect(() => {
    const currentImages = images;
    return () => {
      // Função de cleanup
      currentImages.forEach((img) => {
        if (img.isNew && img.url_view.startsWith("blob:")) {
          URL.revokeObjectURL(img.url_view);
        }
      });
    };
  }, [images]);

  const handleAddFiles = useCallback(
    (files: File[]) => {
      const validFiles = files.filter((file) => file.type.startsWith("image/"));

      if (validFiles.length !== files.length) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione apenas imagens.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

      const currentImageCount = images.length;
      if (currentImageCount + validFiles.length > maxImages) {
        toast({
          title: "Limite excedido",
          description: `Você pode adicionar no máximo ${maxImages} imagens. Já existem ${currentImageCount}.`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Cria um array de novas imagens válidas
      const newManagedImages: ManagedImage[] = validFiles.map((file) => ({
        id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url_view: URL.createObjectURL(file),
        file: file,
        isNew: true,
      }));

      // Adiciona as novas imagens ao array existente, sem substituir as anteriores
      // A atualização é feita através do callback para o componente pai
      onImagesChange([...images, ...newManagedImages]);
    },
    [images, maxImages, toast, onImagesChange]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      handleAddFiles(files);
    },
    [handleAddFiles]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        handleAddFiles(files);
        e.target.value = ""; // Resetar o input para permitir selecionar o mesmo arquivo novamente
      }
    },
    [handleAddFiles]
  );

  return (
    <Flex w={"full"} gap={2} h="full" flexDir="column">
      <FormLabel
        fontSize="sm"
        fontWeight="md"
        color="gray.700"
        _dark={{ color: "gray.300" }}
      >
        Imagens
      </FormLabel>
      <Flex
        w={"full"}
        h="150px"
        border="2px dashed"
        borderColor="gray.300"
        _dark={{
          borderColor: "gray.600",
          bg: images.length >= maxImages ? "gray.700" : "gray.800",
        }}
        borderRadius="lg"
        p={4}
        justifyContent="center"
        alignItems="center"
        flexDir="column"
        gap={4}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        bg={images.length >= maxImages ? "gray.200" : "gray.50"}
        _hover={{
          borderColor: images.length >= maxImages ? "gray.300" : "#00713D",
          bg: images.length >= maxImages ? "gray.200" : "gray.100",
          _dark: {
            bg: images.length >= maxImages ? "gray.800" : "gray.900",
            borderColor: images.length >= maxImages ? "gray.600" : "#00d672",
          },
        }}
        transition="all 0.2s"
        opacity={images.length >= maxImages ? 0.7 : 1}
      >
        <Icon
          as={FiUpload}
          w={8}
          h={8}
          color="gray.400"
          _dark={{ color: "gray.500" }}
        />
        <Text color="gray.500" _dark={{ color: "gray.400" }} textAlign="center">
          {images.length >= maxImages
            ? "Limite de imagens atingido"
            : "Arraste e solte suas imagens aqui ou"}
        </Text>
        <Text color="gray.400" _dark={{ color: "gray.500" }} fontSize="sm">
          Limite: {images.length}/{maxImages} imagens
        </Text>
        <Button
          as="label"
          htmlFor="file-upload-main"
          colorScheme="green"
          bg="#00713D"
          _hover={{ bg: "#005a31" }}
          _dark={{
            bg: "#00d672",
            color: "gray.900",
            _hover: { bg: "#00c060" },
          }}
          isDisabled={images.length >= maxImages}
          cursor={images.length >= maxImages ? "not-allowed" : "pointer"}
        >
          Selecione do computador
          <Input
            id="file-upload-main"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            display="none"
            isDisabled={images.length >= maxImages}
          />
        </Button>
      </Flex>
    </Flex>
  );
};
