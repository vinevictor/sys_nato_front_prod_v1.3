"use client";
import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Image,
  Text,
} from "@chakra-ui/react";
import { FiDownload, FiX } from "react-icons/fi";
import type { ManagedImage } from "./index";

interface ImageGalleryProps {
  /**
   * Lista de imagens para exibir
   */
  images: ManagedImage[];
  /**
   * Callback chamado quando usuário remove uma imagem
   */
  onRemoveImage: (imageId: string) => void;
  /**
   * Número máximo de imagens permitidas
   */
  maxImages?: number;
}

/**
 * Componente de galeria de imagens que exibe previews em grade.
 * Funciona tanto com imagens de upload (blob URLs) quanto com URLs do banco de dados.
 * Ocupa 100% da largura disponível e exibe no máximo 5 imagens.
 */
export const ImageGallery = ({
  images,
  onRemoveImage,
  maxImages = 5,
}: ImageGalleryProps) => {
  // Limita a exibição ao número máximo de imagens
  const displayedImages = images.slice(0, maxImages);
  const hasImages = displayedImages.length > 0;

  return (
    <Box w="full" mt={4}>
      {/* Cabeçalho da galeria */}
      <Flex justify="space-between" align="center" mb={3}>
        <Text
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.300" }}
        >
          Imagens anexadas ({displayedImages.length}/{maxImages})
        </Text>
        {images.length > maxImages && (
          <Text fontSize="xs" color="orange.500" _dark={{ color: "orange.400" }}>
            Mostrando apenas {maxImages} de {images.length} imagens
          </Text>
        )}
      </Flex>

      {/* Grade de imagens */}
      <Grid
        w="full"
        templateColumns={{
          base: "repeat(2, 1fr)", // 2 colunas no mobile
          sm: "repeat(3, 1fr)", // 3 colunas em tablets pequenos
          md: "repeat(4, 1fr)", // 4 colunas em tablets
          lg: "repeat(5, 1fr)", // 5 colunas em desktop
        }}
        gap={4}
        minH={{ base: "140px", md: "160px" }}
        alignItems={hasImages ? "stretch" : "center"}
        justifyItems={hasImages ? "stretch" : "center"}
      >
        {hasImages ? (
          displayedImages.map((image) => {
            const downloadUrl = image.isNew
              ? null
              : image.url_download ?? image.url_view;

            return (
              <Box
                key={image.id}
                className="image-box"
                position="relative"
                w="full"
                paddingBottom="75%" // Aspect ratio 4:3
                overflow="hidden"
                borderRadius="lg"
                boxShadow="md"
                borderWidth="2px"
                borderColor="gray.200"
                _dark={{
                  borderColor: "gray.700",
                  boxShadow: "dark-lg",
                }}
                transition="all 0.2s"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                  borderColor: "#00713D",
                  _dark: {
                    borderColor: "#00d672",
                    boxShadow: "dark-lg",
                  },
                }}
              >
                {/* Imagem */}
                <Image
                  src={image.url_view}
                  alt={`Imagem ${image.id}`}
                  objectFit="cover"
                  position="absolute"
                  top={0}
                  left={0}
                  w="full"
                  h="full"
                  loading="lazy"
                />

                {/* Overlay com botões de ação */}
                <Flex
                  position="absolute"
                  top={2}
                  right={2}
                  gap={1}
                  opacity={0}
                  transition="opacity 0.2s"
                  _groupHover={{ opacity: 1 }}
                  sx={{
                    ".image-box:hover &": {
                      opacity: 1,
                    },
                  }}
                >
                  {/* Botão de download - apenas para imagens do banco */}
                  {!image.isNew && downloadUrl && (
                    <Button
                      as="a"
                      href={downloadUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      size="xs"
                      colorScheme="blue"
                      borderRadius="full"
                      p={0}
                      minW="24px"
                      h="24px"
                      aria-label="Download imagem"
                      title="Download"
                      _hover={{
                        transform: "scale(1.1)",
                      }}
                    >
                      <Icon as={FiDownload} w={3} h={3} />
                    </Button>
                  )}

                  {/* Botão de remover */}
                  <Button
                    size="xs"
                    colorScheme="red"
                    borderRadius="full"
                    onClick={() => onRemoveImage(image.id)}
                    p={0}
                    minW="24px"
                    h="24px"
                    aria-label="Remover imagem"
                    title="Remover"
                    _hover={{
                      transform: "scale(1.1)",
                    }}
                  >
                    <Icon as={FiX} w={3} h={3} />
                  </Button>
                </Flex>

                {/* Badge indicando nova imagem */}
                {image.isNew && (
                  <Box
                    position="absolute"
                    bottom={2}
                    left={2}
                    bg="green.500"
                    color="white"
                    fontSize="2xs"
                    fontWeight="bold"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    textTransform="uppercase"
                  >
                    Nova
                  </Box>
                )}
              </Box>
            );
          })
        ) : (
          <Flex
            gridColumn="1 / -1"
            w="full"
            h="full"
            borderWidth="2px"
            borderStyle="dashed"
            borderColor="gray.300"
            borderRadius="lg"
            align="center"
            justify="center"
            bg="gray.50"
            _dark={{ bg: "gray.800", borderColor: "gray.600" }}
          >
            <Text
              fontSize="sm"
              color="gray.500"
              _dark={{ color: "gray.400" }}
            >
              Nenhuma imagem selecionada até o momento
            </Text>
          </Flex>
        )}
      </Grid>

      {/* Mensagem informativa se houver imagens novas */}
      {displayedImages.some((img) => img.isNew) && (
        <Text
          fontSize="xs"
          color="gray.500"
          _dark={{ color: "gray.400" }}
          mt={3}
          fontStyle="italic"
        >
          * Imagens marcadas como &quot;Nova&quot; serão enviadas ao salvar o chamado
        </Text>
      )}
    </Box>
  );
};
