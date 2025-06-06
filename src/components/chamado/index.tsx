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
} from "@chakra-ui/react";
import HistoricoComponent from "../historico";
import MensagensChat from "../mensagensChat";
import { ImageComponent, ExistingImageInput } from "./image";
import { useCallback, useEffect, useState } from "react";
import { DetalhesChamadoComponent } from "./detalhes";
import { useRouter } from "next/navigation";

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
      let formattedDthQru = DadosChamado?.dth_qru || null;
      if (dth_qru) {
        try {
          formattedDthQru = new Date(dth_qru).toISOString();
        } catch (error) {
          console.error('Data inválida:', error);
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
        images: finalImages,
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
      const response = await fetch(url, {
        method: methodSet,
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
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

  return (
    <>
      <Flex
        w="full"
        h={{ base: "auto", lg: "full" }}
        bg="gray.500"
        p={4}
        gap={4}
        flexDir={{ base: "column", lg: "row" }}
      >
        <Box
          display={"flex"}
          flexDir={"column"}
          w={{ base: "full", lg: "70%" }}
          h={{ base: "auto", lg: "full" }}
          bg="white"
          borderRadius="1rem"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
          p={4}
          gap={4}
          justifyContent={"space-between"}
        >
          <Flex w="full" justifyContent="space-between" alignItems="center">
            <Flex gap={3} pl={8} alignItems="end" justifyContent="flex-start">
              <Heading>Chamado</Heading>
              {DadosChamado?.id && (
                <Heading size="lg">Id: {DadosChamado?.id}</Heading>
              )}
            </Flex>
            <Flex gap={2} pe={10}>
              {session?.role?.adm ? (
                <>
                  {DadosChamado?.status && (
                    <Flex gap={2} alignItems="center">
                      <Heading size="lg">Status</Heading>
                      <Select
                        value={status}
                        name="status"
                        size="sm"
                        onChange={(e) => setStatus(e.target.value)}
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
                    <Heading size="lg">Status: {DadosChamado?.status}</Heading>
                  )}
                </>
              )}
            </Flex>
          </Flex>
          <Divider border={"1px solid"} borderColor="gray.300" my={2} />

          <Flex
            w="full"
            alignItems="center"
            justifyContent="flex-start"
            gap={2}
            flexDir={"column"}
          >
            <Flex w={"90%"} gap={2} flexDir="column">
              <FormLabel>Motivo do chamado</FormLabel>
              <Input
                placeholder="Descreva o motivo do chamado"
                w="full"
                borderRadius="1rem"
                border="1px solid"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.300" }}
                _focus={{ borderColor: "blue.500" }}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </Flex>
            <Flex w={"90%"} h={"15rem"} gap={2} flexDir="column">
              <FormLabel>Descrição do chamado</FormLabel>
              <Textarea
                placeholder="Descrição"
                w="full"
                h="full"
                resize="none"
                borderRadius="1rem"
                border="1px solid"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.300" }}
                _focus={{ borderColor: "blue.500" }}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </Flex>
            <Flex w={"90%"} h={"25rem"} gap={8}>
              {!DadosChamado?.id && (
                <ImageComponent
                  onChange={setImages}
                  DataImages={imagesView}
                  onRemoveExistingImage={handleRemoveExistingImage}
                />
              )}
              {DadosChamado?.id && (
                <>
                  <ImageComponent
                    onChange={handleSetImage}
                    maxImages={5}
                    DataImages={
                      DadosChamado?.images.length > 0
                        ? DadosChamado?.images
                        : []
                    }
                  />
                </>
              )}
              <DetalhesChamadoComponent
                Departamento={setDepartamento}
                Prioridade={setPrioridade}
                DthQru={setDthQru}
                cliente={setSolicitacaoId}
                data={DadosChamado}
              />
            </Flex>
          </Flex>
          <Flex w="full" justifyContent={"flex-end"}>
            <Button colorScheme="green" onClick={handleSave}>
              Salvar
            </Button>
          </Flex>
        </Box>

        <Flex
          w={{ base: "full", lg: "30%" }}
          h={{ base: "auto", lg: "full" }}
          flexDir="column"
          gap={4}
        >
          <Box h={"65%"} w={"full"}>
            <MensagensChat
              id={DadosChamado?.id || 0}
              data={DadosChamado?.chat || []}
              session={session}
              onSend={SaveChat}
            />
          </Box>

          <Box h={"35%"} w={"full"}>
            <HistoricoComponent data={DadosChamado?.temp || []} />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
