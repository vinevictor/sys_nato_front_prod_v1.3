import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import InputFantasia from "../imputs/inputFantasia";



interface CardGridFantasiaProps extends BoxProps {
    Fantasia?: string;
};

export default function CardGridFantasia({ Fantasia, ...props }: CardGridFantasiaProps) {
    return (
      <>
        <Box {...props}>
          <FormLabel fontSize="sm" fontWeight="md" m={0}>
            Fantasia (Opcional)
          </FormLabel>
          <InputFantasia
            name="fantasia"
            variant="flushed"
            setValueFantasia={Fantasia}
            borderColor={"gray.400"}
            px={1}
            bg={"gray.100"}
          />
        </Box>
      </>
    );
}