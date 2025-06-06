"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

interface InputFileUploadProps {
  label: string;
  id: string;
  onvalue: (url: string) => void;
  value?: any;
  required?: boolean;
  isDisabled?: boolean;
  boxWidth?: string;
}

export default function InputFileUpload({
  label,
  id,
  onvalue,
  value,
  required = false,
  isDisabled = false,
  boxWidth = "100%",
}: InputFileUploadProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("Nenhum arquivo escolhido");
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const isImage = (url: string) => url?.match(/\.(jpeg|jpg|png)$/i) !== null;

  useEffect(() => {
    if (value?.url_view) {
      const parts = value.url_view.split("/");
      setFileName(parts[parts.length - 1]);
    }
  }, [value]);

  const handleFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", id);

    try {
      const response = await fetch(`/api/doc/post`, {
        method: "POST",
        body: formData,
      });

      const fileUrl = await response.json();
      onvalue(fileUrl.data);

      setFileName(file.name);

      toast({
        title: "Arquivo salvo",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar arquivo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <FormControl
      id={id}
      isRequired={required}
      isDisabled={isDisabled}
      w={boxWidth}
    >
      <FormLabel fontSize="sm">{label}</FormLabel>

      <Box
        border="2px dashed"
        borderColor={isDragging ? "blue.400" : "gray.300"}
        p={4}
        rounded="md"
        textAlign="center"
        bg={isDragging ? "gray.50" : "white"}
        cursor="pointer"
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          ref={inputRef}
          accept=".jpg, .jpeg, .png, .pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <Text fontSize="sm" color="gray.600">
          {isDragging
            ? "Solte o arquivo aqui..."
            : "Arraste um arquivo aqui ou clique para selecionar"}
        </Text>
        <Text mt={1} fontSize="xs" color="gray.500">
          (Formatos permitidos: .jpg, .jpeg, .png, .pdf)
        </Text>

        {fileName && fileName !== "Nenhum arquivo escolhido" && (
          <Text mt={2} fontSize="sm" color="gray.700">
            Arquivo selecionado: <strong>{fileName}</strong>
          </Text>
        )}
      </Box>

      {value?.url_view && isImage(value.url_view) && (
        <Box mt={3}>
          <Image
            src={value.url_view}
            alt="Pré-visualização"
            maxH="150px"
            borderRadius="md"
            objectFit="contain"
          />
        </Box>
      )}

      {value?.url_download && (
        <Button
          mt={3}
          size="sm"
          leftIcon={<DownloadIcon />}
          colorScheme="blue"
          as="a"
          href={value.url_download}
          target="_blank"
          download
        >
          Baixar arquivo
        </Button>
      )}
    </FormControl>
  );
}
