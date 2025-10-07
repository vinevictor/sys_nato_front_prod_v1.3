"use client";
import { Flex, Switch, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState, useCallback, memo } from "react";
import { RegisterContext } from "@/context/RegisterContex";

interface SelectGovProps {
  isState: boolean;
}

function SelectGov({ isState }: SelectGovProps) {
  const [Value, setValue] = useState<boolean>(isState);
  const { setGov } = useContext(RegisterContext);

  useEffect(() => {
    setGov(isState);
  }, [isState, setGov]);

  const HandleSubmit = useCallback((value: boolean) => {
    setValue(value);
    setGov(value);
  }, [setGov]);

  return (
    <>
      <Flex gap={2} alignItems={"center"}>
        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
          Atendimento GovBr
        </Text>
        <Switch
          isChecked={Value}
          onChange={(e) => HandleSubmit(e.target.checked)}
          colorScheme="green"
          size={"sm"}
        />
      </Flex>
    </>
  );
}

export default memo(SelectGov);
