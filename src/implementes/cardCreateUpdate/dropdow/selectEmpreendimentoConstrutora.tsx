"use client";
import useEmpreendimentoContext from "@/hook/useEmpreendimentoContext";
import { Flex, Select, SelectProps, chakra, useToast } from "@chakra-ui/react";
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

/**
 * Select de Construtoras do Empreendimento
 *
 * Busca a lista de construtoras da API e permite seleção.
 * Suporta tema claro e escuro com cores e estilos adaptativos.
 *
 * Estados visuais:
 * - Hover: Verde (#00713D no light, #00d672 no dark)
 * - Focus: Verde com shadow
 * - Dark mode: Background gray.700, texto gray.100
 *
 * @param setValue - ID da construtora inicial selecionada
 */
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
    <Flex gap={2} width="100%">
      <Select
        {...props}
        name="empreendimentoConstrutora"
        variant="flushed"
        borderColor="gray.400"
        bg="gray.100"
        px={1}
        onChange={(e: any) => {
          const selectedId = Number(e.target.value);
          setConstrutora(selectedId);
          handleConstrutoraChange(selectedId);
        }}
        value={Construtora}
        rounded={"sm"}
        _dark={{
          bg: "gray.700",
          borderColor: "gray.600",
          color: "gray.100",
        }}
      >
        <chakra.option ps={2} _dark={{ color: "gray.800" }} value={0}>Selecione uma construtora</chakra.option>
        {ConstrutoraData.length > 0 &&
          ConstrutoraData.map((construtora) => (
            <chakra.option ps={2} key={construtora.id} _dark={{ color: "gray.800" }} value={construtora.id}>
              {construtora.fantasia}
            </chakra.option>
          ))}
      </Select>
    </Flex>
  );
}
