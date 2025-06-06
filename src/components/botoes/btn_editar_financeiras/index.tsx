"use client";

import { IconButton, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BsFillPencilFill } from "react-icons/bs";

interface BtnEditarFinanceiraProps {
  id: number;
}

export function BtnEditarFinanceira({ id }: BtnEditarFinanceiraProps) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/financeiras/${id}`);
  };
  return (
    <Tooltip label="Editar Financeira">
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
