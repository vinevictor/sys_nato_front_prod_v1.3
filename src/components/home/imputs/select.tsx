import { Select, SelectProps } from "@chakra-ui/react";
import { memo, useMemo } from "react";

interface SelectPropsComponent extends SelectProps {
  Data: any;
  place: string;
}


export const SelectComponentFilterHome = memo(({ Data, place , ...props }: SelectPropsComponent) => {
  const options = useMemo(() => {
    if (!Data || Data.length === 0) return null;
    return Data.map((item: any) => (
      <option key={item.id} value={item.id}>
        {item.fantasia || item.nome}
      </option>
    ));
  }, [Data]);

  return (
    <Select
      textColor={"#00713D"}
      _hover={{ borderColor: "#00613C" }}
      borderColor={"#00713D"}
      placeholder={place}
      size="sm"
      borderRadius="1rem"
      {...props}
    >
      {options}
    </Select>
  );
});

SelectComponentFilterHome.displayName = "SelectComponentFilterHome";
