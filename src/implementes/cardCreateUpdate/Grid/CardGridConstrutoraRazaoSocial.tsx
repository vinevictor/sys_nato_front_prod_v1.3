import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import InputConstrutoraRazaoSocial from "../imputs/inputConstrutoraRazaoSocial";


interface CardGridConstrutoraRazaoSocialProps extends BoxProps {
  RazaoSocial?: string;
};

export default function CardGridConstrutoraRazaoSocial({ RazaoSocial, ...props }: CardGridConstrutoraRazaoSocialProps) {
    
    return (
      <>
        <Box {...props}>
          <FormLabel fontSize="sm" fontWeight="md" m={0}>
            Razão Social
          </FormLabel>
          <InputConstrutoraRazaoSocial
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