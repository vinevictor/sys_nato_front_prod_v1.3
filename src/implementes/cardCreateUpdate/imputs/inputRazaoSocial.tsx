/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { FinanceiraContext } from "@/context/FinanceiraContext";
import { Box, Input, InputProps } from "@chakra-ui/react";
import React, { useState } from "react";
import { useContext, useEffect } from "react";

export interface InputRazaoSocialProps extends InputProps {
  setValueRazaoSocial?: string;
}
export default function InputRazaoSocial({ setValueRazaoSocial, ...props }: InputRazaoSocialProps) {
    
    const { data } = useContext(FinanceiraContext);
    const [razaosocialLocal, setRazaosocialLocal] = useState<string>("");


  useEffect(() => {
    if(data){
      setRazaosocialLocal(data.razaosocial);
    }
    if (!setValueRazaoSocial) return;
    const ValorSemAcentos = setValueRazaoSocial.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const removeCaracteresEspeciais = ValorSemAcentos.replace(/[^a-zA-Z\s\.,\/\\:;!?'"()-]/g, "");
    const Linite1EspacoEntre = removeCaracteresEspeciais.replace(/\s+/g, " ");
    const RemosEspacosExtras = Linite1EspacoEntre.trim();
    const UpCase = RemosEspacosExtras.toUpperCase();
    setRazaosocialLocal(UpCase);
  }, [setValueRazaoSocial,data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const ValorSemAcentos = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const removeCaracteresEspeciais = ValorSemAcentos.replace(/[^a-zA-Z\s\.,\/\\:;!?'"()-]/g, "");
    const Linite1EspacoEntre = removeCaracteresEspeciais.replace(/\s+/g, " ");
    const RemosEspacosExtras = Linite1EspacoEntre;
    const UpCase = RemosEspacosExtras.toUpperCase();
    setRazaosocialLocal(UpCase);
    props.onChange && props.onChange(e);
  };

  return (
    <>
        <Box>
          <Input {...props} value={razaosocialLocal} type="text" onChange={handleChange} />
        </Box>
    </>
  );
}
