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
    if(!setValueEmail) return;
    const isValidEmail = validateEmail(setValueEmail);
    if(data){
      setEmailLocal(data.email);
    }
    if (isValidEmail) {
      setEmailLocal(setValueEmail);
    }
  }, [data, setValueEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setEmailLocal(valor);
    props.onChange && props.onChange(e); // Mantém o evento original se passado
  };

  /**
   * Valida um endereço de e-mail após sanitizar a entrada.
   * Limpa espaços extras, quebras de linha (\r, \n), tabs, e caracteres de largura zero,
   * então aplica a expressão regular robusta para verificar o formato.
   * Não altera o estado do input, apenas valida a string recebida.
   */
  const validateEmail = (email: string) => {
    if (!email) return false;
    // Remove quebras de linha, tabs, espaços e caracteres de largura zero; depois aplica trim
    const sanitized = email
      .replace(/[\r\n\t]/g, "")
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "") // zero-width chars
      .trim()
      .replace(/\s+/g, ""); // remove quaisquer espaços restantes

    // Expressão regular aprimorada (baseada na RFC 5322 simplificada)
    const emailRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return emailRegex.test(sanitized);
  };

  return (
  <>
  <Input {...props} value={emailLocal.toLowerCase()} type="email" onChange={handleChange} />
  </>
  );
}

