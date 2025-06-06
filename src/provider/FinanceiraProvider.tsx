"use client";

import { FinanceiraContext } from "@/context/FinanceiraContext";
import { useState } from "react";

interface FinanceiraProviderProps {
  children: React.ReactNode;
}

export default function FinanceiraProvider({
  children,
}: FinanceiraProviderProps) {
  const [cnpj, setCnpj] = useState<string>("");
  const [razaosocial, setRazaosocial] = useState<string>("");
  const [tel, setTelefone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [responsavel, setResponsavel] = useState<string | null>(null);
  const [fantasia, setFantasia] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [ConstrutoraCX, setConstrutoraCX] = useState<number[]>([]);
  

  return (
    <FinanceiraContext.Provider
      value={{
        cnpj,
        setCnpj,
        razaosocial,
        setRazaosocial,
        tel,
        setTelefone,
        email,
        setEmail,
        responsavel,
        setResponsavel,
        fantasia,
        setFantasia,
        data,
        setData,
        ConstrutoraCX,
        setConstrutoraCX,
      }}
    >
      {children}
    </FinanceiraContext.Provider>
  );
}
