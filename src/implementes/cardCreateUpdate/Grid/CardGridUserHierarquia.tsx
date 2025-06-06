import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { SelectUserHierarquia } from "../dropdow/selectUserHierarquia";

interface CardGridUserHierarquiaProps extends BoxProps {
  UserHierarquia?: string | any;
}

export function CardGridUserHierarquia({
    UserHierarquia,
  ...props
}: CardGridUserHierarquiaProps) {

  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Hierarquia
        </FormLabel>
        <SelectUserHierarquia setValue={UserHierarquia} />
      </Box>
    </>
  );
}
