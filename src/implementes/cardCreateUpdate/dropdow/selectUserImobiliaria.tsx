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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

interface ImobiliariaOption {
  id: number;
  fantasia: string;
}

interface SelectUserImobiliariaProps extends SelectProps {
  setValue?: ImobiliariaOption[] | any;
}

/**
 * Multi-select de imobiliárias do usuário.
 * Envia os ids selecionados no input oculto `imobiliaria` (ex: "1,2").
 */
export function SelectUserImobiliaria({
  setValue,
  ...props
}: SelectUserImobiliariaProps) {
  const [Imobiliaria, setImobiliaria] = useState<number>(0);
  const [ImobiliariaData, setImobiliariaData] = useState<ImobiliariaOption[]>(
    []
  );
  const [Selecionadas, setSelecionadas] = useState<ImobiliariaOption[]>([]);
  const toast = useToast();

  useEffect(() => {
    const getImobiliarias = async () => {
      try {
        const response = await fetch("/api/imobiliaria/select");
        if (!response.ok) return;
        const data = await response.json();
        setImobiliariaData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar imobiliárias:", error);
      }
    };
    getImobiliarias();

    if (Array.isArray(setValue) && setValue.length > 0) {
      setSelecionadas(setValue);
    }
  }, [setValue]);

  const HandleSelectImobiliaria = () => {
    const targetId = Number(Imobiliaria);
    if (!targetId) {
      toast({
        title: "Seleção inválida",
        description: "Por favor, selecione uma imobiliária antes de adicionar.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    const item = ImobiliariaData.find((e) => e.id === targetId);
    if (item) {
      setSelecionadas([...Selecionadas, item]);
    }
    setImobiliaria(0);
  };

  const disponiveis = ImobiliariaData.filter(
    (i) => !Selecionadas.some((s) => s.id === i.id)
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
          onChange={(e: any) => setImobiliaria(Number(e.target.value))}
          value={Imobiliaria}
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
          <option value={0}>Selecione uma imobiliária</option>
          {disponiveis.map((imob) => (
            <option key={imob.id} value={imob.id}>
              {imob.fantasia}
            </option>
          ))}
        </Select>
        <Button
          colorScheme="green"
          leftIcon={<FaPlus />}
          onClick={HandleSelectImobiliaria}
        >
          Adicionar
        </Button>
      </Flex>
      <Flex gap={2} mt={3} flexWrap="wrap">
        {Selecionadas.map((e) => (
          <Flex
            key={e.id}
            gap={1}
            border="1px solid"
            borderColor="purple.300"
            p={1}
            alignItems={"center"}
            borderRadius={9}
            bg="purple.100"
            _dark={{
              bg: "purple.700",
              borderColor: "purple.500",
            }}
          >
            <Text
              fontSize={"0.6rem"}
              color="purple.800"
              _dark={{ color: "purple.100" }}
            >
              {e.fantasia}
            </Text>
            <Icon
              as={RxCross2}
              fontSize={"0.8rem"}
              onClick={() =>
                setSelecionadas(Selecionadas.filter((s) => s.id !== e.id))
              }
              cursor={"pointer"}
            />
          </Flex>
        ))}
      </Flex>
      <Box hidden>
        <Input
          name="imobiliaria"
          value={Selecionadas.map((e) => e.id).join(",")}
          readOnly
        />
      </Box>
    </>
  );
}
