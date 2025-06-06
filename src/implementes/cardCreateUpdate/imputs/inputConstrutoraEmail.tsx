"use client";

import { ConstrutoraContext } from "@/context/ConstrutoraContex";
import { Input, InputProps } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

export interface InputConstrutoraEmailProps extends InputProps {
  setValueEmail?: string;
}

export default function InputConstrutoraEmail({ setValueEmail, ...props }: InputConstrutoraEmailProps) {
const { data} = useContext(ConstrutoraContext);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.onChange && props.onChange(e);
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

