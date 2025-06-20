"use client";
import {
  Box,
  Icon,
  IconButton,
  IconButtonProps,
  Tooltip,
} from "@chakra-ui/react";
import { BsFillTrashFill } from "react-icons/bs";

interface DeletarIconComponentProps extends IconButtonProps {
  Block?: boolean;
  andamento: string | null;
}

export const DeletarIconComponent = ({
  Block,
  andamento,
  ...props
}: DeletarIconComponentProps) => {
  const Aparecer = !Block
    ? false
    : andamento === "APROVADO"
    ? false
    : andamento === "EMITIDO"
    ? false
    : andamento === "REVOGADO"
    ? false
    : true;
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
};
