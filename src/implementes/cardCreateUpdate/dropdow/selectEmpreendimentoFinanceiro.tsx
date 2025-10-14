"use client";
import useEmpreendimentoContext from "@/hook/useEmpreendimentoContext";

import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Select,
  SelectProps,
  Text,
  chakra, 
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { BeatLoader } from "react-spinners";
interface SelectEmpreendimentoFinanceiroProps extends SelectProps {
  setValue: any;
}

export function SelectEmpreendimentoFinanceiro({
  setValue,
  ...props
}: SelectEmpreendimentoFinanceiroProps) {
  const [Financeira, setFinanceira] = useState<number | undefined>();
  const [FinanceiraData, setFinanceiraData] = useState<any>([]);
  const [FinanceiraArray, setFinanceiraArray] = useState<any>([]);
  const [FinanceiraArrayTotal, setFinanceiraArrayTotal] = useState<any>([]);
  const [FinanceiraDisabled, setFinanceiraDisabled] = useState(false);
  const { setFinanceiraCX } = useEmpreendimentoContext();

  useEffect(() => {
    const getFinanceira = async () => {
      const req = await fetch("/api/financeira/getall");
      if (req.ok) {
        const data = await req.json();
        if (data) {
          setFinanceiraData(data);
        }
      } else {
        return { status: 500, message: "error", data: null };
      }
    };
    getFinanceira();

    if (setValue) {
      const dataValue = setValue;
      if (dataValue.length > 0) {
        const data = dataValue.map((e: any) => {
          return e.financeiro;
        });

        setFinanceiraArrayTotal(data);
        setFinanceiraArray(dataValue);
      }
    }
  }, [setValue]);

  const HandleSelectFinanceira = () => {
    setFinanceiraDisabled(true);
    const value = Financeira;

    const Filtro = FinanceiraData.filter((e: any) => e.id === Number(value));
    const Ids = Filtro.map((e: any) => e.id);

    setFinanceiraArray([...FinanceiraArray, ...Ids]);
    setFinanceiraArrayTotal([...FinanceiraArrayTotal, ...Filtro]);

    setFinanceiraDisabled(false);
  };

  const RandBoard = FinanceiraArrayTotal.map((e: any) => {
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
            setFinanceiraArray(
              FinanceiraArray.filter((item: any) => item !== e)
            );
            setFinanceiraArrayTotal(
              FinanceiraArrayTotal.filter((item: any) => {
                return item !== e;
              })
            );
          }}
          cursor={"pointer"}
        />
      </Flex>
    );
  });

  useEffect(() => {
    if (setFinanceiraCX && typeof setFinanceiraCX === "function") {
      setFinanceiraCX(FinanceiraArray);
    }
  }, [FinanceiraArray, setFinanceiraCX]);

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
          _dark={{
            bg: "gray.700",
            borderColor: "gray.600",
            color: "gray.100",
            _hover: {
              borderColor: "#00d672",
            },
          }}
          borderColor={"gray.400"}
          isDisabled={FinanceiraDisabled}
          onChange={(e: any) => setFinanceira(Number(e.target.value))}
          value={Financeira}
        >
          <chakra.option _dark={{ color: "gray.800" }} value={0}>
            Selecione uma financeira
          </chakra.option>
          {FinanceiraData.length > 0 &&
            FinanceiraData.map((Financeira: any) => (
              <chakra.option
                _dark={{ color: "gray.800" }}
                key={Financeira.id}
                value={Financeira.id}
              >
                {Financeira.fantasia}
              </chakra.option>
            ))}
        </Select>
        <Button
          colorScheme="green"
          leftIcon={<FaPlus />}
          alignSelf={"center"}
          size={"sm"}
          isLoading={FinanceiraDisabled}
          spinner={<BeatLoader size={8} color="white" />}
          fontSize={"0.7rem"}
          onClick={HandleSelectFinanceira}
        >
          Adicionar
        </Button>
      </Flex>
      <Flex gap={2} mt={3} flexWrap="wrap">
        {RandBoard}
      </Flex>
      <Box hidden>
        <Input
          name="financeira"
          value={FinanceiraArrayTotal.map((e: any) => e.id)}
          readOnly
        />
      </Box>
    </>
  );
}
