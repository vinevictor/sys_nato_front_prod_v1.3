import { FinanceiraContext } from "@/context/FinanceiraContext";
import { useContext } from "react";

export default function useUserCompraContext() {
  const context = useContext(FinanceiraContext);

  if (context === undefined) {
    throw new Error("Não esta dentro do contexto");
  }

  return context;
}
