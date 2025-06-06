/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { Input, InputProps, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export interface InputEmailProps extends InputProps {
  setValueEmail?: string;
  readonly?: boolean;
}

export default function InputEmail({
  setValueEmail,
  readonly,
  ...props
}: InputEmailProps) {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (!setValueEmail) return;
    const isValidEmail = validateEmail(setValueEmail);
    if (isValidEmail) {
      setEmail(setValueEmail);
    }
  }, [setValueEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setEmail(valor);
    props.onChange && props.onChange(e); // Mantém o evento original se passado
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <>
      {readonly ? (
        <Tooltip
          bg={"orange.400"}
          label="Para fazer alguma alteração, solicite abrindo um chamado!"
          rounded={"lg"}
        >
          <Input {...props} value={email} type="email" readOnly />
        </Tooltip>
      ) : (
        <Input {...props} value={email} type="email" onChange={handleChange} />
      )}
    </>
  );
}
