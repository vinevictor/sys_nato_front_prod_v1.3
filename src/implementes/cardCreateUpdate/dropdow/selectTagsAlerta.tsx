"use client";
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Input,
  Select,
  SelectProps,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

interface SelectTagsAlertaProps extends SelectProps {
  setValue: number;
}

export function SelectTagsAlerta({
  setValue,
  ...props
}: SelectTagsAlertaProps) {
  const [Tag, setTag] = useState<number>(0);
  const [Tags, setTags] = useState<any>([]);
  const [TagsOptions, setTagsOptions] = useState<any>([]);
  const toast = useToast();

  const fetchTags = async () => {
    const request = await fetch(`/api/tag-list`);
    const response = await request.json();
    if (!request.ok) {
      setTags([]);
      return;
    }
    const data = response?.map((item: any) => {
      return { id: item.id, label: item.descricao };
    });
    setTags(data);
  };

  const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const value = Tag;

    const filter = TagsOptions.filter((item: any) => item.id === Number(value));
    setTags([...Tags, ...filter]);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    (async () => {
      const request = await fetch("/api/tags/getall");
      const response = await request.json();
      setTagsOptions(response);
    })();
  });
  const RendBoard = Tags.map((item: any) => {
    const DeleteTag = async () => {
      const request = await fetch(`/api/tags/delete/${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const response = await request.json();
      if (!request.ok) {
        toast({
          title: "ops!",
          description: "Tag removida! Lembre-se de salvar as alterações",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        const filter = Tags.filter((f: any) => f.id !== item.id);
        setTags(filter);
      } else {
        const filter = Tags.filter((f: any) => f.id !== item.id);
        setTags(filter);
        toast({
          title: "exclusão realizada",
          description: response.message + "! Lembre-se de salvar as alterações",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    return (
      <>
        <Flex
          gap={1}
          border="1px solid #b8b8b8cc"
          p={1}
          alignItems={"center"}
          borderRadius={9}
          bg={"blue.200"}
        >
          <Text fontSize={"0.6rem"}>{item.label}</Text>
          <Icon
            as={RxCross2}
            fontSize={"0.8rem"}
            onClick={DeleteTag}
            cursor={"pointer"}
          />
        </Flex>
      </>
    );
  });

  useEffect(() => {
    (async () => {
      const request = await fetch(`/api/tags/getallid/${setValue}`);
      const response = await request.json();
      console.log(response);
      if (!request.ok) {
        setTags([]);
        return;
      }
      const data = response?.map((item: any) => {
        return { id: item.id, label: item.descricao };
      });
      setTags(data);
    })();
  }, [setValue]);

  const styleComponentes = {
    background: "#EDF2F7",
  };
  return (
    <>
      <Flex gap={2}>
        <Select
          onChange={(e) => setTag(Number(e.target.value))}
          size={"sm"}
          bg={"gray.100"}
          {...props}
        >
          <option style={styleComponentes} value={0}>
            Selecione uma Tag
          </option>
          {TagsOptions.map((item: any) => (
            <option style={styleComponentes} key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </Select>
        <IconButton
          aria-label={"adicionar"}
          icon={<FaPlusCircle />}
          size={"sm"}
          colorScheme="green"
          onClick={handleUpdate}
        />
      </Flex>
      <Flex gap={3} mt={4} flexWrap="wrap">
        {RendBoard}
      </Flex>
      <Box hidden>
        <Input
          name="Tags"
          type="text"
          value={JSON.stringify(Tags)}
          hidden
          readOnly
        />
      </Box>
    </>
  );
}
