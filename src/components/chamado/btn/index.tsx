"use client";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { MdChatBubble } from "react-icons/md";
interface BtnChamadoProps {
  name: string;
  id: number;
  type?: "edit" | "delete";
}

export default function BtnChamado({ name, id, type }: BtnChamadoProps) {
  const router = useRouter();
  const handleIniciarAtendimento = async () => {
    if (type === "edit") {
      router.push(`/chamado/${id}`);
    } else {
      try {
        const response = await fetch(`/api/chamado/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.error("Erro ao enviar resposta:", response.status);
        }
        window.location.reload();
      } catch (error) {
        console.error("Erro ao enviar resposta:", error);
      }
    }
  };

  const CssInject =
    type === "edit"
      ? { colorScheme: "blue", variant: "outline" }
      : { colorScheme: "red", variant: "solid" };
  return (
    <Button {...CssInject} size="lg" onClick={handleIniciarAtendimento}>
      {type === "edit" ? <MdChatBubble /> : null}{name}
    </Button>
  );
}
