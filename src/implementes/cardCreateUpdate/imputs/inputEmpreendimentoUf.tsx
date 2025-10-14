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
  ...props
}: InputEmpreendimentoUfProps) {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [ufLocal, setUfLocal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Busca os estados do Brasil
  useEffect(() => {
    const fetchEstados = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/country/estados");
        const result = await response.json();

        if (result.ok) {
          // Ordena os estados por nome
          const estadosOrdenados = result.data.sort((a: Estado, b: Estado) =>
            a.name.localeCompare(b.name)
          );
          setEstados(estadosOrdenados);
        } else {
          setError("Erro ao carregar estados");
        }
      } catch (err) {
        console.error("Erro ao buscar estados:", err);
        setError("Erro ao carregar estados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstados();
  }, []);

  // Define o valor inicial
  useEffect(() => {
    if (setUfValue) {
      const UpCase = setUfValue.toUpperCase();
      setUfLocal(UpCase);
    }
  }, [setUfValue]);

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
        {...props}
        w="full"
        value={ufLocal}
        onChange={handleChange}
        placeholder="Selecione um estado"
        size="md"
        _hover={{
          borderColor: "#00713D",
        }}
        _focus={{
          borderColor: "#00713D",
          boxShadow: "0 0 0 1px #00713D",
        }}
        _dark={{
          bg: "gray.700",
          borderColor: "gray.600",
          color: "gray.100",
          _hover: {
            borderColor: "#00d672",
          },
        }}
      >
        {estados.map((estado) => (
          <chakra.option _dark={{ color: "gray.800" }} key={estado.id} value={estado.iso2}>
            {estado.name} ({estado.iso2})
          </chakra.option>
        ))}
      </Select>
    </Box>
  );
}
