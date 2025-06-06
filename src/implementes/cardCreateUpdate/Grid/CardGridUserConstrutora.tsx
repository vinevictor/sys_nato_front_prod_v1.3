import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { SelectUserConstrutora } from "../dropdow/selectUserconstrutora";

interface CardGridUserConstrutoraProps extends BoxProps {
  UserConstrutora?: string | any;
}

export function CardGridUserConstrutora({
  UserConstrutora,
  ...props
}: CardGridUserConstrutoraProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Construtora
        </FormLabel>
        <SelectUserConstrutora setValue={UserConstrutora} />
      </Box>
    </>
  );
}
