"use client";
import { Box, FormLabel, Switch, SwitchProps } from "@chakra-ui/react";
import { useState } from "react";

interface SwitchDiretoProps extends SwitchProps {
  label?: string;
  IsValue?: boolean;
}

export default function SwitchDireto({ label, IsValue, ...props }: SwitchDiretoProps) {
  const [value, setValue] = useState(IsValue ?? false);
  return (
    <Box>
      <FormLabel fontSize="sm" fontWeight="md" m={0} mb={2}>
        {label}
      </FormLabel>
      <Switch {...props} size="md" colorScheme="green" onChange={(e) => setValue(e.target.checked)} isChecked={value}/>
    </Box>
  );
}


