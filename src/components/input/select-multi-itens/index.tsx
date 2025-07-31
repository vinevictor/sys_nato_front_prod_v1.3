"use client";

import {
  FormControl,
  FormLabel,
  Select,
  Text,
  IconButton,
  Flex,
  useToast,
  SelectProps,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";

interface Option {
  id: string | number;
  label: string;
}

interface SelectMultiItemProps {
  id: string;
  label: string;
  required?: boolean;
  boxWidth?: string;
  options: Option[];
  fetchUrlGet?: string;
  fetchUrlPost?: (id: string | number) => string;
  fetchUrlPatch?: (id: string | number) => string;
  fetchUrlDelete?: (id: string | number) => string;
  onChange?: (items: Option[]) => void;
  selectProps?: SelectProps;
}

export default function SelectMultiItem({
  required = false,
  id,
  label,
  boxWidth,
  options,
  fetchUrlGet,
  fetchUrlPost,
  fetchUrlPatch,
  fetchUrlDelete,
  onChange,
  ...selectProps
}: SelectMultiItemProps) {
  const [selected, setSelected] = useState<number | string>("");
  const [items, setItems] = useState<Option[]>([]);
  const toast = useToast();

  const handleAddItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const find = options.find((item) => String(item.id) === String(selected));
    if (find && !items.some((i) => String(i.id) === String(find.id))) {
      if (fetchUrlPost || fetchUrlPatch) {
        try {
          const url = fetchUrlPatch
            ? fetchUrlPatch(find.id)
            : fetchUrlPost!(find.id);
          const method = fetchUrlPatch ? "PATCH" : "POST";

          const request = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          });

          const response = await request.json();

          const updated = [...items, find];
          setItems(updated);
          onChange && onChange(updated);

          toast({
            title: request.ok ? "Ação realizada" : "Ops!",
            description: `${
              response.message || "Item processado"
            }! Lembre-se de salvar.`,
            status: request.ok ? "success" : "warning",
            duration: 3000,
            isClosable: true,
          });
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao processar o item.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        const updated = [...items, find];
        setItems(updated);
        onChange && onChange(updated);
      }
    }
  };

  const handleDelete = async (item: Option) => {
    if (fetchUrlDelete) {
      try {
        const request = await fetch(fetchUrlDelete(item.id), {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const response = await request.json();

        const updated = items.filter((i) => i.id !== item.id);
        setItems(updated);
        onChange && onChange(updated);

        toast({
          title: request.ok ? "Exclusão realizada" : "Ops!",
          description: `${
            response.message || "Item removido"
          }! Lembre-se de salvar.`,
          status: request.ok ? "success" : "warning",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir o item.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      const updated = items.filter((i) => i.id !== item.id);
      setItems(updated);
      onChange && onChange(updated);
    }
  };

  useEffect(() => {
    if (fetchUrlGet) {
      (async () => {
        const req = await fetch(fetchUrlGet);
        const res = await req.json();

        if (req.ok) {
          const data = res?.map((item: any) => ({
            id: item.id,
            label: item.descricao || item.label || item.fantasia,
          }));
          setItems(data);
          onChange && onChange(data);
        }
      })();
    }
  }, [fetchUrlGet]);

  return (
    <FormControl w={boxWidth}>
      <FormLabel
        htmlFor={id}
        fontSize="sm"
        display="flex"
        alignItems="center"
        gap={1}
      >
        {label}
        {required && (
          <Text as="span" fontSize="xs" color="red.500">
            *
          </Text>
        )}
      </FormLabel>

      <Flex gap={2}>
        <Select
          id={id}
          onChange={(e) => setSelected(e.target.value)}
          placeholder="Selecione"
          size="md"
          {...selectProps}
        >
          {options.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </Select>

        <IconButton
          aria-label={"Adicionar"}
          icon={<FaPlus />}
          size={"md"}
          colorScheme="blue"
          variant="outline"
          onClick={handleAddItem}
        />
      </Flex>

      <Flex gap={2} mt={3} flexWrap="wrap">
        {items.map((item) => (
          <Tag
            key={item.id}
            size={"lg"}
            borderRadius="full"
            variant="solid"
            colorScheme="blue"
          >
            <TagLabel>{item.label}</TagLabel>
            <TagCloseButton onClick={() => handleDelete(item)} />
          </Tag>
        ))}
      </Flex>
    </FormControl>
  );
}
