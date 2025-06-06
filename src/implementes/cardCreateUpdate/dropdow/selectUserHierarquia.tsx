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
          border="1px solid #b8b8b8cc"
          borderTop={"none"}
          borderRight={"none"}
          borderLeft={"none"}
          borderRadius="0"
          bg={"gray.100"}
          borderColor={"gray.400"}
          onChange={(e: any) => setHierarquia(e.target.value)}
          value={Hierarquia}
        >
          <option style={{ backgroundColor: "#EDF2F7" }} value={0}>
            Selecione um cargo
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
