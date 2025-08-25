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
import { BeatLoader } from "react-spinners";

interface BaseOption {
  /** Identificador único da opção */
  [key: string]: any;
}

interface SelectMultiItemProps<T extends BaseOption> {
  /** ID do elemento select */
  id: string;
  /** Rótulo do campo */
  label: string;
  /** Indica se o campo é obrigatório */
  required?: boolean;
  /** Largura do campo */
  boxWidth?: string;
  /** Lista de opções disponíveis */
  options: T[];
  /** URL para buscar os itens */
  fetchUrlGet?: string;
  /** Função que retorna a URL para adicionar um item */
  fetchUrlPost?: (id: string | number) => string;
  /** Função que retorna a URL para atualizar um item */
  fetchUrlPatch?: (id: string | number) => string;
  /** Função que retorna a URL para excluir um item */
  fetchUrlDelete?: (id: string | number) => string;
  /** Função chamada quando os itens são alterados */
  onChange?: (items: T[]) => void;
  /** Propriedades adicionais para o select */
  selectProps?: SelectProps;
  /** Nome do campo que será usado como valor (padrão: 'id') */
  valueField?: string;
  /** Nome do campo que será usado como label (padrão: 'label') */
  labelField?: string;
  /** Função para renderizar itens customizados */
  renderItem?: (item: T) => React.ReactNode;
}

export default function SelectMultiItem<T extends BaseOption>({
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
  valueField = "id",
  labelField = "label",
  renderItem,
  ...selectProps
}: SelectMultiItemProps<T>) {
  const [selected, setSelected] = useState<string | number>("");
  const [items, setItems] = useState<T[]>([]);
  const [deletingItemId, setDeletingItemId] = useState<string | number | null>(
    null
  );
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const find = options.find(
      (item) => String(item[valueField]) === String(selected)
    );
    if (
      find &&
      !items.some((i) => String(i[valueField]) === String(find[valueField]))
    ) {
      if (fetchUrlPost || fetchUrlPatch) {
        try {
          const url = fetchUrlPatch
            ? fetchUrlPatch(find[valueField])
            : fetchUrlPost!(find[valueField] as string | number);
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

  const handleDelete = async (item: T) => {
    setIsLoading(true);
    if (fetchUrlDelete) {
      try {
        setDeletingItemId(item[valueField]);
        const request = await fetch(fetchUrlDelete(item[valueField]), {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const response = await request.json();

        setDeletingItemId(null);
        const updated = items.filter((i) => i[valueField] !== item[valueField]);
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
        setIsLoading(false);
      } catch (error) {
        setDeletingItemId(null);
        toast({
          title: "Erro",
          description: "Erro ao excluir o item.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    } else {
      const updated = items.filter((i) => i[valueField] !== item[valueField]);
      setItems(updated);
      onChange && onChange(updated);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fetchUrlGet) {
      (async () => {
        const req = await fetch(fetchUrlGet);
        if (!req.ok || req.status === 204) {
          setItems([]);
          onChange && onChange([]);
          return;
        }

        try {
          const res = await req.json();

          const resData = Array.isArray(res) ? res : res ? [res] : [];

          const data = resData
            .map((item: any) => ({
              [valueField]: item.id,
              [labelField]: item.descricao || item.label || item.fantasia,
            }))
            .filter(
              (item: any) =>
                item[valueField] !== undefined && item[valueField] !== null
            ) as T[];

          setItems(data);
          onChange && onChange(data);
        } catch (error) {
          setItems([]);
          onChange && onChange([]);
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
          {options.map((item, index) => (
            <option key={item[valueField] ?? index} value={item[valueField]}>
              {renderItem ? renderItem(item) : item[labelField]}
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
          disabled={isLoading}
        />
      </Flex>

      <Flex gap={2} mt={3} flexWrap="wrap">
        {items.map((item, index) => (
          <Tag
            key={item[valueField] ?? index}
            size={"lg"}
            borderRadius="full"
            variant="solid"
            colorScheme="blue"
          >
            {deletingItemId === item[valueField] ? (
              <BeatLoader size={8} color="white" />
            ) : (
              <>
                <TagLabel>
                  {renderItem ? renderItem(item) : item[labelField]}
                </TagLabel>
                <TagCloseButton
                  onClick={() => handleDelete(item)}
                  isDisabled={deletingItemId === item[valueField]}
                />
              </>
            )}
          </Tag>
        ))}
      </Flex>
    </FormControl>
  );
}
