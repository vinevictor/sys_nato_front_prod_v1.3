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
      size="sm"
      _dark={{
        borderColor: "#00d672",
        textColor: "white",
      }}
      borderRadius="0.5rem"
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
