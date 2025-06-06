/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { FinanceiraContext } from "@/context/FinanceiraContext";
import { Input, InputProps } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

export interface InputEmailProps extends InputProps {
  setValueEmail?: string;
}

export default function InputEmailRazaoSocial({ setValueEmail, ...props }: InputEmailProps) {
const { data} = useContext(FinanceiraContext);
const [emailLocal, setEmailLocal] = useState<string>("");

  useEffect(() => {
    if(data){
      setEmailLocal(data.email);
    }
    if(!setValueEmail) return;
    const isValidEmail = validateEmail(setValueEmail);
    if (isValidEmail) {
      setEmailLocal(setValueEmail);
    }
  }, [data, setValueEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setEmailLocal(valor);
    props.onChange && props.onChange(e); // Mantém o evento original se passado
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
  <>
  <Input {...props} value={emailLocal} type="email" onChange={handleChange} />
  </>
  );
}

