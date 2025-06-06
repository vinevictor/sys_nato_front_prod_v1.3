import { AlertContext } from "@/context/AlertContext";
import { useContext } from "react";

export default function useAlertContext() {
  const context = useContext(AlertContext);

  if (context === undefined) {
    throw new Error("Não esta dentro do contexto");
  }

  return context;
}
