/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import {
  Box,
  Select,
  Skeleton,
  Text,
  SelectProps,
  chakra,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

/**
 * Interface para representar uma cidade retornada pela API
 */
interface Cidade {
  id: number;
  name: string;
  state_code: string;
  state_name: string;
  country_code: string;
  country_name: string;
  latitude: string;
  longitude: string;
}

export interface InputEmpreendimentoCidadeProps extends Omit<SelectProps, 'onChange'> {
  setCidadeValue?: string;
  ufValue?: string; // UF selecionada para buscar as cidades
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * Componente Select de Cidades
 * Busca as cidades de um estado específico baseado na UF selecionada
 * 
 * @param setCidadeValue - Valor inicial da cidade
 * @param ufValue - Código UF do estado para filtrar as cidades
 * @param onChange - Callback quando o valor é alterado
 */
export default function InputEmpreendimentoCidade({ 
  setCidadeValue, 
  ufValue,
  onChange,
  ...props 
}: InputEmpreendimentoCidadeProps) {
  const [cidadeLocal, setCidadeLocal] = useState<string>("");
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  /**
   * Busca as cidades do estado selecionado
   */
  const fetchCidades = async (uf: string) => {
    if (!uf) {
      setCidades([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/country/cidades?state=${uf}`);
      const result = await response.json();

      if (result.ok) {
        // Ordena as cidades por nome
        const cidadesOrdenadas = result.data.sort((a: Cidade, b: Cidade) =>
          a.name.localeCompare(b.name)
        );
        setCidades(cidadesOrdenadas);
      } else {
        setError(result.error || "Erro ao carregar cidades");
        setCidades([]);
      }
    } catch (err) {
      console.error("❌ Erro ao buscar cidades:", err);
      setError("Erro ao carregar cidades");
      setCidades([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Busca cidades quando a UF muda
  useEffect(() => {
    if (ufValue) {
      fetchCidades(ufValue);
    } else {
      setCidades([]);
      setCidadeLocal("");
    }
  }, [ufValue]);

  // Define o valor inicial da cidade
  useEffect(() => {
    if (setCidadeValue) {
      setCidadeLocal(setCidadeValue);
    }
  }, [setCidadeValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setCidadeLocal(valor);
    onChange && onChange(e);
  };

  // Estado de loading ou aguardando UF
  // Mostra skeleton quando: não há UF OU está carregando
  if (isLoading || !ufValue) {
    return (
      <Box width="100%">
        <Skeleton
          height="33px"
          width="100%"
          minW="200px"
          borderRadius="6px"
          startColor="gray.100"
          endColor="gray.300"
          _dark={{
            startColor: "gray.700",
            endColor: "gray.600",
          }}
        />
      </Box>
    );
  }

  // Estado de erro
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
        width="100%"
        minW="200px"
        value={cidadeLocal}
        onChange={handleChange}
        placeholder="Selecione uma cidade"
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
        {cidades.map((cidade) => (
          <chakra.option _dark={{ color: "gray.700" }} key={cidade.id} value={cidade.name}>
            {cidade.name}
          </chakra.option>
        ))}
      </Select>
    </Box>
  );
}
