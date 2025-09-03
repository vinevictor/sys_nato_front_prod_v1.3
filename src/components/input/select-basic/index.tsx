import {
  FormControl,
  FormLabel,
  Select,
  Text,
  SelectProps,
  Spinner, // 👈 1. Importe o Spinner do Chakra
} from "@chakra-ui/react";
// O BeatLoader não é mais necessário aqui
// import { BeatLoader } from "react-spinners";

interface Option {
  id: string | number;
  fantasia: string;
}

interface SelectBasicProps extends SelectProps {
  id: string;
  onvalue: (value: any) => void;
  Disable?: boolean;
  label: string;
  required?: boolean;
  boxWidth?: string;
  options: Option[];
  isLoading?: boolean; // Renomeado de 'Disable' para ser mais claro
}

export default function SelectBasic({
  required = false,
  onvalue,
  Disable = false,
  id,
  label,
  options,
  isLoading,
  ...props
}: SelectBasicProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onvalue(e.target.value);
  };

  return (
    <FormControl w={props.boxWidth}>
      <FormLabel
        htmlFor={id}
        fontSize="sm"
        display="flex"
        alignItems="center"
        gap={1}
      >
        {label}
        {required && (
          <Text as="span" fontSize="xs" color="red">
            Obrigatório*
          </Text>
        )}
      </FormLabel>

      <Select
        {...props}
        id={id}
        isDisabled={Disable || isLoading}
        border="1px solid #b8b8b8cc"
        onChange={handleOnChange}
        placeholder="Selecione"
        icon={isLoading ? <Spinner size="sm" /> : undefined}
      >
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.fantasia}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
