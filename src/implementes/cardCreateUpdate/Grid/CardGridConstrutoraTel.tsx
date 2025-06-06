import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import { InputConstrutoraTell } from "../imputs/inputConstrutoraTel";

interface CardGridConstrutoraTelProps extends BoxProps {
  index?: number;
  tell?: string;
}
export default function CardGridConstrutoraTel({
  tell,
  index,
  ...props
}: CardGridConstrutoraTelProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Telefone {index && index > 0 && index}
        </FormLabel>
        <InputConstrutoraTell
          maxLength={16}
          Index={index && index > 0 && index}
          tell={tell}
          px={1}
          bg={"gray.100"}
          borderColor={"gray.400"}
        />
      </Box>
    </>
  );
}
