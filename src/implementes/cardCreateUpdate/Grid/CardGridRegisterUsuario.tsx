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
        <FormLabel 
          fontSize="sm" 
          fontWeight="md" 
          m={0}
          color="gray.700"
          _dark={{ color: "gray.300" }}
        >
          Usuario
        </FormLabel>
        <InputUser
          name="usuario"
          variant="flushed"
          setValueUser={Usuario}
          px={1}
          bg="gray.100"
          borderColor="gray.400"
          _dark={{ 
            bg: "gray.700", 
            borderColor: "gray.500",
            color: "gray.100"
          }}
        />
      </Box>
    </>
  );
}
