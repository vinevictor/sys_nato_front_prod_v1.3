"use client";
import { Input, InputProps } from "@chakra-ui/react";

type InputComponentProps = InputProps;

export const InputComponentFilterHome = ({ ...props }: InputComponentProps) => {
  return (
    <Input
      textColor={"#00713D"}
      _hover={{ borderColor: "#00613C" }}
      borderColor={"#00713D"}
      placeholder="id"
      size="sm"
      borderRadius="1rem"
      {...props}
    />
  );
};
