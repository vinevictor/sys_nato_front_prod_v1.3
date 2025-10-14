import { Box, BoxProps, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import InputEmpreendimentoUf from "../imputs/inputEmpreendimentoUf";

interface CardGridEmpreendimentoUfProps extends BoxProps {
  uf?: string;
  id?: number | any;
  onUfChange?: (uf: string) => void; // Callback quando a UF muda
}
// TODO remover compoment
export default function CardGridEmpreendimentoUf({
  uf,
  id,
  onUfChange,
  ...props
}: CardGridEmpreendimentoUfProps) {
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
