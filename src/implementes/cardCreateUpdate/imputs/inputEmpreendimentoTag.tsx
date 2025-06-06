/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { Box, Input, InputProps } from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";

export interface InputEmpreendimentoTagProps extends InputProps {
    setTagValue?: string;
}
export default function InputEmpreendimentoTag({ setTagValue, ...props }: InputEmpreendimentoTagProps) {
    
    const [tagLocal, setTagLocal] = useState<string>("");


  useEffect(() => {
    if(!tagLocal.includes("NATO_" )){
        const nato = `NATO_${tagLocal}`;
        setTagLocal(nato);
    }
    if (!setTagValue) return;
    const UpCase = setTagValue.toUpperCase();
    setTagLocal(UpCase);
  }, [setTagValue, tagLocal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const UpCase = valor.toUpperCase();
    if(!UpCase.includes("NATO_")){
        const nato = `NATO_${UpCase}`;
        setTagLocal(nato);
    }else{
        setTagLocal(UpCase);
    }
    props.onChange && props.onChange(e);
  };

  return (
    <>
        <Box>
          <Input {...props} value={tagLocal} type="text" onChange={handleChange} />
        </Box>
    </>
  );
}
