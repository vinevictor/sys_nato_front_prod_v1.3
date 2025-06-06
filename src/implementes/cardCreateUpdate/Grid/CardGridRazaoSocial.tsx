import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import InputRazaoSocial from "../imputs/inputRazaoSocial";
import React from "react";


interface CardGridRazaoSocialProps extends BoxProps {
  RazaoSocial?: string;
};

export default function CardGridRazaoSocial({ RazaoSocial, ...props }: CardGridRazaoSocialProps) {
    
    return (
      <>
        <Box {...props}>
          <FormLabel fontSize="sm" fontWeight="md" m={0}>
            Razão Social
          </FormLabel>
          <InputRazaoSocial
            name="razaosocial"
            variant="flushed"
            setValueRazaoSocial={RazaoSocial}
            borderColor={"gray.400"}
            px={1}
            bg={"gray.100"}
          />
        </Box>
      </>
    );
}