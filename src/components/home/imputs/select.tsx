import { Select, SelectProps, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";

type SelectComponentProps = SelectProps;

export const SelectComponentFilterHome = memo(
  ({ children, ...props }: SelectComponentProps) => {
    const inputBg = useColorModeValue("white", "gray.700");
    const inputBorder = useColorModeValue("gray.300", "gray.600");
    const inputFocusBorder = useColorModeValue("#00713D", "#00d672");
    const textColor = useColorModeValue("#023147", "white");

    return (
      <Select
        bg={inputBg}
        color={textColor}
        borderColor={inputBorder}
        focusBorderColor={inputFocusBorder}
        _hover={{ borderColor: inputFocusBorder }}
        size="md"
        borderRadius="md"
        transition="all 0.2s"
        {...props}
      >
        {children}
      </Select>
    );
  }
);

SelectComponentFilterHome.displayName = "SelectComponentFilterHome";
