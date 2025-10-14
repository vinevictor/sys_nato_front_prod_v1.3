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
          border="1px solid"
          borderColor="gray.400"
          borderTop={"none"}
          borderRight={"none"}
          borderLeft={"none"}
          borderRadius="0"
          bg="gray.100"
          color="gray.800"
          onChange={(e: any) => setCargo(e.target.value)}
          value={Cargo}
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
