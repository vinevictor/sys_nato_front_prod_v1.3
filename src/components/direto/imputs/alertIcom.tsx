"use client";
import { Box, Icon, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Portal } from "@chakra-ui/react";
import { FiAlertTriangle } from "react-icons/fi";

interface AlertIcomCompomentProps {
  tag?: any[];
}

export const AlertIcomCompoment = ({ tag }: AlertIcomCompomentProps) => {
  return (
    <>
      {tag && tag.length > 0 ? (
        <Popover>
          <PopoverTrigger>
            <IconButton
              variant={"outline"}
              size={"sm"}
              color={"red"}
              fontSize={"1.5rem"}
              icon={<FiAlertTriangle />}
              aria-label={"Alert"}
              _hover={{ bg: "red", color: "white" }}
              border={"none"}
              p={0}
            />
          </PopoverTrigger>
          {tag && tag.length > 0 && (
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Atenção</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  {tag && tag.map((item) => item.descricao).join(",\n")}
                </PopoverBody>
              </PopoverContent>
            </Portal>
          )}
        </Popover>
      ) : (
        <Box as="span">
          <Icon
            as={FiAlertTriangle}
            color={"red.200"}
            fontSize={"1.5rem"}
            fontWeight={"900"}
            cursor="not-allowed"
            mt={1}
          />
        </Box>
      )}
    </>
  );
};