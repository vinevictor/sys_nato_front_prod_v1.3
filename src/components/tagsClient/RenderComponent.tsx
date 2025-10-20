"use client";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  useToast,
  VStack,
  useDisclosure,
  Tag as ChakraTag,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdAdd,
  MdSearch,
  MdLabel,
  MdDelete,
} from "react-icons/md";
import { ModalCriarTag } from "./modal";

interface TagType {
  id: number;
  label: string;
  createdAt: string;
}

interface TagsClientProps {
  dados: TagType[];
}

/**
 * Componente de página de tags
 *
 * Exibe lista de tags com filtros e opção de criar nova.
 * Possui layout responsivo e suporte completo a dark mode.
 *
 * @param dados - Lista de tags
 * @returns Componente de página de tags
 */
export default function TagsClientComponent({ dados }: TagsClientProps) {
  const [tags, setTags] = useState<TagType[]>([]);
  const [dadosFiltrados, setDadosFiltrados] = useState<TagType[]>([]);
  const router = useRouter();

  // Estados dos filtros
  const [filtroNome, setFiltroNome] = useState("");
  const [deletingTagId, setDeletingTagId] = useState<number | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    setTags(dados);
    setDadosFiltrados(dados);
  }, [dados]);

  // Função de filtro
  useEffect(() => {
    let resultados = [...tags];

    // Filtro por Nome
    if (filtroNome) {
      resultados = resultados.filter((tag: TagType) =>
        tag.label.toLowerCase().includes(filtroNome.toLowerCase())
      );
    }

    setDadosFiltrados(resultados);
  }, [filtroNome, tags]);

  const handleDelete = async (tagId: number) => {
    setDeletingTagId(tagId);
    try {
      const response = await fetch(`/api/tags/delete/${tagId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao deletar tag");
      }

      toast({
        title: "Tag deletada",
        description: "A tag foi removida com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      router.refresh();
    } catch (error: any) {
      console.error("Erro ao deletar tag:", error);
      toast({
        title: "Erro ao deletar",
        description: error.message || "Não foi possível remover a tag.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setDeletingTagId(null);
    }
  };

  return (
    <Container maxW="95%" py={4} px={6}>
      <VStack spacing={0} align="stretch" w="full">
        {/* Cabeçalho da Página */}
        <Flex
          bg="white"
          borderBottomWidth="2px"
          borderBottomColor="#00713D"
          p={{ base: 4, md: 6 }}
          align="center"
          justify="space-between"
          borderRadius="xl"
          borderBottomRadius={0}
          shadow="lg"
          flexDir={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
          _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
        >
          {/* Título com ícone */}
          <Flex align="center" gap={3}>
            <Icon
              as={MdLabel}
              w={{ base: 8, md: 10 }}
              h={{ base: 8, md: 10 }}
              color="#00713D"
              _dark={{ color: "#00d672" }}
            />
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Gerenciar Tags
              </Heading>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Visualize e gerencie as tags do sistema
              </Text>
            </Box>
          </Flex>

          {/* Botão Criar Tag */}
          <Button
            leftIcon={<MdAdd />}
            colorScheme="green"
            bg="#00713D"
            size={{ base: "md", md: "lg" }}
            onClick={onOpen}
            transition="all 0.2s"
            w={{ base: "full", md: "auto" }}
            _hover={{
              bg: "#005a31",
              transform: "translateY(-2px)",
              shadow: "lg",
            }}
            _active={{ transform: "translateY(0)" }}
            _dark={{
              bg: "#00d672",
              color: "gray.900",
              _hover: { bg: "#00c060" },
            }}
          >
            Criar Nova Tag
          </Button>
        </Flex>

        {/* Conteúdo da Página */}
        <VStack
          spacing={6}
          align="stretch"
          bg="white"
          _dark={{ bg: "gray.800" }}
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          borderTopRadius={0}
          shadow="lg"
          minH="400px"
        >
          {/* Filtros */}
          <Box
            w="full"
            bg="gray.50"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            _dark={{ bg: "gray.900", borderColor: "gray.700" }}
          >
            <Heading
              size="sm"
              mb={4}
              color="#023147"
              _dark={{ color: "gray.100" }}
            >
              Filtrar Tags
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={4}
            >
              {/* Filtro por Nome */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  Nome
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por nome"
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                    bg="white"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                    borderColor="gray.300"
                    _hover={{ borderColor: "#00713D" }}
                    _focus={{
                      borderColor: "#00713D",
                      boxShadow: "0 0 0 1px #00713D",
                    }}
                  />
                </InputGroup>
              </Box>
            </SimpleGrid>

            {/* Contador de resultados */}
            <Flex mt={4} justify="space-between" align="center">
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                {dadosFiltrados.length}{" "}
                {dadosFiltrados.length === 1
                  ? "tag encontrada"
                  : "tags encontradas"}
              </Text>

              {filtroNome && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => setFiltroNome("")}
                >
                  Limpar Filtros
                </Button>
              )}
            </Flex>
          </Box>

          {/* Lista de Tags */}
          <Box w="full">
            {dadosFiltrados.length > 0 ? (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                spacing={4}
                w="full"
              >
                {dadosFiltrados.map((tag) => (
                  <Box
                    key={tag.id}
                    bg="white"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="gray.200"
                    p={4}
                    shadow="sm"
                    transition="all 0.2s"
                    _hover={{
                      shadow: "md",
                      transform: "translateY(-2px)",
                    }}
                    _dark={{ bg: "gray.700", borderColor: "gray.600" }}
                  >
                    <Flex justify="space-between" align="center">
                      <ChakraTag
                        size="lg"
                        variant="subtle"
                        colorScheme="green"
                        p={2}
                        borderRadius="md"
                      >
                        <Text fontWeight="medium">{tag.label}</Text>
                      </ChakraTag>

                      <IconButton
                        aria-label="Excluir tag"
                        icon={<MdDelete />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(tag.id)}
                        isLoading={deletingTagId === tag.id}
                        isDisabled={deletingTagId !== null}
                        _hover={{ bg: "red.100" }}
                        _dark={{ _hover: { bg: "red.900" } }}
                      />
                    </Flex>

                    <Text
                      fontSize="xs"
                      color="gray.500"
                      _dark={{ color: "gray.400" }}
                      mt={2}
                    >
                      ID: {tag.id}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            ) : tags.length > 0 ? (
              <Flex
                w="full"
                minH="300px"
                justifyContent="center"
                alignItems="center"
                bg="gray.50"
                _dark={{ bg: "gray.900" }}
                borderRadius="lg"
                p={8}
                flexDir="column"
                gap={4}
              >
                <Icon as={MdSearch} w={16} h={16} color="gray.400" />
                <Text
                  fontSize="lg"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                >
                  Nenhuma tag encontrada com os filtros aplicados
                </Text>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={() => setFiltroNome("")}
                >
                  Limpar Filtros
                </Button>
              </Flex>
            ) : (
              <Flex
                w="full"
                minH="300px"
                justifyContent="center"
                alignItems="center"
                bg="gray.50"
                _dark={{ bg: "gray.900" }}
                borderRadius="lg"
                p={8}
                flexDir="column"
                gap={4}
              >
                <Icon as={MdLabel} w={16} h={16} color="gray.400" />
                <Text
                  fontSize="lg"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  textAlign="center"
                >
                  Nenhuma tag cadastrada ainda.
                </Text>
                <Button
                  leftIcon={<MdAdd />}
                  colorScheme="green"
                  onClick={onOpen}
                >
                  Criar Primeira Tag
                </Button>
              </Flex>
            )}
          </Box>
        </VStack>
      </VStack>

      {/* Modal de Criação de Tag */}
      <ModalCriarTag
        isOpen={isOpen}
        onClose={onClose}
      />
    </Container>
  );
}
