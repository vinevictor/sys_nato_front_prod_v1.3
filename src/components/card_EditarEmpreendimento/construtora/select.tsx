import {
  Box,
  Flex,
  FormLabel,
  chakra,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";

interface ConstrutoraType {
  id: number;
  fantasia: string;
}

interface Props {
  id?: number;
  Data: ConstrutoraType[];
  handleConstrutoraChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSelectName: (e: string) => void;
}

export default function ConstrutoraSelectEditEmp({
  id,
  Data,
  handleConstrutoraChange,
  handleSelectName,
}: Props) {
  const [construtoraId, setConstrutoraId] = useState<number>(id ?? 0);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const filter = Data.find(
      (item) => item.id === Number(selectedId)
    );
    setConstrutoraId(Number(selectedId));
    handleSelectName(filter?.fantasia ?? "");
    handleConstrutoraChange(e);
  };

  return (
    <Flex gap={3} direction="column">
      {/* Input com nome da construtora selecionada */}
      <Box>
        <FormLabel
          fontSize="sm"
          fontWeight="md"
          mb={2}
          color="gray.700"
          _dark={{
            color: "gray.200",
          }}
        >
          Construtora
        </FormLabel>
        <Select
          name="construtoraName"
          value={construtoraId}
          onChange={handleSelectChange}
          bg="gray.50"
          _dark={{
            bg: "gray.800",
            borderColor: "gray.600",
            color: "gray.100",
          }}
          borderColor="gray.300"
          _hover={{
            borderColor: "gray.400",
          }}
          _focus={{
            borderColor: "green.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
          }}
        >
          <chakra.option _dark={{ color: "gray.700" }} value="">
            Selecione uma construtora abaixo
          </chakra.option>
          {Data.map((item) => (
            <chakra.option
              _dark={{ color: "gray.700" }}
              key={item.id}
              value={item.id}
            >
              {item.fantasia}
            </chakra.option>
          ))}
        </Select>
      </Box>
    </Flex>
  );
}
