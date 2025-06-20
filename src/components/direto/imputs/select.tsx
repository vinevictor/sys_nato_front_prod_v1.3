"use client";
import { Select, SelectProps } from "@chakra-ui/react";

interface SelectPropsComponent extends SelectProps {
  Data: any;
}
    

export const SelectComponentFilterHome = ({ Data, ...props }: SelectPropsComponent) => {
  return (
    <Select
      textColor={"#00713D"}
      _hover={{ borderColor: "#00613C" }}
      borderColor={"#00713D"}
      placeholder="construtora"
      size="sm"
      borderRadius="1rem"
      {...props}
    >
      { Data.length > 0 &&
        Data.map((item: any) => (
          <option key={item.id} value={item.id}>
            {item.fantasia || item.nome}
          </option>
        ))}
    </Select>
  );
};
