"use client";

import { Button, ButtonProps } from "@chakra-ui/react";
import { useRouter } from "next/navigation";


// Agora BotaoCancelar aceita todas as props do Chakra Button normalmente
// Clean Code: Filtra a prop 's' para evitar erro de atributo não-booleano no DOM
export default function BotaoCancelar(props: ButtonProps) {
  // Remove a prop 's' caso seja passada por engano
  // Isso evita warnings de React e problemas de hidratação
  const { ...rest } = props;
  const router = useRouter();

  return (
    <Button
      {...props}
    >
      Cancelar
    </Button>
  );
}
