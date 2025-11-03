"use client";
import Loading from "@/app/loading";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiMessageSquare, FiSave } from "react-icons/fi";
import HistoricoComponent from "../historico";
import MensagensChat from "../mensagensChat";
import { DetalhesChamadoComponent } from "./detalhes";
import { ImageComponent } from "./image";
import { ImageGallery } from "./image/ImageGallery";
import { Session } from "@/types/session";

interface ChamadoProps {
  data: TypeChamado | null;
  session: Session.AuthUser;
}

type TypeChamado = {
  id: number;
  titulo?: string;
  descricao?: string;
  status: string;
  idUser?: number;
  idResposta?: number;
  resposta?: string;
  createAt: string;
  updatedAt?: string;
  solicitacaoId?: number;
  temp: any[];
  chat: any[];
  images: any[];
  departamento: string;
  prioridade: string;
  dth_qru: string;
  images_adm: any[];
  respostaData?: any;
  User?: any;
  solicitacaoData: any;
};

type ManagedImage = {
  url_view: string;
  url_download?: string;
  isNew: boolean;
  id: string;
  file?: File;
};

export const ChamadoRootComponent = ({ data, session }: ChamadoProps) => {
  const [images, setImages] = useState<ManagedImage[]>([]);
  const [departamento, setDepartamento] = useState<string>("");
  const [prioridade, setPrioridade] = useState<string>("");
  const [dth_qru, setDthQru] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [status, setStatus] = useState<string>("ABERTO");
  const [solicitacaoId, setSolicitacaoId] = useState<number>(0);
  const [DadosChamado, setDadosChamado] = useState<TypeChamado | null>(null);
  const [titulo, setTitulo] = useState<string>("");
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();

  const removeImage = useCallback(
    (idToRemove: string) => {
      setImages((prev) =>
        prev.filter((img) => {
          if (img.id === idToRemove) {
            // Revogar blob URL se for uma imagem nova
            if (img.isNew && img.url_view.startsWith("blob:")) {
              URL.revokeObjectURL(img.url_view);
            }
            return false;
          }
          return true;
        })
      );
    },
    []
  );

  const SaveChat = async (chat: any) => {
    try {
      if (!DadosChamado?.id) {
        throw new Error("Chamado não encontrado");
      }
      const dataChat = {
        chat,
        temp: [
          ...DadosChamado?.temp,
          {
            id: new Date().getTime().toString(),
            descricao: `Mensagem enviada por ${session.nome}`,
            createAt: new Date().toISOString(),
          },
        ],
      };
      const response = await fetch(`/api/chamado/put/${DadosChamado?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataChat),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setDadosChamado(result);
      toast({
        title: "Sucesso",
        description: "Mensagem enviada com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || error || "Erro ao salvar mensagem",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const SaveImage = async () => {
    const newImagesToUpload = images.filter((img) => img.isNew && img.file);
    const existingImagesToKeep = images.filter((img) => !img.isNew);

    if (newImagesToUpload.length === 0) {
      return existingImagesToKeep;
    }

    try {
      const uploadPromises = newImagesToUpload.map(async (image) => {
        const formData = new FormData();
        formData.append("file", image.file as File);
        formData.append("type", "chamado");

        const response = await fetch("/api/doc/post", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        if (!result.data) {
          console.error("Upload falhou - resultado inválido:", result);
          return null;
        }

        return result.data;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const validUploadedImages = uploadedImages.filter((img) => img !== null);

      if (validUploadedImages.length === 0 && newImagesToUpload.length > 0) {
        throw new Error("Nenhuma imagem nova foi enviada com sucesso");
      }

      return [...existingImagesToKeep, ...validUploadedImages];
    } catch (error) {
      console.error("Erro ao enviar imagens:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const hasDate = dth_qru || DadosChamado?.dth_qru;
      const requiredFields = [
        { value: titulo.trim(), label: "Título" },
        { value: departamento.trim(), label: "Departamento" },
        { value: prioridade.trim(), label: "Prioridade" },
        { value: descricao.trim(), label: "Descrição" },
        { value: hasDate ? "filled" : "", label: "Data do ocorrido" },
      ];

      const missingFields = requiredFields
        .filter((field) => !field.value)
        .map((field) => field.label);

      if (missingFields.length > 0) {
        toast({
          title: "Campos obrigatórios",
          description: `Preencha os campos: ${missingFields.join(", ")}`,
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        setIsLoading(false);
        return;
      }

      const finalImages = await SaveImage();
      let formattedDthQru = DadosChamado?.dth_qru || new Date().toISOString();
      if (dth_qru) {
        try {
          formattedDthQru = new Date(dth_qru).toISOString();
        } catch (error) {
          console.error("Data inválida:", error);
        }
      }

      const dados = {
        titulo,
        departamento,
        prioridade,
        dth_qru: formattedDthQru,
        descricao,
        status,
        solicitacaoId,
        ...(!data?.idUser && { idUser: session.id }),
        images:
          finalImages.length > 0
            ? finalImages.map((img) => ({
                url_view: img.url_view,
                url_download: img.url_download,
              }))
            : [],

        temp: !DadosChamado?.id
          ? [
              {
                id: new Date().getTime().toString(),
                descricao: `Chamado criado por ${session.nome}`,
                createAt: new Date().toISOString(),
              },
            ]
          : [
              ...DadosChamado?.temp,
              {
                id: new Date().getTime().toString(),
                descricao: `Chamado atualizado por ${session.nome}`,
                createAt: new Date().toISOString(),
              },
            ],
      };

      const url = !DadosChamado?.id
        ? "/api/chamado/post"
        : `/api/chamado/put/${DadosChamado?.id}`;
      const methodSet = !DadosChamado?.id ? "POST" : "PATCH";
      setIsLoading(true);
      const response = await fetch(url, {
        method: methodSet,
        body: JSON.stringify(dados),
      });
      const result = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(result.message);
      }

      toast({
        title: "Sucesso",
        description: "Chamado salvo com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      if (methodSet === "POST") {
        router.push(`/chamado/${result.data.id}`);
      }

      setIsLoading(false);
      router.push(`/chamado`);
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Erro",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (data) {
      if (data.titulo !== titulo) {
        setTitulo(data.titulo || "");
      }
      if (data.descricao !== descricao) {
        setDescricao(data.descricao || "");
      }
      if (data.status !== status) {
        setStatus(data.status);
      }
      if (!DadosChamado || DadosChamado.id !== data.id) {
        setDadosChamado(data);
      }
      // Converter imagens do banco de dados para o formato ManagedImage
      if (data.images && data.images.length > 0 && images.length === 0) {
        const existingImages: ManagedImage[] = data.images.map((img: any, index: number) => ({
          id: img.id?.toString() || `existing-${index}`,
          url_view: img.url_view || img.url,
          url_download: img.url_download || img.url,
          isNew: false,
          file: undefined,
        }));
        setImages(existingImages);
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [data]);

  if (IsLoading) {
    return <Loading />;
  }

  return (
    <Container
      maxW={{ base: "100%", sm: "95%", md: "96%", lg: "98%" }}
      py={{ base: 4, md: 5, lg: 6 }}
      px={{ base: 3, sm: 4, md: 5, lg: 6 }}
    >
      <VStack spacing={{ base: 5, md: 6, lg: 8 }} align="stretch" w="full">
        {/* Cabeçalho da Página */}
        <Flex
          bg="white"
          _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
          borderBottomWidth="2px"
          borderBottomColor="#00713D"
          p={{ base: 4, sm: 5, md: 6 }}
          align="center"
          justify="space-between"
          wrap="wrap"
          gap={{ base: 3, md: 4 }}
          borderRadius={{ base: "md", md: "lg", xl: "xl" }}
          borderBottomRadius={0}
          shadow={{ base: "sm", md: "md", lg: "lg" }}
          flexDir={{ base: "column", md: "row" }}
        >
          {/* Título com ícone */}
          <Flex align="center" gap={{ base: 2, md: 3 }}>
            <Box
              p={{ base: 1.5, md: 2 }}
              bg="green.50"
              _dark={{ bg: "green.900" }}
              borderRadius="md"
              display={{ base: "none", sm: "block" }}
            >
              <FiMessageSquare size={32} color="#00713D" />
            </Box>
            <Box>
              <Flex align="baseline" gap={2}>
                <Heading
                  fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                  color="#023147"
                  _dark={{ color: "gray.100" }}
                >
                  {DadosChamado?.id ? "Editar Chamado" : "Novo Chamado"}
                </Heading>
                {DadosChamado?.id && (
                  <Heading
                    fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                    color="gray.600"
                    _dark={{ color: "gray.400" }}
                  >
                    #{DadosChamado?.id}
                  </Heading>
                )}
              </Flex>
            </Box>
          </Flex>

          {/* Status (apenas para admins e quando já existe o chamado) */}
          {session?.role?.adm && DadosChamado?.status && (
            <Flex align="center" gap={2}>
              <Heading
                size={{ base: "sm", md: "md" }}
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Status:
              </Heading>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                w={{ base: "full", sm: "auto" }}
                minW="180px"
                bg="white"
                _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                borderColor="gray.300"
                _hover={{ borderColor: "#00713D" }}
                _focus={{
                  borderColor: "#00713D",
                  boxShadow: "0 0 0 1px #00713D",
                }}
              >
                <option value="ABERTO">Aberto</option>
                <option value="EM_ANDAMENTO">Em andamento</option>
                <option value="LV2">Enviado para nível 2</option>
                <option value="CONCLUIDO">Concluído</option>
              </Select>
            </Flex>
          )}
        </Flex>

        {/* Conteúdo da Página */}
        <Flex
          bg="white"
          _dark={{ bg: "gray.800" }}
          borderRadius="xl"
          borderTopRadius={0}
          shadow="lg"
          minH="400px"
          flexDir={{ base: "column", lg: "row" }}
          gap={{ base: 6, lg: 0 }}
          overflow="hidden"
        >
          {/* Formulário Principal - 70% em desktop */}
          <Box
            as="form"
            w={{ base: "100%", lg: DadosChamado?.id ? "70%" : "100%" }}
            p={{ base: 4, md: 6 }}
            borderRight={{
              base: "none",
              lg: DadosChamado?.id ? "1px solid" : "none",
            }}
            borderRightColor="gray.300"
            _dark={{ borderRightColor: "gray.600" }}
          >
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
                  Informações do Chamado
                </Heading>
              </Box>

              {/* Campos do Formulário */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {/* Motivo */}
                <FormControl isRequired>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    Motivo do Chamado
                  </FormLabel>
                  <Input
                    placeholder="Descreva o motivo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "#00713D" }}
                    _focus={{
                      borderColor: "#00713D",
                      boxShadow: "0 0 0 1px #00713D",
                    }}
                    size="lg"
                    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                  />
                </FormControl>
              </SimpleGrid>

              {/* Descrição (largura total) */}
              <FormControl isRequired>
                <FormLabel
                  fontSize="sm"
                  fontWeight="md"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  Descrição Detalhada
                </FormLabel>
                <Textarea
                  placeholder="Descreva detalhadamente o problema ou solicitação"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: "#00713D" }}
                  _focus={{
                    borderColor: "#00713D",
                    boxShadow: "0 0 0 1px #00713D",
                  }}
                  size="lg"
                  rows={6}
                  resize="vertical"
                  _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                />
              </FormControl>

              {/* Seção: Imagens e Detalhes */}
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {/* Imagens */}
                <Box>
                  <ImageComponent
                    onImagesChange={setImages}
                    images={images}
                    maxImages={5}
                  />
                </Box>

                {/* Detalhes */}
                <Box>
                  <DetalhesChamadoComponent
                    Departamento={setDepartamento}
                    Prioridade={setPrioridade}
                    DthQru={setDthQru}
                    cliente={setSolicitacaoId}
                    data={DadosChamado}
                  />
                </Box>
              </SimpleGrid>

              {/* Galeria de Imagens */}
              <ImageGallery
                images={images}
                onRemoveImage={removeImage}
                maxImages={5}
              />

              {/* Botões de Ação */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                <Button
                  variant="outline"
                  colorScheme="gray"
                  size="lg"
                  onClick={() => router.push("/chamado")}
                  isDisabled={IsLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  leftIcon={<FiSave />}
                  colorScheme="green"
                  bg="#00713D"
                  size="lg"
                  onClick={handleSave}
                  isLoading={IsLoading}
                  loadingText="Salvando..."
                  _hover={{ bg: "#005a31" }}
                  _dark={{
                    bg: "#00d672",
                    color: "gray.900",
                    _hover: { bg: "#00c060" },
                  }}
                >
                  Salvar Chamado
                </Button>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Chat e Histórico - 30% em desktop, abaixo em mobile */}
          {DadosChamado?.id && (
            <VStack
              w={{ base: "100%", lg: "30%" }}
              spacing={4}
              p={{ base: 4, md: 6 }}
              align="stretch"
              minH={{ base: "15rem", lg: "auto" }}
            >
              {/* Chat */}
              <Box flex="1" minH={{ base: "15rem", lg: "auto" }}>
                <MensagensChat
                  id={DadosChamado?.id || 0}
                  data={DadosChamado?.chat || []}
                  session={session}
                  onSend={SaveChat}
                />
              </Box>

              {/* Histórico */}
              <Box>
                <HistoricoComponent data={DadosChamado?.temp || []} />
              </Box>
            </VStack>
          )}
        </Flex>
      </VStack>
    </Container>
  );
};
