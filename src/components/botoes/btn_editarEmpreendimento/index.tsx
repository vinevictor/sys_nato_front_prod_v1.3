"use client";

import { IconButton, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BsFillPencilFill } from "react-icons/bs";

interface BtnEditarEmpreendimentoProps {
  id: number;
}

export function BtnEditarEmpreendimento({ id }: BtnEditarEmpreendimentoProps) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/empreendimentos/${id}`);
  };
  return (
    <Tooltip label="Editar Empreendimento">
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
