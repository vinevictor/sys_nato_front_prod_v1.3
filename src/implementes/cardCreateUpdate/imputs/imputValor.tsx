"use client";

import { Box, Input, InputProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { mask, unMask } from "remask";

interface InputValorProps extends InputProps {
  setValueValor?: string;
}

export default function InputValor({
  setValueValor,
  ...props
}: InputValorProps) {
  const [Mask, setMask] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
    if (!init) {
      if (!setValueValor) return;
      const valorLimpo = unMask(setValueValor.toString());
      const maskCpf = mask(valorLimpo, ["R$ 999.999.999,99"]);
      setMask(maskCpf);
      setValor(valorLimpo);
      setInit(true);
    }
  }, [setValueValor, init]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const valorLimpo = unMask(valor.replace(/\D/g, ""));
    const maskCpf = mask(valorLimpo, ["R$ 999.999.999,99"]);
    setMask(maskCpf);
    setValor(valorLimpo);
    if (props.onChange) props.onChange(e); // Mantém o evento original se passado
  };

  return (
    <>
      <Input {...props} value={Mask} type="text" onChange={handleChange} />
      <Box>
        <Input value={valor} type="text" name="valorCert" readOnly hidden />
      </Box>
    </>
  );
}
