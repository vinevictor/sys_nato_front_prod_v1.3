
import { FiltroContext } from "@/context/UserFiltroContext";
import { useContext } from "react";

export const dynamic = "force-dynamic";

export default function UserFiltroContext() {
  const context = useContext(FiltroContext);

  if (context === undefined) {
    throw new Error("Não esta dentro do contexto");
  }

  return context;
}
