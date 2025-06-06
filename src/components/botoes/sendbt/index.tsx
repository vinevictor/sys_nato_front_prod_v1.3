"use client";

import React, { useState } from "react";
import { Button, ButtonProps, useToast } from "@chakra-ui/react";

interface PatchButtonProps extends Omit<ButtonProps, "onClick" | "id"> {
  id: number;
  body: Record<string, any>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function PatchButton({
  id,
  body,
  onSuccess,
  onError,
  children = "Salvar",
  ...buttonProps
}: PatchButtonProps) {
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/direto/patch/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const dataText = await res.text();
      let data: any;
      try {
        data = JSON.parse(dataText);
      } catch {
        data = dataText;
      }

      if (!res.ok) {
        throw { status: res.status, body: data };
      }

      toast({
        title: "Sucesso",
        description: "Atualizado com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.(data);
    } catch (error: any) {
      console.error("Erro PATCH:", error);
      toast({
        title: "Erro",
        description: error?.body?.message || "Falha ao atualizar dados.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      isLoading={isLoading}
      loadingText="Enviando..."
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
