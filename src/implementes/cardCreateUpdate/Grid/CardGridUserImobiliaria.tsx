import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { SelectUserImobiliaria } from "../dropdow/selectUserImobiliaria";

interface CardGridUserImobiliariaProps extends BoxProps {
  UserImobiliaria?: { id: number; fantasia: string }[] | any;
}

export function CardGridUserImobiliaria({
  UserImobiliaria,
  ...props
}: CardGridUserImobiliariaProps) {
  return (
    <Box {...props}>
      <FormLabel
        fontSize="sm"
        fontWeight="md"
        m={0}
        color="gray.700"
        _dark={{ color: "gray.300" }}
      >
        Imobiliária
      </FormLabel>
      <SelectUserImobiliaria setValue={UserImobiliaria} />
    </Box>
  );
}
