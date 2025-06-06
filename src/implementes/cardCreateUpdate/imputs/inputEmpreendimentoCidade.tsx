/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { Box, Input, InputProps } from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";

export interface InputEmpreendimentoCidadeProps extends InputProps {
  setCidadeValue?: string;
}
export default function InputEmpreendimentoCidade({ setCidadeValue, ...props }: InputEmpreendimentoCidadeProps) {
    
    const [cidadeLocal, setCidadeLocal] = useState<string>("");


  useEffect(() => {

    if (!setCidadeValue) return
    const Linite1EspacoEntre = setCidadeValue.replace(/\s+/g, " ");
    const RemosEspacosExtras = Linite1EspacoEntre.trim();
    const cidadeFinal = RemosEspacosExtras.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase());
    setCidadeLocal(cidadeFinal);
  }, [setCidadeValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const Linite1EspacoEntre = valor.replace(/\s+/g, " ");
    const RemosEspacosExtras = Linite1EspacoEntre;
    const cidadeFinal = RemosEspacosExtras.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase());
    setCidadeLocal(cidadeFinal);
    props.onChange && props.onChange(e);
  };

  return (
    <>
        <Box>
          <Input {...props} value={cidadeLocal} type="text" onChange={handleChange} />
        </Box>
    </>
  );
}
