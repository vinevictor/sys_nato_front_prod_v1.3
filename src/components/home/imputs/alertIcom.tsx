import { Box, Icon, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Portal } from "@chakra-ui/react";
import { FiAlertTriangle } from "react-icons/fi";
import { memo, useMemo } from "react";

interface AlertIcomCompomentProps {
  tag?: any[];
}

export const AlertIcomCompoment = memo(({ tag }: AlertIcomCompomentProps) => {
  const tagText = useMemo(() => {
    if (!tag || tag.length === 0) return "";
    return tag.map((item) => item.descricao).join(",\n");
  }, [tag]);

  const hasTag = useMemo(() => tag && tag.length > 0, [tag]);
  return (
    <>
      {hasTag ? (
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
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Atenção</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                {tagText}
              </PopoverBody>
            </PopoverContent>
          </Portal>
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
            ms={1.5}
          />
        </Box>
      )}
    </>
  );
});