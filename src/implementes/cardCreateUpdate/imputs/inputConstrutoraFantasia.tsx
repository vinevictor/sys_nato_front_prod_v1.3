"use client";
import { ConstrutoraContext } from "@/context/ConstrutoraContex";
import { Box, Input, InputProps } from "@chakra-ui/react";
import React, { useState } from "react";
import { useContext, useEffect } from "react";

export interface InputFantasiaProps extends InputProps {
    setValueFantasia?: string;
}
export default function InputFantasia({ setValueFantasia, ...props }: InputFantasiaProps) {
    
    const { data} = useContext(ConstrutoraContext)
    const [fantasiaLocal, setFantasiaLocal] = useState<string>("");
    


  useEffect(() => {

    if(data){
      setFantasiaLocal(data.nomefantasia);
    }
    if (!setValueFantasia) return;
    const ValorSemAcentos = setValueFantasia.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const removeCaracteresEspeciais = ValorSemAcentos.replace(/[^a-zA-Z\s\.,\/\\:;!?'"()-]/g, "");
    const Linite1EspacoEntre = removeCaracteresEspeciais.replace(/\s+/g, " ");
    const RemosEspacosExtras = Linite1EspacoEntre.trim();
    const UpCase = RemosEspacosExtras.toUpperCase();
    setFantasiaLocal(UpCase);
  }, [setValueFantasia,data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const ValorSemAcentos = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const removeCaracteresEspeciais = ValorSemAcentos.replace(/[^a-zA-Z\s\.,\/\\:;!?'"()-]/g, "");
    const Linite1EspacoEntre = removeCaracteresEspeciais.replace(/\s+/g, " ");
    const RemosEspacosExtras = Linite1EspacoEntre;
    const UpCase = RemosEspacosExtras.toUpperCase();
    setFantasiaLocal(UpCase);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.onChange && props.onChange(e); 
  };

  return (
    <>
        <Box>
          <Input {...props} value={fantasiaLocal} type="text" onChange={handleChange} />
        </Box>
    </>
  );
}
