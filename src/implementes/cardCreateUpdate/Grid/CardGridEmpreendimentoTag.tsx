import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import InputEmpreendimentoTag from "../imputs/inputEmpreendimentoTag";

interface CardGridEmpreendimentoTagProps extends BoxProps {
  tag?: string;
}

export default function CardGridEmpreendimentoTag({
  tag,
  ...props
}: CardGridEmpreendimentoTagProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
            Tag  
        </FormLabel>
        <InputEmpreendimentoTag
          name="tag"
          variant="flushed"
          setTagValue={tag}
          borderColor={"gray.400"}
          px={1}
          bg={"gray.100"}
        />
      </Box>
    </>
  );
}
