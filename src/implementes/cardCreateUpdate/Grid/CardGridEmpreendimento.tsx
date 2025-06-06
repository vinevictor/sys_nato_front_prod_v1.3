import React from "react";
import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { SelectUserEmpreendimento } from "../dropdow/selectUserEmpreendimento";

interface CardGridUserEmpreedimentoProps extends BoxProps {
  UserEmpreedimento?: number | any;
}

export function CardGridUserEmpreedimento({
  UserEmpreedimento,
  ...props
}: CardGridUserEmpreedimentoProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Empreendimento
        </FormLabel>
        <SelectUserEmpreendimento setValue={UserEmpreedimento} />
      </Box>
    </>
  );
}
