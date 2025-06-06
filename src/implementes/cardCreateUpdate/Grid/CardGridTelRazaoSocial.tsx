import { Box, BoxProps, FormLabel } from "@chakra-ui/react";

import { InputTelRazaoSocial } from "../imputs/inputTelRazaoSocial";
import React from "react";

interface CardGridRazaoSocialTelProps extends BoxProps {
  index?: number;
  tell?: string;
}
export default function CardGridRazaoSocialTel({
  tell,
  index,
  ...props
}: CardGridRazaoSocialTelProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Telefone {index && index > 0 && index}
        </FormLabel>
        <InputTelRazaoSocial
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
