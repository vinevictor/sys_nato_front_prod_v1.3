"use client";

import { EmpreendimentoContext } from "@/context/EmpreendimentoContext";
import { useState } from "react";

interface EmpreendimnetoProviderProps {
  children: React.ReactNode;
}

export default function EmpreendimentoProvider({
  children,
}: EmpreendimnetoProviderProps) {
  const [construtoraTag, setConstrutoraTag] = useState<string>("");
  const [FinanceiraCX, setFinanceiraCX] = useState<number[]>([]);

  return (
    <EmpreendimentoContext.Provider value={{
        construtoraTag,
        setConstrutoraTag,
        FinanceiraCX,
        setFinanceiraCX,
    }}>
      {children}
    </EmpreendimentoContext.Provider>
  );
}
