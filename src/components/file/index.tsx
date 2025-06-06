"use client";

import { Box, Input, useToast } from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent } from "react";

interface VerificadorFileProps {
  onFileUploaded: (result: any) => void;
}


export default function VerificadorFileComponent({
  onFileUploaded,
}: VerificadorFileProps) {
  const toast = useToast();


  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement | any>
  ) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await axios
        .post(`/api/doc/post`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data.data.url);
          onFileUploaded(response.data.data.url);
          toast({
            title: "Arquivo salvo",
            description: response.data.message,
            status: "success",
            duration: 3000,
            isClosable: true,
          })
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Erro ao salvar arquivo",
            status: "error",
            duration: 3000,
            isClosable: true,
          })
        });
    }
  };

  return (
    <Box>
      <Input
        type="file"
        variant="flushed"
        accept=".jpg, .png, .pdf"
        onChange={handleFileChange}
        readOnly
      />
    </Box>
  );
}
