import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import InputUser from "../imputs/imputUsuario";
import React from "react";

interface CardGridUsuarioProps extends BoxProps {
  Usuario?: string;
}

export default function CardGridUsuario({ Usuario, ...props }: CardGridUsuarioProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Usuario
        </FormLabel>
        <InputUser
          name="usuario"
          variant="flushed"
          setValueUser={Usuario}
          px={1}
          bg={"gray.100"}
          borderColor={"gray.400"}
        />
      </Box>
    </>
  );
}
