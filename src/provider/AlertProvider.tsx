'use client'
import { AlertContext } from "@/context/AlertContext";
import { useState } from "react";

interface AlertProps {
    children: React.ReactNode
}

export default function AlertProvider({ children }: AlertProps) {
    const [Alert, setAlert] = useState<boolean>(false);
    return (
        <AlertContext.Provider value={{ Alert, setAlert }}>{children}</AlertContext.Provider>
    );
}