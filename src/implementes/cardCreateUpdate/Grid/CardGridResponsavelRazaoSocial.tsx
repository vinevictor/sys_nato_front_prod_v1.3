import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import InputResponsavel from "../imputs/inputResponsavel";

interface CardGridResponsavelProps extends BoxProps {
  Responsavel?: string;
}

export default function CardGridResponsavel({
  Responsavel,
  ...props
}: CardGridResponsavelProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Responsável
        </FormLabel>
        <InputResponsavel
          name="responsavel"
          variant="flushed"
          setValue={Responsavel}
          borderColor={"gray.400"}
          px={1}
          bg={"gray.100"}
        />
      </Box>
    </>
  );
}
