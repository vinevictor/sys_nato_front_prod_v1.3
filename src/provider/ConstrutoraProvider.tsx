'use client'

import { ConstrutoraContext } from "@/context/ConstrutoraContex";
import { useState } from "react";

interface ContrutoraProviderProps {
  children: React.ReactNode;
}

export default function ContrutoraProvider({
    children,
}: ContrutoraProviderProps) {
    const [data, setData] = useState<any>(null);

    return(
        <ConstrutoraContext.Provider
        value={{
            data,
            setData,
        }}
        >
            {children}
        </ConstrutoraContext.Provider>
    )
}

