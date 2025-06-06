import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { SelectTagsAlerta } from "../dropdow/selectTagsAlerta";
interface CardGridTagsAlertProps extends BoxProps {
  ID: number;
  user: any;
}

export async function CardGridTagsAlert({
  ID,
  user,
  ...props
}: CardGridTagsAlertProps) {
  return (
    <>
      {user?.hierarquia === "ADM" && (
        <Box {...props}>
          <FormLabel fontSize="sm" fontWeight="md" m={0}>
            Tags Alertas
          </FormLabel>
          <SelectTagsAlerta setValue={ID} />
        </Box>
      )}
    </>
  );
}
