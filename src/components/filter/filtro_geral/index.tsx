"use client";

import { Box, Button, Flex, Input, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SessionServer } from "@/types/session";

interface FiltroGeralProps {
  onData: any;
  session: SessionServer | null;
}

export const FiltroComponent = ({ onData, session }: FiltroGeralProps) => {
  const [FilterNome, setFilterNome] = useState<string>("");
  const [FilterAndamento, setFilterAndamento] = useState<string>("");
  const [FilterEmpreendimento, setFilterEmpreendimento] = useState<number>(0);
  const [FilterId, setFilterId] = useState<number>(0);
  const [FilterConstrutora, setFilterConstrutora] = useState<number>(0);
  const [FilterFinanceira, setFilterFinanceira] = useState<number>(0);
  const [DataEmpreendimento, setDataEmpreendimento] = useState<any>([]);
  const [DataConstrutora, setDataConstrutora] = useState<any>([]);
  const [DataFinanceira, setDataFinanceira] = useState<any>([]);

  const user = session?.user;

  useEffect(() => {
    if (user?.hierarquia === "ADM") {
      (async () => {
        const resq = await fetch(`/api/empreendimento/getall`);
        const data = await resq.json();
        setDataEmpreendimento(data);
      })();
      (async () => {
        const resq = await fetch(`/api/construtora/getall`);
        const data = await resq.json();
        setDataConstrutora(data);
      })();
      (async () => {
        const resq = await fetch(`/api/financeira/getall`);
        const data = await resq.json();
        setDataFinanceira(data);
      })();
    } else {
      if (user) {
        if (user.construtora.length > 0) {
          setDataConstrutora(user?.construtora);
        }

        if (user.empreendimento.length > 0) {
          setDataEmpreendimento(user?.empreendimento);
        }

        if (user.Financeira.length > 0) {
          setDataFinanceira(user?.Financeira);
        }
      }
    }
  }, [user]);

  const HandleFilter = () => {
    const data = {
      id: FilterId,
      nome: FilterNome,
      andamento: FilterAndamento,
      empreendimento: FilterEmpreendimento,
      construtora: FilterConstrutora,
      financeira: FilterFinanceira,
    };

    onData(data);
  };

  const HandleFilterBlank = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilterId(0);
    setFilterNome("");
    setFilterAndamento("");
    setFilterEmpreendimento(0);
    setFilterConstrutora(0);
    setFilterFinanceira(0);

    const data = {
      id: 0,
      nome: "",
      andamento: "",
      empreendimento: 0,
      construtora: 0,
      financeira: 0,
    };
    onData(data);
  };

  return (
    <Flex
      w="100%"
      justifyContent={{ base: "flex-start", md: "space-between" }}
      flexDirection={{ base: "column", md: "row" }} // Ajusta a direção da flexbox para diferentes tamanhos de tela
    >
      <Box w="125rem" h="100%" bg="#F8F8F8" mr={{ base: "0", md: "10px" }}>
        <Input
          textColor={"#00713D"}
          _hover={{ borderColor: "#00613C" }}
          borderColor={"#00713D"}
          placeholder="Nome"
          size="sm"
          borderRadius="1rem"
          type="text"
          value={FilterNome}
          onChange={(e) => {
            setFilterNome(e.target.value);
          }}
        />
      </Box>

      <Box w="70%" h="100%" bg="#F8F8F8" mr={{ base: "0", md: "10px" }}>
        <Input
          textColor={"#00713D"}
          _hover={{ borderColor: "#00613C" }}
          borderColor={"#00713D"}
          placeholder="id"
          size="sm"
          borderRadius="1rem"
          type="text"
          value={FilterId === 0 ? "" : FilterId}
          onChange={(e) => {
            setFilterId(Number(e.target.value.replace(/\D/g, "")));
          }}
        />
      </Box>

      <Box w="70%" h="100%" bg="#F8F8F8" mr={{ base: "0", md: "10px" }}>
        <Select
          textColor={"#00713D"}
          _hover={{ borderColor: "#00613C" }}
          borderColor={"#00713D"}
          placeholder="Andamento"
          size="sm"
          borderRadius="1rem"
          value={FilterAndamento}
          onChange={(e) => {
            setFilterAndamento(e.target.value);
          }}
        >
          <option value="VAZIO">VAZIO</option>
          <option value="INICIADO">INICIADO</option>
          <option value="APROVADO">APROVADO</option>
          <option value="EMITIDO">EMITIDO</option>
          <option value="REVOGADO">REVOGADO</option>
        </Select>
      </Box>

      <Box w="70%" h="100%" bg="#F8F8F8" mr={{ base: "0", md: "10px" }}>
        <Select
          textColor={"#00713D"}
          _hover={{ borderColor: "#00613C" }}
          borderColor={"#00713D"}
          placeholder="construtora"
          size="sm"
          borderRadius="1rem"
          value={FilterConstrutora}
          onChange={(e) => {
            setFilterConstrutora(Number(e.target.value));
          }}
        >
          {DataConstrutora.length > 0 &&
            DataConstrutora.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.fantasia}
              </option>
            ))}
        </Select>
      </Box>

      <Box w="85%" h="100%" bg="#F8F8F8" mr={{ base: "0", md: "10px" }}>
        <Select
          textColor={"#00713D"}
          _hover={{ borderColor: "#00613C" }}
          borderColor={"#00713D"}
          placeholder="Empreendimento"
          size="sm"
          borderRadius="1rem"
          value={FilterEmpreendimento}
          onChange={(e) => {
            setFilterEmpreendimento(Number(e.target.value));
          }}
        >
          {DataEmpreendimento.length > 0 &&
            DataEmpreendimento.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
        </Select>
      </Box>

      <Box w="65%" h="100%" bg="#F8F8F8" mr={{ base: "0", md: "10px" }}>
        <Select
          textColor={"#00713D"}
          _hover={{ borderColor: "#00613C" }}
          borderColor={"#00713D"}
          placeholder="financeira"
          size="sm"
          borderRadius="1rem"
          value={FilterFinanceira}
          onChange={(e) => {
            setFilterFinanceira(Number(e.target.value));
          }}
        >
          {DataFinanceira.length > 0 &&
            DataFinanceira.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.fantasia}
              </option>
            ))}
        </Select>
      </Box>
      <Flex w="full" h="100%" gap={"1rem"} ms={{ base: "0", md: "10px" }}>
        <Button
          bg="#00713D"
          w={{ base: "100%", md: "auto" }}
          textColor="white"
          variant="solid"
          _hover={{ bg: "#00631B" }}
          size="md"
          onClick={HandleFilter}
        >
          Filtrar
        </Button>
        <Button
          bg="#00713D"
          w={{ base: "100%", md: "auto" }}
          textColor="white"
          variant="solid"
          _hover={{ bg: "#00631B" }}
          size="md"
          onClick={HandleFilterBlank}
        >
          Limpar
        </Button>
      </Flex>
    </Flex>
  );
};
