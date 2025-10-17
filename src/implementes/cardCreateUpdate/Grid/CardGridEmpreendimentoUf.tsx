"use client";
import { Box, BoxProps, FormLabel, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import InputEmpreendimentoUf from "../imputs/inputEmpreendimentoUf";

interface Estado {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  iso2: string;
  iso3166_2: string;
}

interface CardGridEmpreendimentoUfProps extends BoxProps {
  uf?: string;
  id?: number | any;
  onUfChange?: (uf: string) => void; // Callback quando a UF muda
}

/**
 * @deprecated Este componente será removido. Use InputEmpreendimentoUf diretamente.
 */
export default function CardGridEmpreendimentoUf({
  uf,
  id,
  onUfChange,
  ...props
}: CardGridEmpreendimentoUfProps) {
  const [estados, setEstados] = useState<Estado[]>([]);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const req = await fetch("/api/country/estados");
        const res = await req.json();
        if (res.ok) {
          setEstados(res.data || []);
        }
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
        setEstados([]);
      }
    };
    fetchEstados();
  }, []);

  const handleUfChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novaUf = e.target.value;
    onUfChange && onUfChange(novaUf);
  };

  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          UF
        </FormLabel>
        <InputEmpreendimentoUf
          name="empreendimentoUf"
          variant="flushed"
          setUfValue={uf}
          estados={estados}
          borderColor={"gray.400"}
          px={1}
          bg={"gray.100"}
          onChange={handleUfChange}
        />
        <Input hidden name="id" value={id} readOnly />
      </Box>
    </>
  );
}
