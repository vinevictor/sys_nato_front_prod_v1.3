import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { InputRegisterTel } from "../imputs/inputRegisterTel";

interface CardGridTel1Props extends BoxProps {
  index?: number,
  tell?: string;
}
export default function CardGridRegisterTel({
  tell,
  index,
  ...props
}: CardGridTel1Props) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Telefone {index && index > 0 && index}
        </FormLabel>
        <InputRegisterTel
          maxLength={16}
          Index={index && index > 0 && index}
          tell={tell}
          px={1}
          bg={"gray.100"}
          borderColor={"gray.400"}
        />
      </Box>
    </>
  );
}
