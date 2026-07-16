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
  useToast, // Importação do Toast para alertas
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { BeatLoader } from "react-spinners";

interface SelectUserConstrutoraProps extends SelectProps {
  setValue: any;
}

export function SelectUserConstrutora({
  setValue,
  ...props
}: SelectUserConstrutoraProps) {
  const [Construtora, setConstrutora] = useState<number>(0);
  const [ConstrutoraData, setConstrutoraData] = useState([]);
  const [ConstrutoraArray, setConstrutoraArray] = useState<any>([]);
  const [ConstrutoraArrayTotal, setConstrutoraArrayTotal] = useState<any>([]);
  const [ConstrutoraDisabled, setConstrutoraDisabled] = useState(false);
  const { setContrutoraCX } = useUserRegisterContext();

  const toast = useToast(); // Instanciando o Toast

  useEffect(() => {
    const getConstrutora = async () => {
      const response = await fetch("/api/construtora/getall");
      const data = await response.json();
      setConstrutoraData(data);
    };
    getConstrutora();

    if (setValue) {
      const dataValue = setValue;
      if (dataValue.length > 0) {
        setConstrutoraArrayTotal(dataValue);
        setConstrutoraArray(dataValue.map((e: any) => e.id));
      }
    }
  }, [setValue]);

  const HandleSelectConstrutora = () => {
    const targetId = Number(Construtora);

    // Alerta caso tente adicionar sem selecionar nada
    if (!targetId || targetId === 0) {
      toast({
        title: "Seleção inválida",
        description: "Por favor, selecione uma construtora antes de adicionar.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setConstrutoraDisabled(true);

    const Filtro = ConstrutoraData.filter((e: any) => e.id === targetId);
    const Ids = Filtro.map((e: any) => e.id);

    setConstrutoraArray([...ConstrutoraArray, ...Ids]);
    setConstrutoraArrayTotal([...ConstrutoraArrayTotal, ...Filtro]);

    setConstrutora(0); // Reseta o select
    setConstrutoraDisabled(false);
  };

  const RendBoard = ConstrutoraArrayTotal.map((e: any) => {
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
            setConstrutoraArray(
              ConstrutoraArray.filter((itemId: any) => itemId !== e.id)
            );
            setConstrutoraArrayTotal(
              ConstrutoraArrayTotal.filter((item: any) => item.id !== e.id)
            );
          }}
          cursor={"pointer"}
        />
      </Flex>
    );
  });

  useEffect(() => {
    setContrutoraCX(ConstrutoraArray);
  }, [ConstrutoraArray, setContrutoraCX]);

  // Filtra a lista de construtoras para REMOVER as que já foram selecionadas
  const construtorasDisponiveis = ConstrutoraData.filter(
    (c: any) => !ConstrutoraArray.includes(c.id)
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
          isDisabled={ConstrutoraDisabled}
          onChange={(e: any) => setConstrutora(Number(e.target.value))}
          value={Construtora}
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
          <option value={0}>Selecione uma construtora</option>
          {construtorasDisponiveis.map((construtora: any) => (
            <option key={construtora.id} value={construtora.id}>
              {construtora.fantasia}
            </option>
          ))}
        </Select>
        <Button
          colorScheme="green"
          leftIcon={<FaPlus />}
          isLoading={ConstrutoraDisabled}
          spinner={<BeatLoader size={8} color="white" />}
          onClick={HandleSelectConstrutora}
        >
          Adicionar
        </Button>
      </Flex>
      <Flex gap={2} mt={3} flexWrap="wrap">
        {RendBoard}
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
