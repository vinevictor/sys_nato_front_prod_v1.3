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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { BeatLoader } from "react-spinners";

interface SelectUserEmpreendimentoProps extends SelectProps {
  setValue: any;
}

export function SelectUserEmpreendimento({
  setValue,
  ...props
}: SelectUserEmpreendimentoProps) {
  const [Empreendimento, setEmpreendimento] = useState<number | undefined>();
  const [EmpreendimentoData, setEmpreendimentoData] = useState([]);
  const [EmpreendimentoArray, setEmpreendimentoArray] = useState<any>([]);
  const [EmpreendimentoArrayTotal, setEmpreendimentoArrayTotal] = useState<any>(
    []
  );
  const [EmpreendimentoDisabled, setEmpreendimentoDisabled] = useState(false);
  const { setEmpreedimentoCX } = useUserRegisterContext();

  useEffect(() => {
    const getEmpreendimento = async () => {
      const response = await fetch("/api/empreendimento/getall");
      const data = await response.json();
      setEmpreendimentoData(data);
    };
    getEmpreendimento();

    if (setValue) {
      const dataValue = setValue;
      if (dataValue.length > 0) {
        setEmpreendimentoArrayTotal(dataValue);
        setEmpreendimentoArray(dataValue);
      }
    }
  }, [setValue]);

  const HandleSelectEmpreendimento = () => {
    setEmpreendimentoDisabled(true);
    const value = Empreendimento;

    const Filtro = EmpreendimentoData.filter(
      (e: any) => e.id === Number(value)
    );
    const Ids = Filtro.map((e: any) => e.id);

    setEmpreendimentoArray([...EmpreendimentoArray, ...Ids]);
    setEmpreendimentoArrayTotal([...EmpreendimentoArrayTotal, ...Filtro]);

    setEmpreendimentoDisabled(false);
  };

  const RandBoard = EmpreendimentoArrayTotal.map((e: any) => {
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
        <Text fontSize={"0.6rem"}>{e.nome}</Text>
        <Icon
          as={RxCross2}
          fontSize={"0.8rem"}
          onClick={() => {
            setEmpreendimentoArray(
              EmpreendimentoArray.filter((item: any) => item !== e.id)
            );
            setEmpreendimentoArrayTotal(
              EmpreendimentoArrayTotal.filter((item: any) => item !== e)
            );
          }}
          cursor={"pointer"}
        />
      </Flex>
    );
  });

  useEffect(() => {
    setEmpreedimentoCX(EmpreendimentoArray);
  }, [EmpreendimentoArray, setEmpreedimentoCX]);

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
          isDisabled={EmpreendimentoDisabled}
          onChange={(e: any) => setEmpreendimento(e.target.value)}
          value={Empreendimento}
        >
          <option style={{ backgroundColor: "#EDF2F7" }} value={0}>
            Selecione um empreendimento
          </option>
          {EmpreendimentoData.length > 0 &&
            EmpreendimentoData.map((empreendimento: any) => (
              <option
                style={{ backgroundColor: "#EDF2F7" }}
                key={empreendimento.id}
                value={empreendimento.id}
              >
                {empreendimento.nome}
              </option>
            ))}
        </Select>
        <Button
          colorScheme="green"
          leftIcon={<FaPlus />}
          isLoading={EmpreendimentoDisabled}
          spinner={<BeatLoader size={8} color="white" />}
          onClick={HandleSelectEmpreendimento}
        >
          Adicionar
        </Button>
      </Flex>
      <Flex gap={2} mt={3} flexWrap="wrap">
        {RandBoard}
      </Flex>
      <Box hidden>
        <Input
          name="empreendimento"
          value={EmpreendimentoArrayTotal.map((e: any) => e.id)}
          readOnly
        />
      </Box>
    </>
  );
}
