import {
  Box,
  Icon,
  IconButton,
  IconButtonProps,
  Tooltip,
} from "@chakra-ui/react";
import { BsFillTrashFill } from "react-icons/bs";
import { memo, useMemo } from "react";

interface DeletarIconComponentProps extends IconButtonProps {
  Block?: boolean;
  andamento: string | null;
}

export const DeletarIconComponent = memo(({
  Block,
  andamento,
  ...props
}: DeletarIconComponentProps) => {
  const Aparecer = useMemo(() => {
    if (!Block) return false;
    if (andamento === "APROVADO" || andamento === "EMITIDO" || andamento === "REVOGADO") {
      return false;
    }
    return true;
  }, [Block, andamento]);
  return (
    <>
      {Aparecer ? (
        <Tooltip label="Deletar solicitação">
          <IconButton
            colorScheme="red"
            variant="outline"
            size={"sm"}
            icon={<BsFillTrashFill />}
            {...props}
          />
        </Tooltip>
      ) : (
        <Box as="span">
          <Icon
            as={BsFillTrashFill}
            color={"red.200"}
            fontSize={"1.2rem"}
            cursor="not-allowed"
            mt={1.5}
            mx={"0.4rem"}
          />
        </Box>
      )}
    </>
  );
});
