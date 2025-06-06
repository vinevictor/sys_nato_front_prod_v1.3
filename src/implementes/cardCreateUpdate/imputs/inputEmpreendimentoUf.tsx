/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { Box, Input, InputProps } from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";

export interface InputEmpreendimentoUfProps extends InputProps {
    setUfValue?: string;
}
export default function InputEmpreendimentoUf({ setUfValue, ...props }: InputEmpreendimentoUfProps) {
    
    const [ufLocal, setUfLocal] = useState<string>("");


  useEffect(() => {
    if (!setUfValue) return;
    const UpCase = setUfValue.toUpperCase();
    setUfLocal(UpCase);
  }, [setUfValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const UpCase = valor.toUpperCase();
    setUfLocal(UpCase);
    props.onChange && props.onChange(e);
  };

  return (
    <>
        <Box>
          <Input {...props} value={ufLocal} type="text" maxLength={2} onChange={handleChange} />
        </Box>
    </>
  );
}
