import { ConstrutoraContext } from "@/context/ConstrutoraContex";
import { useContext } from "react";

export const dynamic = "force-dynamic";

export default function useConstrutoraCOntex() {
    const context = useContext(ConstrutoraContext);

    if (context === undefined) {
        throw new Error("Não esta dentro do contexto");
    }

    return context;
}