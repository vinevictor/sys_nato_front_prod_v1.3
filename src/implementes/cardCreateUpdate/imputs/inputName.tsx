"use client";

import { Box, Input, InputProps, Tooltip } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";

export interface InputCpfProps extends InputProps {
  setValueName?: string;
  readonly?: boolean;
}

type InputNameType = {
  NameContex: string;
  setNameContex: React.Dispatch<React.SetStateAction<string>>;
};

export const InputNameContext = createContext<InputNameType>({
  NameContex: "",
  setNameContex: () => ""
});

export default function InputName({
  setValueName,
  readonly,
  ...props
}: InputCpfProps) {
  const [Nome, setNome] = useState<string>("");

  useEffect(() => {
    if (!setValueName) return;
    const ValorSemAcentos = setValueName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const removeCaracteresEspeciais = ValorSemAcentos.replace(
      /[^a-zA-Z\s]/g,
      ""
    );
    const Linite1EspacoEntre = removeCaracteresEspeciais.replace(/\s+/g, " ");
    const RemosEspacosExtras = Linite1EspacoEntre.trim();
    const UpCase = RemosEspacosExtras.toUpperCase();
    setNome(UpCase);
  }, [setValueName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
  
    const normalized = rawValue
      .normalize("NFD") // remove acentos
      .replace(/[\u0300-\u036f]/g, "");
  
    const noSpecialChars = normalized.replace(/[^a-zA-Z\s]/g, "");

    const upperCased = noSpecialChars.toUpperCase();
  
    setNome(upperCased);
  
    if (props.onChange) {
      props.onChange(e); // mantém o evento original se foi passado
    }
  };

  return (
    <>
      <InputNameContext.Provider
        value={{ NameContex: Nome, setNameContex: setNome }}
      >
        <Box>
          {readonly ? (
            <Tooltip
              bg={"orange.400"}
              label="Para fazer alguma alteração, solicite abrindo um chamado!"
              rounded={"lg"}
            >
              <Input {...props} value={Nome} type="text" readOnly />
            </Tooltip>
          ) : (
            <Input
              {...props}
              value={Nome}
              type="text"
              onChange={handleChange}
            />
          )}
        </Box>
      </InputNameContext.Provider>
    </>
  );
}
