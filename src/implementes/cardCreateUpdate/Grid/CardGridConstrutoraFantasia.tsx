import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import InputFantasia from "../imputs/inputFantasia";



interface CardGridConstrutoraFantasiaProps extends BoxProps {
    Fantasia?: string;
};

export default function CardGridConstrutoraFantasia({ Fantasia, ...props }: CardGridConstrutoraFantasiaProps) {
    return (
      <>
        <Box {...props}>
          <FormLabel fontSize="sm" fontWeight="md" m={0}>
            Fantasia
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