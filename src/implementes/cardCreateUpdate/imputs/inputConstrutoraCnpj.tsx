/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import ApiCpnj from "@/actions/financeira/api/cnpj";
import { FinanceiraContext } from "@/context/FinanceiraContext";
import {
  Box,
  Flex,
  IconButton,
  Input,
  InputProps,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { mask, unMask } from "remask";
import { FaSearch } from "react-icons/fa";
import { PulseLoader } from "react-spinners";

import { ConstrutoraContext } from "@/context/ConstrutoraContex";

export interface InputCnpjProps extends InputProps {
  setValueCnpj?: string;
}

/**
 * Input que aceita CNPJ, aplica a máscara automaticamente e retorna o valor sem máscara.
 *
 * @param setValueCnpj - valor do CNPJ sem máscara
 * @param props - props do Input do Chakra
 *
 * @returns componente Input com a máscara de CNPJ
 *
 */
export default function InputCostrutoraCnpj({ setValueCnpj, ...props }: InputCnpjProps) {
  const { setData } = useContext(ConstrutoraContext);
  const [cnpjLocal, setCnpjLocal] = useState<string>("");
  const [Mask, setMask] = useState<string>("");
  const [Loading, setLoading] = useState<boolean>(false);
  const [Error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!setValueCnpj) return;
    const valorLimpo = unMask(setValueCnpj);
    const maskCpf = mask(valorLimpo, ["99.999.999/9999-99"]);
    setMask(maskCpf);
    setCnpjLocal(valorLimpo);
  }, [setValueCnpj]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const valorLimpo = unMask(valor);
    const maskCpf = mask(valorLimpo, ["99.999.999/9999-99"]);
    setMask(maskCpf);
    setCnpjLocal(valorLimpo);
    props.onChange && props.onChange(e);
  };


  const handleOnClick = async () => {
    const valorLimpo = unMask(cnpjLocal);
    if (valorLimpo) {
      setLoading(true);
      try {
        const req = await ApiCpnj(valorLimpo);
        setData(req);  
        setLoading(false);
        setError(false);
      } catch (error) {
        setData({
          error: true,
          message: "Erro ao buscar informações do CNPJ.",
        });
        setLoading(false);
        setError(true);
      }
    }
};

  return (
    <>
      <Flex direction={"row"}>
      {Loading && (
        <Box
          w={"100%"}
          pt={5}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <PulseLoader color="#68D391" />
        </Box>
      )}
      {!Loading && (
        <Input
          {...props}
          value={Mask}
          type="text"
          color={"teal.500"}
          _hover={{ color: "teal.500" }}
          _focus={{ color: "teal.500", borderColor: "teal.500" }}
          maxLength={18}
          onChange={handleChange}
        />
      )}
      {Error && (
        <Text color={"red"} fontSize="xs">
          CNPJ não encontrado
        </Text>
      )}
      {!setValueCnpj && (
        <IconButton
        alignSelf={"center"}
        size={"sm"}
        colorScheme="green"
        aria-label="Search database"
        icon={<FaSearch />}
        onClick={handleOnClick}
      />
      )}
        
        <Box hidden>
          <Input value={cnpjLocal} type="text" name="cnpj" hidden readOnly/>
        </Box>
      </Flex>
    </>
  );
}
