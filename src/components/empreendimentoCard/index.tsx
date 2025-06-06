"use client";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BtnEditarEmpreendimento } from "../botoes/btn_editarEmpreendimento";
import BtnDesativarEmpreendimento from "../botoes/btn_excluir_empreendimento";
import { GrStatusCritical, GrStatusGood } from "react-icons/gr";

interface EmpreendimentosType {
  data: any;
}

export default function Empreendimentos({ data }: EmpreendimentosType) {
  const [Empreendimentos, setEmpreendimentos] = useState<any[]>([]);

  useEffect(() => {
    setEmpreendimentos(data);
  }, [data]);

  return (
    <>
      <Flex
        w={"100%"}
        mb={8}
        justifyContent="center"
        alignItems="center"
      ></Flex>
      <Flex gap={4} flexWrap={"wrap"}>
        {Empreendimentos.map((solicitacao: any) => {
          return (
            <Box
              key={solicitacao.id}
              border="3px solid #E8E8E8"
              borderRadius="8px"
              p={3}
              flexDir="column"
              w={{ base: "100%", md: "30%", lg: "20em" }}
              fontSize={"0.8rem"}
            >
              <Flex w="100%" flexDir={"column"} gap={4}>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    ID:
                  </Text>
                  {solicitacao.id}
                </Flex>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    NOME:
                  </Text>
                  {solicitacao.nome}
                </Flex>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    UF:
                  </Text>
                  {solicitacao.estado}
                </Flex>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    CIDADE:
                  </Text>
                  {solicitacao.cidade}
                </Flex>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    STATUS:
                  </Text>
                  <Icon
                    as={solicitacao.status ? GrStatusGood : GrStatusCritical}
                    color={solicitacao.status ? "green.500" : "red.500"}
                    mr={2}
                  />
                </Flex>
              </Flex>
              <Flex mt={3} gap={2} w="100%" justifyContent="end">
                <BtnDesativarEmpreendimento
                  id={solicitacao.id}
                  ativo={solicitacao.status}
                />
                <BtnEditarEmpreendimento id={solicitacao.id} />
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </>
  );
}
