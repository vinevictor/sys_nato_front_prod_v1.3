"use client";
import { Button, Icon, useToast } from "@chakra-ui/react";
import { AiOutlineWarning } from "react-icons/ai";

interface BtnLimparFcwProps {
    id: number;
}

export default function BtnLimparFcw({ id }: BtnLimparFcwProps) {
  const toast = useToast();
  const handleClick = async () => {
    try {
      const req = await fetch(`/api/solicitacao/update/data/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          id_fcw: 0,
          andamento: null,
        }),
      });
      const res = await req.json();
      if (!req.ok) {
        throw new Error(res.message);
      }
      toast({
        title: "Sucesso",
        description: "FCW limpo com sucesso",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      const mesage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro",
        description: mesage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
    return (
        <Button
            leftIcon={<Icon as={AiOutlineWarning} />}
            colorScheme="red"
            variant="outline"
            onClick={handleClick}
            w={{ base: "full", md: "auto" }}
            size={{ base: "md", md: "sm" }}
        >
            Limpar FCW
        </Button>
    );
}