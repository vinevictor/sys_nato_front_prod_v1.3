import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { SelectUserFinanceira } from "../dropdow/selectUserFinanceira";

interface CardGridUserFinanceiraProps extends BoxProps {
  UserFinanceira?: number | any;
}

export function CardGridUserFinanceira({
  UserFinanceira,
  ...props
}: CardGridUserFinanceiraProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Financeira
        </FormLabel>
        <SelectUserFinanceira setValue={UserFinanceira} />
      </Box>
    </>
  );
}
