import { FinanceiraContext } from "@/context/FinanceiraContext";
import { useContext } from "react";

export const dynamic = "force-dynamic";

export default function useUserCompraContext() {
  const context = useContext(FinanceiraContext);

  if (context === undefined) {
    throw new Error("Não esta dentro do contexto");
  }

  return context;
}
