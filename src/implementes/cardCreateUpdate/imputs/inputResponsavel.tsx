/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { Box, Flex, Input, Select, SelectProps } from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";

export interface InputResponsavelProps extends SelectProps {
  setValue: any;
}
export default function InputResponsavel({
  setValue,
  ...props
}: InputResponsavelProps) {
  const [Usuario, setUsuario] = useState<number | undefined>();
  const [UsuarioData, setUsuarioData] = useState<any>([]);

  useEffect(() => {
    const getConstrutora = async () => {
      const req = await fetch("/api/usuario/getall");
      if (req.ok) {
        const data = await req.json();
        if (data) {
          setUsuarioData(data);
        }
      } else {
        return { status: 500, message: "error", data: null };
      }
    };
    getConstrutora();

    if (setValue) {
      const dataValue = setValue;
      setUsuario(dataValue.id);
    }
  }, [setValue]);

  return (
    <>
      <Flex gap={2}>
        <Select
          {...props}
          border="1px solid #b8b8b8cc"
          borderTop={"none"}
          borderRight={"none"}
          borderLeft={"none"}
          borderRadius="0"
          bg={"gray.100"}
          borderColor={"gray.400"}
          onChange={(e: any) => setUsuario(Number(e.target.value))}
          value={Usuario}
        >
          <option style={{ backgroundColor: "#EDF2F7" }} value={0}>
            Selecione um responsável
          </option>
          {UsuarioData.length > 0 &&
            UsuarioData.map((Usuario: any) => (
              <option
                style={{ backgroundColor: "#EDF2F7" }}
                key={Usuario.id}
                value={Usuario.id}
              >
                {Usuario.nome}
              </option>
            ))}
        </Select>
      </Flex>
      <Box hidden>
        <Input name="responsavel" value={Usuario} readOnly />
      </Box>
    </>
  );
}
