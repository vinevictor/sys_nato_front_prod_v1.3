"use client";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Grid,
  Icon,
  Input,
  Text,
  useToast,
  Image,
} from "@chakra-ui/react";
import React, {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { FiDownload, FiUpload, FiX } from "react-icons/fi";

// Interface para as imagens existentes passadas como prop
export interface ExistingImageInput {
  url_view: string;
  url_download?: string;
  // Se suas imagens existentes tiverem um ID único, adicione aqui.
  // Ex: id?: string | number;
}

// Interface interna para gerenciar todas as imagens (existentes e novas)
interface ManagedImage {
  id: string; // ID único para cada imagem (gerado para novas, pode ser url_view para existentes se único)
  url_view: string; // URL para visualização (blob URL para novas, prop url_view para existentes)
  url_download?: string; // URL para download (apenas para existentes)
  file?: File; // Objeto File para novas imagens
  isNew: boolean; // Flag para identificar se é uma nova imagem
}

interface ImageComponentProps {
  // Callback chamado com a lista atualizada de ManagedImage
  onChange: (images: ManagedImage[]) => void;
  onRemoveExistingImage?: (imageId: string, imageUrl: string) => void;
  DataImages?: ExistingImageInput[];
  maxImages?: number;
}

export const ImageComponent = ({
  onChange,
  DataImages = [],
  maxImages = 5,
  onRemoveExistingImage,
}: ImageComponentProps) => {
  const [managedImages, setManagedImages] = useState<ManagedImage[]>([]);
  const toast = useToast();

  const isInitializedRef = useRef(false);

  // Efeito para inicializar as imagens existentes apenas uma vez 
  useEffect(() => {
    // Verifica se já foi inicializado para evitar reprocessamento
    if (!isInitializedRef.current && DataImages?.length > 0) {
      // Converte DataImages para ManagedImage
      const existingImages = DataImages.map(img => ({
        id: img.url_view,
        url_view: img.url_view,
        url_download: img.url_download,
        isNew: false
      }));
      
      // Inicializa o estado com as imagens existentes
      setManagedImages(existingImages);
      isInitializedRef.current = true;
    }
  }, [DataImages]);

  // Efeito para atualizar o callback de onChange quando as imagens gerenciadas mudarem
  useEffect(() => {
    // Envia todas as imagens gerenciadas (novas e existentes) para o callback.
    // O componente pai pode então usar a flag 'isNew' para diferenciar
    // quais imagens precisam ser enviadas para o backend, por exemplo.
    onChange(managedImages);
  }, [managedImages, onChange]);

  // Efeito para limpar blob URLs ao desmontar o componente
  useEffect(() => {
    return () => {
      managedImages.forEach((img) => {
        if (img.isNew && img.url_view.startsWith("blob:")) {
          URL.revokeObjectURL(img.url_view);
        }
      });
    };
  }, [managedImages]);

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

      const currentImageCount = managedImages.length;
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
      setManagedImages((prev) => [
        ...prev, // mantém as imagens já existentes
        ...newManagedImages // adiciona as novas imagens
      ]);
      // DICA: Usar o spread operator garante que cada nova imagem será adicionada junto das outras, formando uma galeria.
      // Isso evita que uma nova imagem substitua as anteriores.
      // Sempre utilize essa abordagem ao trabalhar com arrays no estado do React.
      console.log("Imagens adicionadas:", newManagedImages);
    },
    [managedImages, maxImages, toast]
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

  const removeImage = useCallback(
    (idToRemove: string) => {
      setManagedImages((prev) =>
        prev.filter((img) => {
          if (img.id === idToRemove) {
            if (img.isNew && img.url_view.startsWith("blob:")) {
              URL.revokeObjectURL(img.url_view); // Limpar blob URL
            } else if (!img.isNew && onRemoveExistingImage) {
              onRemoveExistingImage(img.id, img.url_view); // Chamar onRemove para imagens existentes
            }
            return false;
          }
          return true;
        })
      );
    },
    [onRemoveExistingImage]
  );

  /**
   * Função para lidar com o download de uma imagem existente.
   * Cria um link temporário e o clica para iniciar o download.
   * @param downloadUrl A URL da imagem a ser baixada.
   */
  const handleDownloadImage = useCallback((downloadUrl?: string) => {
    if (!downloadUrl) {
      toast({
        title: "Download indisponível",
        description: "O link para download não foi fornecido para esta imagem.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Cria um elemento de link na memória para iniciar o download
    const link = document.createElement('a');
    link.href = downloadUrl;
    // Opcional: você pode definir um nome para o arquivo baixado
    // link.download = downloadUrl.split('/').pop() || 'imagem';

    // Adiciona, clica e remove o link do DOM
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }, [toast]);

  return (
    <Flex w={"full"} gap={2} h="full" flexDir="column">
      <FormLabel>Imagens</FormLabel>
      <Flex
        w={"full"}
        minH="150px"
        border="2px dashed"
        borderColor="gray.300"
        borderRadius="lg"
        p={4}
        justifyContent="center"
        alignItems="center"
        flexDir="column"
        gap={4}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        bg={managedImages.length >= maxImages ? "gray.200" : "gray.50"}
        _hover={{
          borderColor:
            managedImages.length >= maxImages ? "gray.300" : "blue.500",
          bg: managedImages.length >= maxImages ? "gray.200" : "gray.100",
        }}
        transition="all 0.2s"
        opacity={managedImages.length >= maxImages ? 0.7 : 1}
      >
        <Icon as={FiUpload} w={8} h={8} color="gray.400" />
        <Text color="gray.500" textAlign="center">
          {managedImages.length >= maxImages
            ? "Limite de imagens atingido"
            : "Arraste e solte suas imagens aqui ou"}
        </Text>
        <Text color="gray.400" fontSize="sm">
          Limite: {managedImages.length}/{maxImages} imagens
        </Text>
        <Button
          as="label"
          htmlFor="file-upload-main"
          colorScheme="blue"
          isDisabled={managedImages.length >= maxImages}
          cursor={managedImages.length >= maxImages ? "not-allowed" : "pointer"}
        >
          Selecione do computador
          <Input
            id="file-upload-main"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            display="none"
            isDisabled={managedImages.length >= maxImages}
          />
        </Button>
      </Flex>

      {managedImages.length > 0 && (
        <Grid
          templateColumns="repeat(auto-fill, minmax(120px, 1fr))"
          gap={6}
          mt={4}
        >
          {managedImages.map((image) => (
            <Box
              key={image.id}
              position="relative"
              w={{ base: "120px", lg: "150px" }}
              h={{ base: "90px", lg: "100px" }}
              overflow="hidden"
              borderRadius="md"
              boxShadow="sm"
            >
              <Image
                src={image.url_view}
                alt={`Preview ${image.id}`}
                objectFit="cover"
                w="full"
                h="full"
              />
              <Flex position="absolute" top={1} right={1} gap={1}>
                <Button
                  size="xs"
                  colorScheme="red"
                  borderRadius="full"
                  onClick={() => removeImage(image.id)}
                  p={0}
                  minW="20px"
                  h="20px"
                  aria-label="Remover imagem"
                >
                  <Icon as={FiX} w={3} h={3} />
                </Button>
                <Button
                  size="xs"
                  colorScheme="blue"
                  borderRadius="full"
                  onClick={() => handleDownloadImage(image.url_download)}
                  p={0}
                  minW="20px"
                  h="20px"
                  aria-label="Download imagem"
                  // Desabilita o botão se a imagem for nova (ainda não salva) ou não tiver URL de download
                  isDisabled={image.isNew || !image.url_download}
                >
                  <Icon as={FiDownload} w={3} h={3} />
                </Button>
              </Flex>
            </Box>
          ))}
        </Grid>
      )}
    </Flex>
  );
};
