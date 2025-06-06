"use client";
import { Box, Flex, IconButton, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa6";
import { mask } from "remask";
import React from "react";
import { BtnEditarFinanceira } from "../botoes/btn_editar_financeiras";
import { BtnExcluirFinanceira } from "../botoes/btn_excluir_financeira";

interface FinanceirasType {
  data: any;
}

export default function Financeiras({ data }: FinanceirasType) {
  const [Financeiras, setFinanceiras] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (data && data.length > 0) {
      setFinanceiras(data);
    }
  }, [data]);

  return (
    <>
      <Flex gap={4} flexWrap={"wrap"}>
        {Financeiras.map((solicitacao: any) => {
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
                    RAZÃO SOCIAL:
                  </Text>
                  {solicitacao.razaosocial}
                </Flex>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    CNPJ:
                  </Text>
                  {solicitacao.cnpj &&
                    mask(solicitacao.cnpj, ["99.999.999/9999-99"])}
                </Flex>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    FANTASIA:
                  </Text>
                  {solicitacao.fantasia}
                </Flex>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    TELEFONE:
                  </Text>
                  {solicitacao.tel &&
                    mask(solicitacao.tel, [
                      "(99) 9 9999-9999",
                      "(99) 9999-9999",
                    ])}
                  <IconButton
                    icon={<FaCopy />}
                    aria-label="copy"
                    size={"xs"}
                    bg={"blue.500"}
                    color={"white"}
                    onClick={() => {
                      navigator.clipboard.writeText(solicitacao.tel);
                      toast({
                        title: "Numero copiado!",
                        status: "info",
                        duration: 2000,
                        position: "top-right",
                      });
                    }}
                  />
                </Flex>
              </Flex>
              <Flex mt={3} gap={2} w="100%" justifyContent="end">
                <BtnEditarFinanceira id={solicitacao.id} />
                <BtnExcluirFinanceira id={solicitacao.id} />
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </>
  );
}
