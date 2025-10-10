
"use client";
import { IconButton, IconButtonProps, Tooltip } from "@chakra-ui/react";
import { BsBoxArrowUpRight } from "react-icons/bs";

type EditarIconComponentProps = IconButtonProps;

export const EditarIconComponent = ({ ...props }: EditarIconComponentProps) => {
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
};