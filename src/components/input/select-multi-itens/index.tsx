"use client";

import {
  FormControl,
  FormLabel,
  Select,
  Text,
  IconButton,
  Flex,
  SelectProps,
  Tag,
  TagLabel,
  TagCloseButton,
  Box,
  Center,
  CircularProgress,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";

interface GetTagsProps {
  id: number;
  label: string;
  createdAt?: Date | string | null;
  solicitacao?: number;
  descricao?: string;
}

interface SelectMultiItemProps extends SelectProps {
  required?: boolean;
  label: string;
  /**
   * Função que é chamada quando um item é adicionado ou removido
   * @Type (tags: GetTagsProps[]) => array<{id: number, label: string, createdAt?: Date | string | null}>
   */
  OnRetorno: (tags: GetTagsProps[]) => void;
  Tags?: GetTagsProps[];
  isAdmin?: boolean;
  Id: number;
}

export default function SelectMultiItem({
  Id,
  required = false,
  label,
  OnRetorno,
  Tags,
  isAdmin,
  ...props
}: SelectMultiItemProps) {
  const [Options, setOptions] = useState<GetTagsProps[]>([]);
  const [IsLoadingGeral, setIsLoadingGeral] = useState<boolean>(true);
  const [selected, setSelected] = useState<number>(0);
  const [TagsValue, setTagsValue] = useState<GetTagsProps[]>(Tags || []);

  const fetchTags = async () => {
    const req = await fetch("/api/tags/getall");
    const res = await req.json();
    setOptions(res);
    setIsLoadingGeral(false);
  };

  const handleAddItem = () => {
    if (selected) {
      // filtra o item selecionado
      const item = Options.find((item) => item.id === selected);
      if (item) {
        setTagsValue([...TagsValue, item]);
        setSelected(0);
        OnRetorno([...TagsValue, item]);
      }
    }
  };

  const handleDeleteItem = (id: number) => {
    const item = TagsValue.find((item) => item.id === id);
    if (item) {
      setTagsValue(TagsValue.filter((item) => item.id !== id));
      OnRetorno(TagsValue.filter((item) => item.id !== id));
    }
  }

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <>
      <Box w={"full"} minH={"6rem"}>
        {IsLoadingGeral && (
          <>
            <Flex
              w={"full"}
              h={"6rem"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box>
                <Center>
                  <CircularProgress
                    color="green.300"
                    isIndeterminate
                    size="5rem"
                  />
                </Center>
              </Box>
            </Flex>
          </>
        )}
        {!IsLoadingGeral && isAdmin && (
          <FormControl w={"full"}>
            <FormLabel fontSize="sm" display="flex" alignItems="center" gap={1}>
              {label}
              {required && (
                <Text as="span" fontSize="xs" color="red.500">
                  *
                </Text>
              )}
            </FormLabel>
            <Flex gap={2}>
              <Select
                onChange={(e) => setSelected(Number(e.target.value))}
                placeholder="Selecione"
                size="md"
                {...props}
              >
                {Options.map((item: any, index: number) => (
                  <option key={index} value={item.id}>
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
              {TagsValue?.map((item) => (
                <Tag
                  key={item.id}
                  size={"lg"}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <TagLabel>{item.label || item.descricao}</TagLabel>
                  <TagCloseButton onClick={() => handleDeleteItem(item.id)} />
                </Tag>
              ))}
            </Flex>
          </FormControl>
        )}
        {!IsLoadingGeral && !isAdmin && (
          <Flex
            w={"full"}
            h={"6rem"}
            flexWrap={"wrap"}
          >
           {TagsValue?.map((item) => (
            <Tag
              key={item.id}
              size={"lg"}
              borderRadius="full"
              variant="solid"
              colorScheme="blue"
            >
              <TagLabel>{item.label || item.descricao}</TagLabel>
            </Tag>
           ))}
          </Flex>
        )}
      </Box>
    </>
  );
}
