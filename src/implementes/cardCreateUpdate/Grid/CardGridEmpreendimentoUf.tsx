import { Box, BoxProps, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import InputEmpreendimentoUf from "../imputs/inputEmpreendimentoUf";

interface CardGridEmpreendimentoUfProps extends BoxProps {
  uf?: string
  id?: number | any;
}

export default function CardGridEmpreendimentoUf({
  uf,
  id,
  ...props
}: CardGridEmpreendimentoUfProps) {
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
        />
        <Input hidden name="id" value={id} readOnly />
      </Box>
    </>
  );
}
