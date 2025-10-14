"use client";

import { Box, BoxProps, FormLabel, Input, Text } from "@chakra-ui/react";
import InputCpf from "../imputs/inputCpf";
import React from "react";

interface CardGridCpfProps extends BoxProps {
  CPF?: string;
  idUser?: number;
}

export default function CardGridCpf({
  idUser,
  CPF,
  ...props
}: CardGridCpfProps) {
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
          CPF
        </FormLabel>
        {CPF && (
          <>
            <Text
              hidden
              px={1}
              py={2}
              color="gray.600"
              bg="gray.100"
              borderBottom="1px solid"
              borderColor="gray.400"
              _dark={{ 
                bg: "gray.700", 
                color: "gray.200",
                borderColor: "gray.500"
              }}
            >
              {CPF}
            </Text>
            <InputCpf
              variant="flushed"
              setValueCpf={CPF}
              px={1}
              bg="gray.100"
              borderColor="gray.400"
              maxLength={14}
              _dark={{ 
                bg: "gray.700", 
                borderColor: "gray.500",
                color: "gray.100"
              }}
            />
          </>
        )}
        {!CPF && (
          <InputCpf
            variant="flushed"
            setValueCpf={CPF}
            px={1}
            bg="gray.100"
            borderColor="gray.400"
            maxLength={14}
            _dark={{ 
              bg: "gray.700", 
              borderColor: "gray.500",
              color: "gray.100"
            }}
          />
        )}
      </Box>
      <Box hidden>
        <Input name="id" value={idUser} readOnly />
      </Box>
    </>
  );
}
