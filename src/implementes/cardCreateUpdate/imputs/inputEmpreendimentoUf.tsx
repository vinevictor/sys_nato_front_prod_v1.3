/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { Box, Select, Skeleton, Text, chakra } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

export interface InputEmpreendimentoUfProps {
  setUfValue?: string;
  name?: string;
  variant?: string;
  borderColor?: string;
  px?: number;
  bg?: string;
  estados: Estado[] | [];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface Estado {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  iso2: string;
  iso3166_2: string;
}

/**
 * Select de UF (Estados do Brasil)
 *
 * Busca os estados do Brasil da API /api/country/estados
 * e permite selecionar através de um Select.
 *
 * @param setUfValue - Valor inicial da UF (iso2)
 * @param onChange - Callback quando o valor muda
 * @returns Select com estados do Brasil
 */
export default function InputEmpreendimentoUf({
  setUfValue,
  onChange,
  estados,
  ...props
}: InputEmpreendimentoUfProps) {

  const [ufLocal, setUfLocal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Define o valor inicial
  useEffect(() => {
    if (setUfValue) {
      const UpCase = setUfValue.toUpperCase();
      setUfLocal(UpCase);
    }
  }, [setUfValue]);

  // Controla o loading baseado nos estados recebidos
  useEffect(() => {
    if (estados && estados.length > 0) {
      setIsLoading(false);
    }
  }, [estados]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setUfLocal(valor);
    onChange && onChange(e);
  };

  if (isLoading) {
    return (
      <Box width="100%">
        <Skeleton
          height="33px"
          width="100%"
          minW="200px"
          borderRadius="6px"
          startColor="gray.100"
          endColor="gray.300"
          {...props}
          _dark={{
            startColor: "gray.700",
            endColor: "gray.600",
          }}
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        width="100%"
        p={2}
        bg="red.50"
        borderRadius="md"
        _dark={{ bg: "red.900" }}
      >
        <Text fontSize="sm" color="red.600" _dark={{ color: "red.200" }}>
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box width="100%">
      <Select
        w="full"
        value={ufLocal}
        onChange={handleChange}
        placeholder="Selecione um estado"
        size="md"
        _hover={{
          borderColor: "gray.400",
        }}
        _focus={{
          borderColor: "green.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
        }}
        _dark={{
          bg: "gray.800",
          borderColor: "gray.600",
          color: "gray.100",
        }}
        {...props}
      >
        {estados?.map((estado) => (
          <chakra.option _dark={{ color: "gray.700" }} key={estado.id} value={estado.iso2}>
            {estado.name} ({estado.iso2})
          </chakra.option>
        ))}
      </Select>
    </Box>
  );
}
