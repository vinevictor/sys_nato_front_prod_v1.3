import { Input, InputProps, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";

type InputComponentProps = InputProps;

export const InputComponentFilterHome = memo(({ ...props }: InputComponentProps) => {
  const inputBg = useColorModeValue("white", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  const inputFocusBorder = useColorModeValue("#00713D", "#00d672");
  const textColor = useColorModeValue("#023147", "white");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Input
      bg={inputBg}
      color={textColor}
      borderColor={inputBorder}
      focusBorderColor={inputFocusBorder}
      _hover={{ borderColor: inputFocusBorder }}
      _placeholder={{ color: placeholderColor }}
      placeholder="Nome"
      size="md"
      borderRadius="md"
      transition="all 0.2s"
      {...props}
    />
  );
});

InputComponentFilterHome.displayName = "InputComponentFilterHome";
