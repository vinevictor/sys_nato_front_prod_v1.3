"use client";

import { IconButton, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BsFillPencilFill } from "react-icons/bs";

interface BtnEditarConstrutoraProps {
  id: number;
}

export function BtnEditarConstrutora({ id }: BtnEditarConstrutoraProps) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/construtoras/${id}`);
  };
  return (
    <Tooltip label="Editar Construtora">
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
