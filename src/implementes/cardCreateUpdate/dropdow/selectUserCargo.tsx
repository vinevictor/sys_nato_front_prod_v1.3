"use client";
import { Cargo, CargoOptions } from "@/data/cargo";
import { Flex, Select, SelectProps } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface SelectUserCargoProps extends SelectProps {
  setValue: any;
}

export function SelectUserCargo({ setValue, ...props }: SelectUserCargoProps) {
  const [Cargo, setCargo] = useState<string | undefined>();

  useEffect(() => {
    if (setValue) {
      setCargo(setValue);
    }
  }, [setValue]);

  return (
    <>
      <Flex gap={2}>
        <Select
          name="cargo"
          {...props}
          border="1px solid #b8b8b8cc"
          borderTop={"none"}
          borderRight={"none"}
          borderLeft={"none"}
          borderRadius="0"
          bg={"gray.100"}
          borderColor={"gray.400"}
          onChange={(e: any) => setCargo(e.target.value)}
          value={Cargo}
        >
          <option style={{ backgroundColor: "#EDF2F7" }} value={0}>
            Selecione um cargo
          </option>
          {CargoOptions.map((cargo: Cargo) => (
            <option key={cargo.id} value={cargo.param}>
              {cargo.Label}
            </option>
          ))}
        </Select>
      </Flex>
    </>
  );
}
