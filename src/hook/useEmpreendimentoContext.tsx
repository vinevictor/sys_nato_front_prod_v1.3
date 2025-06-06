
import { EmpreendimentoContext } from "@/context/EmpreendimentoContext";
import { useContext } from "react";

export default function useEmpreendimentoContext() {
  const context = useContext(EmpreendimentoContext);

  if (context === undefined) {
    throw new Error("Não esta dentro do contexto");
  }

  return context;
}
