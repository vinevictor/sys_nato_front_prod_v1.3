"use client";
import useUserRegisterContext from "@/hook/useUserRegister";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Select,
  SelectProps,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { BeatLoader } from "react-spinners";

interface SelectUserFinanceiraProps extends SelectProps {
  setValue: any;
}

export function SelectUserFinanceira({
  setValue,
  ...props
}: SelectUserFinanceiraProps) {
  const [Financeira, setFinanceira] = useState<number>(0);
  const [FinanceiraData, setFinanceiraData] = useState([]);
  const [FinanceiraArray, setFinanceiraArray] = useState<any>([]);
  const [FinanceiraArrayTotal, setFinanceiraArrayTotal] = useState<any>([]);
  const [FinanceiraDisabled, setFinanceiraDisabled] = useState(false);
  const { setFinanceiraCX } = useUserRegisterContext();

  const toast = useToast();

  useEffect(() => {
    const getFinanceira = async () => {
      const response = await fetch("/api/financeira/getall");
      const data = await response.json();
      setFinanceiraData(data);
    };
    getFinanceira();

    if (setValue) {
      const dataValue = setValue;
      if (dataValue.length > 0) {
        setFinanceiraArrayTotal(dataValue);
        setFinanceiraArray(dataValue.map((e: any) => e.id));
      }
    }
  }, [setValue]);

  const HandleSelectFinanceira = () => {
    const targetId = Number(Financeira);

    if (!targetId || targetId === 0) {
      toast({
        title: "Seleção inválida",
        description: "Por favor, selecione uma financeira antes de adicionar.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setFinanceiraDisabled(true);

    const Filtro = FinanceiraData.filter((e: any) => e.id === targetId);
    const Ids = Filtro.map((e: any) => e.id);

    setFinanceiraArray([...FinanceiraArray, ...Ids]);
    setFinanceiraArrayTotal([...FinanceiraArrayTotal, ...Filtro]);

    setFinanceira(0);
    setFinanceiraDisabled(false);
  };

  const RandBoard = FinanceiraArrayTotal.map((e: any) => {
    return (
      <Flex
        key={e.id}
        gap={1}
        border="1px solid"
        borderColor="blue.300"
        p={1}
        alignItems={"center"}
        borderRadius={9}
        bg="blue.200"
        _dark={{
          bg: "blue.700",
          borderColor: "blue.500",
        }}
      >
        <Text
          fontSize={"0.6rem"}
          color="blue.800"
          _dark={{ color: "blue.100" }}
        >
          {e.fantasia}
        </Text>
        <Icon
          as={RxCross2}
          fontSize={"0.8rem"}
          onClick={() => {
            setFinanceiraArray(
              FinanceiraArray.filter((itemId: any) => itemId !== e.id)
            );
            setFinanceiraArrayTotal(
              FinanceiraArrayTotal.filter((item: any) => item.id !== e.id)
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

  // Filtra para remover as financeiras já adicionadas
  const financeirasDisponiveis = FinanceiraData.filter(
    (f: any) => !FinanceiraArray.includes(f.id)
  );

  return (
    <>
      <Flex gap={2}>
        <Select
          {...props}
          border="1px solid"
          borderColor="gray.400"
          borderTop={"none"}
          borderRight={"none"}
          borderLeft={"none"}
          borderRadius="0"
          bg="gray.100"
          color="gray.800"
          isDisabled={FinanceiraDisabled}
          onChange={(e: any) => setFinanceira(Number(e.target.value))}
          value={Financeira}
          _dark={{
            bg: "gray.700",
            borderColor: "gray.500",
            color: "gray.100",
          }}
          sx={{
            "& option": {
              bg: "white",
              color: "gray.800",
            },
            "&:is([data-theme='dark']) option, .chakra-ui-dark &option": {
              bg: "gray.800",
              color: "gray.100",
            },
          }}
        >
          <option value={0}>Selecione uma financeira</option>
          {financeirasDisponiveis.map((fin: any) => (
            <option key={fin.id} value={fin.id}>
              {fin.fantasia}
            </option>
          ))}
        </Select>
        <Button
          colorScheme="green"
          leftIcon={<FaPlus />}
          isLoading={FinanceiraDisabled}
          spinner={<BeatLoader size={8} color="white" />}
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
