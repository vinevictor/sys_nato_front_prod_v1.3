"use client";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { BsFillPencilFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

interface BtnEditarUserProps {
  id: number;
}

export function BtnEditarUser({ id }: BtnEditarUserProps) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/usuarios/${id}`);
  };

  return (
    <Tooltip label="Editar usuário">
      <IconButton
        colorScheme="blue"
        variant="outline"
        icon={<BsFillPencilFill />}
        aria-label="Edit"
        onClick={handleRedirect}
      />
    </Tooltip>
  );
}
