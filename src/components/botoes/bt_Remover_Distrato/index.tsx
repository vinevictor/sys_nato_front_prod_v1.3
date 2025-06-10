"use client";
import { Button, useToast } from "@chakra-ui/react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

interface BtRemoverDistratoProps {
  id: number | null;
}
export default function BtRemoverDistrato({
  id,
}: BtRemoverDistratoProps) {
  const [Loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const route = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/solicitacao/novo-acordo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast({
          title: "Distrato Efetuado",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // window.location.reload();
        route.refresh();
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: JSON.stringify(error),
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      setLoading(false);
    }
  };

  return (
    <Button
      size={"sm"}
      bg="gray.600"
      color="white"
      _hover={{ bg: "gray.700" }}
      _active={{ bg: "gray.700" }}
      _focus={{ bg: "gray.700" }}
      px={8}
      variant="solid"
      onClick={handleClick}
      isLoading={Loading}
      spinner={<BeatLoader size={8} color="white" />}
    >
      Novo Acordo
    </Button>
  );
}
