"use client";

import { Box, Input, InputProps } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";

export interface InputUserProps extends InputProps {
  setValueUser?: string;
}

type InputUserType = {
UserContex: string;
  seUserContex: React.Dispatch<React.SetStateAction<string>>;
};

export const InputUserContext = createContext<InputUserType>({
UserContex: "",
  seUserContex: () => "",
});

// Clean Code: Filtra a prop 's' para evitar erro de atributo não-booleano no DOM
export default function InputUser({ setValueUser, ...props }: InputUserProps) {
  // Remove a prop 's' caso seja passada por engano
  // Isso evita warnings de React e problemas de hidratação
  const {...rest } = props;
  const [Usuario, setUsuario] = useState<string>("");

  useEffect(() => {
    if (!setValueUser) return;
    const ValorSemAcentos = setValueUser.normalize("NFD").replace(/[^a-zA-Z0-9]/g, "");
    const removeCaracteresEspeciais = ValorSemAcentos.replace(/[^a-zA-Z0-9]/g, "");
    const Linite1EspacoEntre = removeCaracteresEspeciais.trim();
    const RemosEspacosExtras = Linite1EspacoEntre;
    const UpCase = RemosEspacosExtras.toUpperCase();
    setUsuario(UpCase);
  }, [setValueUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const ValorSemAcentos = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const removeCaracteresEspeciais = ValorSemAcentos.replace(/[^a-zA-Z0-9]/g, "");
    const Linite1EspacoEntre = removeCaracteresEspeciais.trim();
    const RemosEspacosExtras = Linite1EspacoEntre;
    const UpCase = RemosEspacosExtras.toUpperCase();
    setUsuario(UpCase);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.onChange && props.onChange(e); // Mantém o evento original se passado
  };

  return (
    <>
      <InputUserContext.Provider
        value={{UserContex: Usuario, seUserContex: setUsuario }}
      >
        <Box>
          <Input {...rest} value={Usuario} type="text" onChange={handleChange} />
        </Box>
      </InputUserContext.Provider>
    </>
  );
}
