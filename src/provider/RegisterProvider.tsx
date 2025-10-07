"use client";

import { RegisterContext } from "@/context/RegisterContex";
import { useState } from "react";

interface RegisterProviderProps {
  children: React.ReactNode;
}
export default function RegisterProvider({ children }: RegisterProviderProps) {
  const [Gov, setGov] = useState<boolean>(false);

  return (
    <RegisterContext.Provider value={{ Gov, setGov }}>
      {children}
    </RegisterContext.Provider>
  );
}