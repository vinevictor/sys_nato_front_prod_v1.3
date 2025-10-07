import { IconButton, IconButtonProps, Tooltip } from "@chakra-ui/react";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { memo } from "react";

interface EditarIconComponentProps extends IconButtonProps {}

export const EditarIconComponent = memo(({ ...props }: EditarIconComponentProps) => {
  return (
    <>
      <Tooltip label="Editar solicitação">
        <IconButton
          colorScheme="blue"
          size={"sm"}
          icon={<BsBoxArrowUpRight />}
          {...props}
        />
      </Tooltip>
    </>
  );
});