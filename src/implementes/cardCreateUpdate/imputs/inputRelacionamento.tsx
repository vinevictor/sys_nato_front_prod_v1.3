"use client";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputProps,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { mask, unMask } from "remask";

interface InputRelacionamentoProps extends InputProps {
  setValueRelacionamento: any;
}

export function InputRelacionamento({
  setValueRelacionamento,
  ...props
}: InputRelacionamentoProps) {
  const [Relacionamento, setRelacionamento] = useState<string>("");
  const [RelacionamentoMask, setRelacionamentoMask] = useState<string>("");
  const [RelacionamentoData, setRelacionamentoData] = useState<any>([]);
  const Toast = useToast();

  useEffect(() => {
    setRelacionamentoData(setValueRelacionamento.relacionamento);
  }, [setValueRelacionamento.relacionamento]);

  const handleChange = async () => {
    const request = await fetch(`/api/consulta/cpf/${Relacionamento}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();
    const retorno = data.solicitacoes[0];

    if (request.ok) {
      const ArrayData = [
        ...RelacionamentoData,
        {
          id: retorno.id,
          cpf: retorno.cpf,
          name: retorno.name,
          email: retorno.email,
          createdAt: retorno.createdAt,
          dt_nascimento: retorno.dt_nascimento,
          telefone: retorno.telefone,
        },
      ];
      setRelacionamentoData(ArrayData);

      Toast({
        title: "Relacionamento adicionado",
        description: "Relacionamento adicionado com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setRelacionamento("");
    } else {
      Toast({
        title: "cpf não encontrado",
        description: "Cpf não tem cadastro no sistema",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (cpf: string) => {
    const Filer = RelacionamentoData.filter((item: any) => item.cpf !== cpf);
    setRelacionamentoData(Filer);
    Toast({
      title: "Relacionamento excluído",
      description: "Relacionamento excluído com sucesso",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const MaskCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const Limpo = unMask(value);
    const Mask = mask(Limpo, ["999.999.999-99"]);
    setRelacionamentoMask(Mask);
    setRelacionamento(Limpo);
  };

  return (
    <>
      <Flex gap={4}>
        <Input
          type="text"
          {...props}
          value={RelacionamentoMask}
          onChange={MaskCpf}
          size={"sm"}
        />
        <IconButton
          icon={<FaPlus />}
          aria-label={"Adicionar"}
          onClick={handleChange}
          colorScheme={"teal"}
          size={"sm"}
        />
      </Flex>
      <Flex>
        <Popover>
          <PopoverTrigger>
            <Button
              variant={"link"}
              fontWeight={"bold"}
              mt={2}
              _hover={{ color: "teal.700" }}
            >
              Relacionamentos (
              {RelacionamentoData &&
                RelacionamentoData.length > 0 &&
                RelacionamentoData.length}
              )
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Lista de Relacionamento</PopoverHeader>
            <PopoverBody>
              {RelacionamentoData &&
                RelacionamentoData.length > 0 &&
                RelacionamentoData.map((item: any) => (
                  <Flex justifyContent={"space-between"} key={item?.id}>
                    <Link
                      key={item?.id}
                      href={item?.id ? `/solicitacoes/${item.id}` : "#"}
                      color="teal.600"
                      fontWeight="bold"
                    >
                      {item?.cpf}
                    </Link>
                    <IconButton
                      icon={<FaRegTrashCan />}
                      aria-label={"remover"}
                      onClick={() => handleDelete(item?.cpf)}
                      colorScheme={"cyan"}
                      size={"xs"}
                    />
                  </Flex>
                ))}
              {RelacionamentoData && RelacionamentoData.length == 0 && (
                <Text fontWeight={"bold"}>
                  Cliente não possui relacionamento
                </Text>
              )}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
      <Box hidden>
        <Input
          value={JSON.stringify(
            RelacionamentoData && RelacionamentoData.map((item: any) => item?.cpf)
          )}
          name="Relacionamento"
          hidden
          readOnly
        />
      </Box>
    </>
  );
}
