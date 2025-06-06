"use client";
import { Input, InputProps } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FinanceiraContext } from "@/context/FinanceiraContext";
import React from "react";
import { mask } from "remask";

// Definindo o tipo para SetValue, ajuste conforme necessário para o tipo correto da sua aplicação
interface InputTelRazaoSocialProps extends InputProps {
  Index?: number | any;
  tell?: string;
}

export const InputTelRazaoSocial = ({
  Index,
  tell,
  ...props
}: InputTelRazaoSocialProps) => {
  const { data } = useContext(FinanceiraContext);
  const [telLocal, setTelLocal] = useState<string>("");

  useEffect(() => {
    if (data) {
      setTelLocal(data.telefone);
    }
    if (tell) {
      const MaskTel = mask(tell, ["(99) 9 9999-9999", "(99) 9999-9999"]);
      setTelLocal(MaskTel);
    }
  }, [tell, data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      const value = e.target.value;
      const valorLimpo = value.replace(/[^0-9]/g, "");
      const MaskTel = mask(valorLimpo, ["(99) 9 9999-9999", "(99) 9999-9999"]);
      setTelLocal(MaskTel);
    }
  };
  return (
    <>
      <Input
        type="text"
        value={telLocal}
        onChange={handleChange}
        placeholder="(__) _____-____"
        name={Index > 0 ? `telefone ${Index}` : "telefone"}
        variant="flushed"
        {...props}
      />
      <Input
        hidden
        type="text"
        value={tell}
        name={"telefoneSemMask"}
        readOnly
      />
    </>
  );
};
