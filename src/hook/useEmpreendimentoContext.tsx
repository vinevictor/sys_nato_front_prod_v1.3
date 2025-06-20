
import { EmpreendimentoContext } from "@/context/EmpreendimentoContext";
import { useContext } from "react";

export const dynamic = "force-dynamic";

export default function useEmpreendimentoContext() {
  const context = useContext(EmpreendimentoContext);

  if (context === undefined) {
    throw new Error("Não esta dentro do contexto");
  }

  return context;
}
