import { Input, InputProps } from "@chakra-ui/react";
import { memo } from "react";

interface InputComponentProps extends InputProps {}

export const InputComponentFilterHome = memo(({ ...props }: InputComponentProps) => {
  return (
    <Input
      textColor={"#00713D"}
      _hover={{ borderColor: "#00613C" }}
      borderColor={"#00713D"}
      placeholder="Nome"
      size="sm"
      borderRadius="1rem"
      {...props}
    />
  );
});
