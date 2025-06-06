"use client";
import { FiltroContext } from "@/context/UserFiltroContext";
import { useState } from "react";

import { ReactNode } from "react";

interface UserProviderProps {
  children: ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
  const [nome, setNome] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [construtora, setConstrutora] = useState<number>(0);
  const [hierarquia, setHierarquia] = useState<string>("");
  const [financeira, setFinanceira] = useState<number>(-0);

  return (
    <FiltroContext.Provider
      value={{
        nome,
        setNome,
        id,
        setId,
        construtora,
        setConstrutora,
        hierarquia,
        setHierarquia,
        financeira,
        setFinanceira,
      }}
    >
      {children}
    </FiltroContext.Provider>
  );
}
