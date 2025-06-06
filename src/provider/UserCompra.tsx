"use client";
import { UserCompraContext } from "@/context/UserCompraContext";
import { useState } from "react";

interface UserCompraProps {
  children: React.ReactNode;
}

export default function UserCompraProvider({ children }: UserCompraProps) {
  const [ContrutoraCX, setContrutoraCX] = useState<number>(0);
  const [CorretorCx, setCorretorCx] = useState<number>(0);
  const [FinanceiraCX, setFinanceiraCX] = useState<number>(0);
  const [EmpreedimentoCX, setEmpreedimentoCX] = useState<number>(0);
  const [ServiceTags, setServiceTags] = useState<any>([]);

  return (
    <UserCompraContext.Provider
      value={{
        ContrutoraCX,
        setContrutoraCX,
        CorretorCx,
        setCorretorCx,
        FinanceiraCX,
        setFinanceiraCX,
        EmpreedimentoCX,
        setEmpreedimentoCX,
        ServiceTags,
        setServiceTags,
      }}
    >
      {children}
    </UserCompraContext.Provider>
  );
}
