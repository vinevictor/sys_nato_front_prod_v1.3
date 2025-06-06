/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";

import React from "react";
import { useEffect, useState } from "react";
import {useSession} from "@/hook/useSession";

export default function CreateAlertGeral() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const session = useSession();
  const [DataFinanceiro, setDataFinanceiro] = useState<any>([]);
  const [DataConstrutora, setDataConstrutora] = useState<any>([]);
  const [DataEmpreendimento, setDataEmpreendimento] = useState<any>([]);
  const [Financeiro, setFinanceiro] = useState<number>(0);
  const [Construtora, setConstrutora] = useState<number>(0);
  const [Empreendimento, setEmpreendimento] = useState<number>(0);

  const user = session;

  const Handle = async () => {
    const reqest = await fetch(
      `/api/financeira/getFilter?financeiro=${Financeiro}&construtora=${Construtora}`
    );
    const data = await reqest.json();
    console.log(data);
    setDataEmpreendimento(data);
    if (data.length === 1) {
      setEmpreendimento(data[0].id);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.Financeira.length > 0) {
        setDataFinanceiro(user.Financeira);
        if (user.Financeira.length === 1) {
          setFinanceiro(Number(user.Financeira[0].id));
        }
      }
      if (user.construtora.length > 0) {
        setDataConstrutora(user.construtora);
        if (user.construtora.length === 1) {
          setConstrutora(Number(user.construtora[0].id));
        }
      }
    }
    if (Construtora > 0 && Financeiro > 0) {
      console.log(`id ${Construtora} ${Financeiro}`);
      Handle();
    }
  }, [user, Construtora, Financeiro]);

  return (
    <>
      <Box
        h={"100%"}
        borderRadius={"15px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"20px"}
      >
        <Link
          py={1}
          px={5}
          border="none"
          borderRadius="8px"
          bg={"green.600"}
          color={"white"}
          _hover={{ bg: "green.500", textDecoration: "none" }}
          boxShadow={"lg"}
          cursor={"pointer"}
          onClick={onOpen}
          fontSize={"0.8rem"}
        >
          Alerta Geral
        </Link>
      </Box>
      <Modal isOpen={isOpen} size={"xl"} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar Alerta Geral</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir={"column"} gap={5}>
              <FormControl>
                <FormLabel>Financeira</FormLabel>
                <Select
                  onChange={(e) => setFinanceiro(Number(e.target.value))}
                  placeholder="Selecione a financeira"
                  disabled={DataFinanceiro.length < 2}
                  value={Financeiro}
                >
                  {DataFinanceiro.length > 0 &&
                    DataFinanceiro.map((i: any) => {
                      return (
                        <>
                          <option key={i.id} value={i.id}>
                            {i.fantasia}
                          </option>
                        </>
                      );
                    })}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Construtora</FormLabel>
                <Select
                  onChange={(e) => setConstrutora(Number(e.target.value))}
                  placeholder="Selecione a Construtora"
                  disabled={DataConstrutora.length < 2}
                  value={Construtora}
                >
                  {DataConstrutora.length > 0 &&
                    DataConstrutora.map((i: any) => {
                      return (
                        <>
                          <option key={i.id} value={i.id}>
                            {i.fantasia}
                          </option>
                        </>
                      );
                    })}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Empreendimento</FormLabel>
                <Select
                  onChange={(e) => setEmpreendimento(Number(e.target.value))}
                  placeholder="Selecione o Empreendimento"
                  disabled={DataEmpreendimento.length < 2}
                  value={Empreendimento}
                >
                  {DataEmpreendimento.length > 0 &&
                    DataEmpreendimento.map((i: any) => {
                      return (
                        <>
                          <option key={i.id} value={i.id}>
                            {i.nome}
                          </option>
                        </>
                      );
                    })}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Empreendimento</FormLabel>
                <Input />
              </FormControl>

              <FormControl>
                <FormLabel>Empreendimento</FormLabel>
                <Input />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant="green" onClick={Handle}>
              Secondary Action
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
