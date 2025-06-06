/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { Box, Input, InputProps } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import { mask, unMask } from "remask";

export interface InputCpfProps extends InputProps {
  setValueCpf?: string;
}

type InputCpfType = {
  CpfContex: string;
  setCpfContex: React.Dispatch<React.SetStateAction<string>>;
};

export const InputCpfContext = createContext<InputCpfType>({
  CpfContex: "",
  setCpfContex: () => "",
});

/**
 * Input que aceita CPF, aplica a máscara automaticamente e retorna o valor sem máscara.
 *
 * @param setValueCpf - valor do CPF sem máscara
 * @param props - props do Input do Chakra
 *
 * @returns componente Input com a máscara de CPF
 *
 */
export default function InputCpf({ setValueCpf, ...props }: InputCpfProps) {
  const [cpf, setCpf] = useState<string>("");
  const [Mask, setMask] = useState<string>("");

  useEffect(() => {
    if (!setValueCpf) return;
    const valorLimpo = unMask(setValueCpf);
    const maskCpf = mask(valorLimpo, ["999.999.999-99"]);
    setMask(maskCpf);
    setCpf(valorLimpo);
  }, [setValueCpf]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const valorLimpo = unMask(valor);
    const maskCpf = mask(valorLimpo, ["999.999.999-99"]);
    setMask(maskCpf);
    setCpf(valorLimpo);
    props.onChange && props.onChange(e); // Mantém o evento original se passado
  };

  return (
    <>
      <InputCpfContext.Provider
        value={{ CpfContex: cpf, setCpfContex: setCpf }}
      >
        {setValueCpf && (
          <Input
            {...props}
            value={Mask}
            type="text"
            color={"teal.500"}
            readOnly
            _hover={{ color: "teal.500" }}
            _focus={{ color: "teal.500", borderColor: "teal.500" }}
          />
        )}
        {!setValueCpf && (
          <Input {...props} 
          value={Mask} 
          type="text" 
          onChange={handleChange} 
          />
        )}
        <Box hidden>
          <Input value={cpf} type="text" name="cpf" hidden readOnly />
        </Box>
      </InputCpfContext.Provider>
    </>
  );
}
