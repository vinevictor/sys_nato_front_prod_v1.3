"use client";

import { Box, Flex, IconButton, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { FaCopy } from "react-icons/fa6";
import { mask } from "remask";
import { FiltroContext } from "@/context/UserFiltroContext";
import React from "react";
import { BtnExcluirUser } from "../botoes/btn_exluir_user";
import { BtnResetSenha } from "../botoes/btn_reset_senha";
import { BtnEditarUser } from "../botoes/btn_editar_user";
import { BtnAtivarUser } from "../botoes/btn_ativarUser";

interface UsuariosType {
  data: any;
}

export default function Usuarios({ data }: UsuariosType) {
  const [Usuarios, setUsuarios] = useState<any[]>([]);
  console.log("🚀 ~ Usuarios ~ Usuarios:", Usuarios)
  const toast = useToast();

  const { id, nome, construtora, financeira } = useContext(FiltroContext);

  useEffect(() => {
    const filtrarUsuarios = () => {
      let usuariosFiltrados = data;

      if (id) {
        usuariosFiltrados = usuariosFiltrados.filter((user: any) =>
          user.id.toString().startsWith(id.toString())
        );
      }

      if (nome) {
        usuariosFiltrados = usuariosFiltrados.filter((user: any) =>
          user.nome.toLowerCase().startsWith(nome.toLowerCase())
        );
      }
      if (construtora) {
        usuariosFiltrados = usuariosFiltrados.filter((user: any) =>
          user.construtora.map((i: any) => i.id).includes(construtora)
        );
      }
      if (financeira) {
        usuariosFiltrados = usuariosFiltrados.filter((user: any) =>
          user.Financeira.map((i: any) => i.id).includes(financeira)
        );
      }

      setUsuarios(usuariosFiltrados);
    };

    filtrarUsuarios();
  }, [id, nome, construtora, financeira, data]);

  return (
    <>
      <Flex
        w={"100%"}
        mb={8}
        justifyContent="center"
        alignItems="center"
      ></Flex>
      <Flex gap={4} flexWrap={"wrap"}>
        {Usuarios.map((solicitacao: UsuariosType.GetAllUsers) => {
          return (
            <Box
              key={solicitacao.id}
              border="3px solid #E8E8E8"
              borderRadius="8px"
              p={3}
              flexDir="column"
              w={{ base: "100%", md: "30%", lg: "20em" }}
              fontSize={"0.8rem"}
              bg={solicitacao.status ? "white" : "green.50"}
            >
              <Flex w="100%" flexDir={"column"} gap={4}>
                <Flex gap={2} align="center">
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
                    FUNÇÃO:
                  </Text>
                  {solicitacao.cargo}
                </Flex>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    HIERARQUIA:
                  </Text>
                  {solicitacao.hierarquia}
                </Flex>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    Telefone:
                  </Text>
                  {solicitacao.telefone &&
                    mask(solicitacao.telefone, [
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
                      navigator.clipboard.writeText(solicitacao.telefone);
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
              <Flex w="100%" flexWrap={"wrap"} gap={4} mt={2}>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    Construtora:
                  </Text>

                  {solicitacao.construtoras.length > 0 &&
                    solicitacao.construtoras
                      .map((item: any) => {
                        return item.construtora.fantasia;
                      })
                      .join(", ")}
                </Flex>
              </Flex>
              <Flex mt={3} gap={2} w="100%" justifyContent="end">
                {solicitacao.status ? null : (
                  <BtnAtivarUser id={solicitacao.id} />
                )}
                <BtnEditarUser id={solicitacao.id} />
                <BtnResetSenha ID={solicitacao.id} />
                <BtnExcluirUser id={solicitacao.id} />
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </>
  );
}
