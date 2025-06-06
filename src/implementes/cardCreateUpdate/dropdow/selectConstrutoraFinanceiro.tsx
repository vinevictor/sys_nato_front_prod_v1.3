"use client";

import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Select,
  SelectProps,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { BeatLoader } from "react-spinners";
interface SelectConstrutoraFinanceiroProps extends SelectProps {
  setValue: any;
}

export function SelectConstrutoraFinanceiro({
  setValue,
  ...props
}: SelectConstrutoraFinanceiroProps) {
  const [Construtora, setConstrutora] = useState<number | undefined>();
  const [ConstrutoraData, setConstrutoraData] = useState<any>([]);
  const [ConstrutoraArray, setConstrutoraArray] = useState<any>([]);
  const [ConstrutoraArrayTotal, setConstrutoraArrayTotal] = useState<any>([]);
  const [ConstrutoraDisabled, setConstrutoraDisabled] = useState(false);

  useEffect(() => {
    const getConstrutora = async () => {
      const req = await fetch("/api/construtora/getall");
      if (req.ok) {
        const data = await req.json();
        if (data) {
          setConstrutoraData(data);
        }
      } else {
        return { status: 500, message: "error", data: null };
      }
    };
    getConstrutora();

    if (setValue) {
      const dataValue = setValue;
      if (dataValue.length > 0) {
        const data = dataValue.map((e: any) => {
          return e.construtora;
        });

        setConstrutoraArrayTotal(data);
        setConstrutoraArray(dataValue);
      }
    }
  }, [setValue]);

  const HandleSelectConstrutora = () => {
    setConstrutoraDisabled(true);
    const value = Construtora;

    const Filtro = ConstrutoraData.filter((e: any) => e.id === Number(value));
    const Ids = Filtro.map((e: any) => e.id);

    setConstrutoraArray([...ConstrutoraArray, ...Ids]);
    setConstrutoraArrayTotal([...ConstrutoraArrayTotal, ...Filtro]);

    setConstrutoraDisabled(false);
  };

  const RandBoard = ConstrutoraArrayTotal.map((e: any) => {
    return (
      <Flex
        key={e.id}
        gap={1}
        border="1px solid #b8b8b8cc"
        p={1}
        alignItems={"center"}
        borderRadius={9}
        bg={"blue.200"}
      >
        <Text fontSize={"0.6rem"}>{e.fantasia}</Text>
        <Icon
          as={RxCross2}
          fontSize={"0.8rem"}
          onClick={() => {
            setConstrutoraArray(
              ConstrutoraArray.filter((item: any) => item !== e)
            );
            setConstrutoraArrayTotal(
              ConstrutoraArrayTotal.filter((item: any) => {
                return item !== e;
              })
            );
          }}
          cursor={"pointer"}
        />
      </Flex>
    );
  });

  return (
    <>
      <Flex gap={2}>
        <Select
          {...props}
          border="1px solid #b8b8b8cc"
          borderTop={"none"}
          borderRight={"none"}
          borderLeft={"none"}
          borderRadius="0"
          bg={"gray.100"}
          borderColor={"gray.400"}
          isDisabled={ConstrutoraDisabled}
          onChange={(e: any) => setConstrutora(Number(e.target.value))}
          value={Construtora}
        >
          <option style={{ backgroundColor: "#EDF2F7" }} value={0}>
            Selecione uma financeira
          </option>
          {ConstrutoraData.length > 0 &&
            ConstrutoraData.map((Construtora: any) => (
              <option
                style={{ backgroundColor: "#EDF2F7" }}
                key={Construtora.id}
                value={Construtora.id}
              >
                {Construtora.fantasia}
              </option>
            ))}
        </Select>
        <Button
          colorScheme="green"
          leftIcon={<FaPlus />}
          alignSelf={"center"}
          size={"sm"}
          isLoading={ConstrutoraDisabled}
          spinner={<BeatLoader size={8} color="white" />}
          fontSize={"0.7rem"}
          onClick={HandleSelectConstrutora}
        >
          Adicionar
        </Button>
      </Flex>
      <Flex gap={2} mt={3} flexWrap="wrap">
        {RandBoard}
      </Flex>
      <Box hidden>
        <Input
          name="construtora"
          value={ConstrutoraArrayTotal.map((e: any) => e.id)}
          readOnly
        />
      </Box>
    </>
  );
}
