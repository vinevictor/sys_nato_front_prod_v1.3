import CreateSuportAlert from "@/components/botoes/btn_create_suporte";
import { Box, BoxProps, FormLabel } from "@chakra-ui/react";

interface CardGridSuportProps extends BoxProps {
  ID: number;
  user: any;
}

export async function CardGridSuport({ ID, user }: CardGridSuportProps) {
  return (
    <>
      {user?.hierarquia === "ADM" && (
        <Box>
          <FormLabel fontSize="sm" fontWeight="md" m={0}>
            Anexar ou Editar Suporte
          </FormLabel>
          {ID && (
            <>
              <CreateSuportAlert id={ID} />
            </>
          )}
        </Box>
      )}
    </>
  );
}
