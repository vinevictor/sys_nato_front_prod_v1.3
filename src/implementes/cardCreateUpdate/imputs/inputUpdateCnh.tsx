"use client";

import { Box, Input, InputProps, useToast } from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, createContext, useState } from "react";

// Crie um contexto para compartilhar dados entre componentes
export const DataContext = createContext({
  Data: "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setData: (value: string) => { }
});

interface InputUpdateCnhProps extends InputProps {
  Url?: string;
  tag?: string;
}

export default function InputUpdateCnh({
  Url,
  tag,
  ...props
}: InputUpdateCnhProps) {
  const [Data, setData] = useState<string>("");
  const toast = useToast();
  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement | any>
  ) => {
    const file = event.target.files[0];
    if (
      file.type === "application/pdf" ||
      file.type === "image/jpeg" ||
      file.type === "image/webp"
    ) {
      const formData = new FormData();
      formData.append("file", file);
      await axios
        .post(`/api/doc/post`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then((response) => {
          console.log("🚀 ~ .then ~ response:", response.data.data);
          setData(response.data.data.url);
          if (response.status === 200) {
            toast({
              title: "Arquivo salvo",
              description: response.data.message,
              status: "success",
              duration: 3000,
              isClosable: true
            });
          }
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Erro ao salvar arquivo",
            status: "error",
            duration: 3000,
            isClosable: true
          });
        });
    }
  };
  return (
    <>
      <DataContext.Provider value={{ Data, setData }}>
        <Input
          {...props}
          type="file"
          variant="flushed"
          accept=".jpg, .png, .pdf"
          onChange={handleFileChange}
        />
        <Box hidden>
          <Input
            value={Data || Url || ""}
            name={`update_${tag}`}
            readOnly
          />
        </Box>
      </DataContext.Provider>
    </>
  );
}
