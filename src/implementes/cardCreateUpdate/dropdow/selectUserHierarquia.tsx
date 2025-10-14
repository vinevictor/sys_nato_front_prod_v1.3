"use client";
import { Hierarquia, HierarquiaOptions } from "@/data/hierarquia";
import { Flex, Select, SelectProps } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
interface SelectUserHierarquiaProps extends SelectProps {
  setValue: any;
}

export function SelectUserHierarquia({
  setValue,
  ...props
}: SelectUserHierarquiaProps) {
  const [Hierarquia, setHierarquia] = useState<number | undefined>();

  useEffect(() => {
    if (setValue) {
      setHierarquia(setValue);
    }
  }, [setValue]);

  return (
    <>
      <Flex gap={2}>
        <Select
          name="hierarquia"
          {...props}
          border="1px solid"
          borderColor="gray.400"
          borderTop={"none"}
          borderRight={"none"}
          borderLeft={"none"}
          borderRadius="0"
          bg="gray.100"
          color="gray.800"
          onChange={(e: any) => setHierarquia(e.target.value)}
          value={Hierarquia}
          _dark={{
            bg: "gray.700",
            borderColor: "gray.500",
            color: "gray.100"
          }}
          sx={{
            "& option": {
              bg: "white",
              color: "gray.800",
            },
            "&:is([data-theme='dark']) option, .chakra-ui-dark &option": {
              bg: "gray.800",
              color: "gray.100",
            }
          }}
        >
          <option value={0}>
            Selecione uma hierarquia
          </option>
          {HierarquiaOptions.map((hierarquia: Hierarquia) => (
            <option key={hierarquia.id} value={hierarquia.param}>
              {hierarquia.Label}
            </option>
          ))}
        </Select>
      </Flex>
    </>
  );
}
