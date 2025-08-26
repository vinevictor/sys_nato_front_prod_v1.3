"use client";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  useToast,
  Stack,
  VStack,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import HistoricoComponent from "../historico";
import MensagensChat from "../mensagensChat";
import { ImageComponent, ExistingImageInput } from "./image";
import { useCallback, useEffect, useState } from "react";
import { DetalhesChamadoComponent } from "./detalhes";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

interface ChamadoProps {
  data: TypeChamado | null;
  session: SessionNext.Client;
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
  const [imagesView, setImagesView] = useState<ExistingImageInput[]>([]);
  const [departamento, setDepartamento] = useState<string>("");
  const [prioridade, setPrioridade] = useState<string>("");
  const [dth_qru, setDthQru] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [status, setStatus] = useState<string>("ABERTO");
  const [solicitacaoId, setSolicitacaoId] = useState<number>(0);
  const [DadosChamado, setDadosChamado] = useState<TypeChamado | null>(null);
  const [titulo, setTitulo] = useState<string>("");
  const toast = useToast();
  const router = useRouter();
  const flexDirection = useBreakpointValue({ base: "column", lg: "row" }) as
    | "column"
    | "row";
  const mainWidth = useBreakpointValue({ base: "full", lg: "70%" });
  const sidebarWidth = useBreakpointValue({ base: "full", lg: "30%" });
  const formWidth = useBreakpointValue({ base: "full", sm: "95%", md: "90%" });
  const headerPadding = useBreakpointValue({ base: 2, md: 4, lg: 8 });
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveExistingImage = useCallback(
    (imageId: string, imageUrl: string) => {
      console.log(
        `Imagem existente removida: ID - ${imageId}, URL - ${imageUrl}`
      );
      setImagesView((prevImages) =>
        prevImages.filter((img) => img.url_view !== imageUrl)
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
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || error || "Erro ao salvar mensagem",
        status: "error",
        duration: 3000,
        isClosable: true,
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
    try {
      const finalImages = await SaveImage();
      let formattedDthQru = DadosChamado?.dth_qru || new Date().toISOString();
      if (dth_qru) {
        try {
          formattedDthQru = new Date(dth_qru).toISOString();
        } catch (error) {
          console.error("Data inválida:", error);
        }
      }

      const data = {
        titulo,
        departamento,
        prioridade,
        dth_qru: formattedDthQru,
        descricao,
        status,
        solicitacaoId,
        idUser: session.id,
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
        body: JSON.stringify(data),
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
      });

      if (methodSet === "POST") {
        router.push(`/chamado/${result.data.id}`);
      }

      setIsLoading(false);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSetImage = (images: ManagedImage[]) => {
    setImages(images);
  };

  useEffect(() => {
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
      if (
        data.images &&
        (imagesView.length === 0 ||
          JSON.stringify(imagesView) !== JSON.stringify(data.images))
      ) {
        setImagesView(data.images);
      }
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Flex
      w="full"
      minH={{ base: "100vh", lg: "full" }}
      bg="gray.500"
      p={{ base: 2, md: 4 }}
      gap={{ base: 2, md: 4 }}
      flexDir={flexDirection}
    >
      <Box
        display="flex"
        flexDir="column"
        w={mainWidth}
        minH={{ base: "auto", lg: "full" }}
        bg="white"
        borderRadius="1rem"
        boxShadow="md"
        border="1px solid"
        borderColor="gray.200"
        p={{ base: 2, md: 4 }}
        gap={{ base: 2, md: 4 }}
        justifyContent="space-between"
      >
        <Flex
          w="full"
          justifyContent="space-between"
          alignItems={{ base: "flex-start", md: "center" }}
          flexDir={{ base: "column", md: "row" }}
          gap={{ base: 2, md: 0 }}
        >
          <Flex
            gap={{ base: 2, md: 3 }}
            pl={{ base: 0, md: headerPadding }}
            alignItems={{ base: "flex-start", md: "end" }}
            justifyContent="flex-start"
            flexDir={{ base: "column", sm: "row" }}
          >
            <Heading size={{ base: "md", md: "lg" }}>Chamado</Heading>
            {DadosChamado?.id && (
              <Heading size={{ base: "sm", md: "md" }}>
                Id: {DadosChamado?.id}
              </Heading>
            )}
          </Flex>

          <Flex
            gap={2}
            pe={{ base: 0, md: 10 }}
            w={{ base: "full", md: "auto" }}
            justifyContent={{ base: "flex-start", md: "flex-end" }}
          >
            {session?.role?.adm ? (
              <>
                {DadosChamado?.status && (
                  <Flex
                    gap={2}
                    alignItems={{ base: "flex-start", md: "center" }}
                    flexDir={{ base: "column", sm: "row" }}
                    w={{ base: "full", sm: "auto" }}
                  >
                    <Heading size={{ base: "sm", md: "md" }}>Status</Heading>
                    <Select
                      value={status}
                      name="status"
                      size="sm"
                      onChange={(e) => setStatus(e.target.value)}
                      w={{ base: "full", sm: "auto" }}
                      minW={{ sm: "150px" }}
                    >
                      <option value="ABERTO">Aberto</option>
                      <option value="EM_ANDAMENTO">Em andamento</option>
                      <option value="LV2">Enviado para nível 2</option>
                      <option value="CONCLUIDO">Concluído</option>
                    </Select>
                  </Flex>
                )}
              </>
            ) : (
              <>
                {DadosChamado?.status && (
                  <Heading size={{ base: "sm", md: "md" }}>
                    Status: {DadosChamado?.status}
                  </Heading>
                )}
              </>
            )}
          </Flex>
        </Flex>

        <Divider border="1px solid" borderColor="gray.300" my={2} />

        {/* Formulário */}
        <VStack w="full" spacing={{ base: 3, md: 4 }} align="stretch">
          <VStack w={formWidth} mx="auto" spacing={2} align="stretch">
            <FormLabel mb={1}>Motivo do chamado</FormLabel>
            <Input
              placeholder="Descreva o motivo do chamado"
              borderRadius="1rem"
              border="1px solid"
              borderColor="gray.300"
              _hover={{ borderColor: "gray.300" }}
              _focus={{ borderColor: "blue.500" }}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              size={{ base: "sm", md: "md" }}
            />
          </VStack>

          <VStack w={formWidth} mx="auto" spacing={2} align="stretch">
            <FormLabel mb={1}>Descrição do chamado</FormLabel>
            <Textarea
              placeholder="Descrição"
              h={{ base: "120px", md: "150px", lg: "200px" }}
              resize="none"
              borderRadius="1rem"
              border="1px solid"
              borderColor="gray.300"
              _hover={{ borderColor: "gray.300" }}
              _focus={{ borderColor: "blue.500" }}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              size={{ base: "sm", md: "md" }}
            />
          </VStack>

          {/* Seção de Imagens e Detalhes */}
          <Stack
            w={formWidth}
            mx="auto"
            spacing={{ base: 4, md: 6 }}
            direction={{ base: "column", lg: "row" }}
            align="stretch"
          >
            <Box flex="1" minH={{ base: "200px", md: "300px" }}>
              {!DadosChamado?.id && (
                <ImageComponent
                  onChange={setImages}
                  DataImages={imagesView}
                  onRemoveExistingImage={handleRemoveExistingImage}
                />
              )}
              {DadosChamado?.id && (
                <ImageComponent
                  onChange={handleSetImage}
                  maxImages={5}
                  DataImages={
                    DadosChamado?.images.length > 0 ? DadosChamado?.images : []
                  }
                />
              )}
            </Box>

            <Box flex="1" minH={{ base: "200px", md: "300px" }}>
              <DetalhesChamadoComponent
                Departamento={setDepartamento}
                Prioridade={setPrioridade}
                DthQru={setDthQru}
                cliente={setSolicitacaoId}
                data={DadosChamado}
              />
            </Box>
          </Stack>
        </VStack>

        <Flex
          w="full"
          justifyContent={{ base: "center", md: "flex-end" }}
          pt={{ base: 2, md: 4 }}
          gap={4}
        >
          <Button
            colorScheme="red"
            variant="outline"
            _hover={{ bg: "red.300", color: "white", borderColor: "white" }}
            onClick={() => router.push("/chamado")}
            size={{ base: "md", md: "lg" }}
            w={{ base: "full", sm: "auto" }}
            maxW={{ base: "300px", sm: "none" }}
          >
            Cancelar
          </Button>

          <Button
            colorScheme="green"
            onClick={handleSave}
            size={{ base: "md", md: "lg" }}
            w={{ base: "full", sm: "auto" }}
            maxW={{ base: "300px", sm: "none" }}
          >
            Salvar
          </Button>
        </Flex>
      </Box>

      <Flex
        w={sidebarWidth}
        minH={{ base: "600px", lg: "full" }}
        flexDir="column"
        gap={{ base: 2, md: 4 }}
      >
        <Box
          h={{ base: "350px", md: "400px", lg: "65%" }}
          w="full"
          minH="300px"
        >
          <MensagensChat
            id={DadosChamado?.id || 0}
            data={DadosChamado?.chat || []}
            session={session}
            onSend={SaveChat}
          />
        </Box>

        <Box
          h={{ base: "250px", md: "300px", lg: "35%" }}
          w="full"
          minH="200px"
        >
          <HistoricoComponent data={DadosChamado?.temp || []} />
        </Box>
      </Flex>
    </Flex>
  );
};
