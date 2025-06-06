/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Button,
  Flex,
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
  Text,
  useDisclosure,
  useToast,
  Box,
  Input,
  Tooltip,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "@/hook/useSession";
import React, { useEffect, useState } from "react";

interface CreateChamadoProps {
  id: number;
}

export default function CreateChamado({ id }: CreateChamadoProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [descricao, setDescricao] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const session = useSession();
  const toast = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [fileName, setFileName] = useState<string[]>([]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    setUser(session);
  }, [session]);
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFiles = (uploadedFiles: FileList) => {
    const filesArray = Array.from(uploadedFiles);

    const newImagePreviews = filesArray
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => URL.createObjectURL(file));

    setFiles((prevFiles) => [...prevFiles, ...filesArray]);
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
  };

  const handleClick = () => {
    document.getElementById("file-input")?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      handleFiles(uploadedFiles);
    }
  };

  const handleRemove = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const name = fileName[index];
    const newFilesNames = fileName.filter((_, i) => i !== index);
    setFileName(newFilesNames);
    const newFiles = files.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setImagePreviews(newImagePreviews);
  };

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Handle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const userId = user?.id;
    if (!userId) {
      toast({
        title: "Erro",
        description: "Erro ao criar chamado, Faça o Login Novamente!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("solicitacao", String(id));
    formData.append("descricao", descricao);
    formData.append("status", "0");

    try {
      const response = await fetch("/api/chamado/post", {
        method: "POST",
        body: formData,
      });

      const retorno = await response.json();

      if (!response.ok) {
        toast({
          title: "Erro",
          description: retorno.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setDescricao("");
        setFileName([]);
        setFiles([]);
        setImagePreviews([]);
        onClose();

        toast({
          title: "Sucesso",
          description: "Chamado criado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setDescricao("");
    setImagePreviews([]);
    setFileName([]);
    onClose();
  };

  return (
    <>
      <Tooltip
        label="Botão para solicitar suporte,solicitação ou alterações referente a este cliente."
        bg={"orange.700"}
      >
        <Button
          size={"sm"}
          colorScheme="orange"
          color={"white"}
          cursor={"pointer"}
          onClick={() => {
            onOpen();
          }}
          textColor={"black"}
        >
          CRIAR CHAMADO
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} size={"xl"} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Abrir Chamado</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir={"column"} gap={5}>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  w={"100%"}
                  h={"10rem"}
                  placeholder="Descreva o problema que deseja resolver."
                  resize={"none"}
                  ps={3}
                  bg={"gray.100"}
                  boxShadow="lg"
                  onChange={(e) => setDescricao(e.target.value)}
                  value={descricao}
                />
              </FormControl>

              <Text fontSize={"1rem"}>Anexar Arquivo</Text>
              <Box textAlign="center">
                <Box
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleClick}
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={5}
                  cursor="pointer"
                  _hover={{ borderColor: "gray.500" }}
                >
                  <Input
                    id="file-input"
                    type="file"
                    multiple
                    onChange={handleChange}
                    display="none"
                  />
                  <Text fontSize={useBreakpointValue({ base: "lg", md: "xl" })}>
                    Arraste arquivos aqui ou clique para selecionar
                  </Text>
                </Box>

                <Box
                  display="flex"
                  flexWrap="wrap"
                  justifyContent="center"
                  mt={4}
                >
                  {imagePreviews.map((preview, index) => (
                    <Box key={index} position="relative" mr={2} mb={2}>
                      <Tooltip label="Excluir" placement="top" hasArrow>
                        <Button
                          size="xs"
                          colorScheme="red"
                          onClick={(event) => handleRemove(index, event)}
                          position="absolute"
                          top={1}
                          right={1}
                          zIndex={1}
                        >
                          x
                        </Button>
                      </Tooltip>
                      <Image
                        src={preview}
                        alt={`Preview ${index}`}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                        transition="transform 0.2s"
                        _hover={{ transform: "scale(1.2)" }}
                        onClick={() => handleDownload(preview)}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button colorScheme="green" onClick={Handle}>
              Confirmar
            </Button>

            <Button colorScheme="red" onClick={handleModalClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
