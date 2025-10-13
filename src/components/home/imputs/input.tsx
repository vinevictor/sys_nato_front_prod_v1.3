import { Input, InputProps } from "@chakra-ui/react";
import { memo } from "react";

type InputComponentProps = InputProps;

export const InputComponentFilterHome = memo(({ ...props }: InputComponentProps) => {
  return (
    <Input
      textColor={"#00713D"}
      _hover={{ borderColor: "#00613C" }}
      borderColor={"#00713D"}
      placeholder="Nome"
      _dark={{
        borderColor: "#00d672",
        textColor: "white",
      }}
      size="sm"
      borderRadius="0.5rem"
      {...props}
    />
  );
});

InputComponentFilterHome.displayName = "InputComponentFilterHome";
