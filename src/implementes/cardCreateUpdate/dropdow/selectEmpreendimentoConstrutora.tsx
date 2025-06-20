"use client";
import useEmpreendimentoContext from "@/hook/useEmpreendimentoContext";
import { Flex, Select, SelectProps, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface SelectUserConstrutoraProps extends SelectProps {
  setValue: any;
}

interface EmpreendimentoConstrutoraProps {
  id: number;
  cnpj: string;
  razaosocial: string;
  tel: string | null;
  email: string | null;
  atividade: string | null;
  fantasia: string | null;
}

export function SelectEmpreendimentoConstrutora({
  setValue,
  ...props
}: SelectUserConstrutoraProps) {
  const [Construtora, setConstrutora] = useState<number | any>();
  const [ConstrutoraData, setConstrutoraData] = useState<
    EmpreendimentoConstrutoraProps[]
  >([]);
  const toast = useToast();

  const { setConstrutoraTag } = useEmpreendimentoContext();

  function handleConstrutoraChange(selectedId: number) {
    const selectedConstrutora = ConstrutoraData.find(
      (construtora) => construtora.id === selectedId
    );
    if (selectedConstrutora) {
      setConstrutoraTag(selectedConstrutora.fantasia);
    } else {
      setConstrutoraTag(null);
    }
  }

  const getConstrutora = async () => {
    try {
      const req = await fetch("/api/construtora/getall");
      const res = await req.json();
      setConstrutoraData(res);
    } catch (error: any) {
      console.log("🚀 ~ getConstrutora ~ error:", error);
      toast({
        title: "Erro",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getConstrutora();

    if (setValue) {
      setConstrutora(setValue);
    }
  }, [setValue]);

  return (
    <>
      <Flex gap={2}>
        <Select
          {...props}
          name="empreendimentoConstrutora"
          border="1px solid #b8b8b8cc"
          borderTop={"none"}
          borderRight={"none"}
          borderLeft={"none"}
          borderRadius="0"
          bg={"gray.100"}
          borderColor={"gray.400"}
          onChange={(e: any) => {
            const selectedId = Number(e.target.value);
            setConstrutora(selectedId);
            handleConstrutoraChange(selectedId);
          }}
          value={Construtora}
        >
          <option style={{ backgroundColor: "#EDF2F7" }} value={0}>
            Selecione uma construtora
          </option>
          {ConstrutoraData.length > 0 &&
            ConstrutoraData.map((construtora) => (
              <option
                style={{ backgroundColor: "#EDF2F7" }}
                key={construtora.id}
                value={construtora.id}
              >
                {construtora.fantasia}
              </option>
            ))}
        </Select>
      </Flex>
    </>
  );
}
