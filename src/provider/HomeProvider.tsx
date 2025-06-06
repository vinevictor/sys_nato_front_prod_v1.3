"use client"

import { HomeContext } from "@/context/HomeContex";
import { useState } from "react";

interface HomeProviderProps {
  children: React.ReactNode;
}
export default function HomeProvider({ children }: HomeProviderProps) {
  const [data, setData] = useState<solictacao.SolicitacaoObjectType[]>([]);

  return (
    <HomeContext.Provider value={{ data, setData }}>
      {children}
    </HomeContext.Provider>
  );
}