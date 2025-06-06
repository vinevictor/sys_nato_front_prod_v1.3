import { UserCompraContext } from "@/context/UserCompraContext";
import { useContext } from "react";

export default function useUserCompraContext() {
  const context = useContext(UserCompraContext);

  if (context === undefined) {
    throw new Error("Não esta dentro do contexto");
  }

  return context;
}
