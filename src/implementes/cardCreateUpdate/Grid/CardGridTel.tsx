import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { InputTel2 } from "../imputs/inputTel2";

interface CardGridTel1Props extends BoxProps {
  DataSolicitacao: string;
  index: number;
  readonly?: boolean
}
export default function CardGridTel({
  DataSolicitacao,
  index,
  readonly,
  ...props
}: CardGridTel1Props) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Telefone {index > 0 && index}
        </FormLabel>
        <InputTel2
          index={index > 0 ? index : 0}
          SetValue={DataSolicitacao}
          px={1}
          bg={"gray.100"}
          borderColor={"gray.400"}
          readonly={readonly}
        />
      </Box>
    </>
  );
}
