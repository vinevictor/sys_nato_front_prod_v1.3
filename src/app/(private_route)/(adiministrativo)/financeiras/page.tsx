"use client";
export const dynamic = 'force-dynamic';

import Financeiras from "@/components/financeirasCard";
import { Box, Divider, Flex, Heading, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function PainelFinanceiro() {
  const [dados, setDados] = useState<any[]>([]);

  useEffect(() => {
    FetchData();
  }, []);

  const FetchData = async () => {
    try {
      const req = await fetch("/api/financeira/getall");
      const res = await req.json();
      if (!req.ok) {
        setDados([]);
      }
      setDados(res);
    } catch (error) {
      console.error("Erro ao buscar dados das construtoras:", error);
      setDados([]);
    }
  };
  return (
    <>
      <Flex
        w={"100%"}
        minH={"90.9dvh"}
        px={{ base: 2, md: "10rem" }}
        py={5}
        flexDir={"column"}
      >
        <Flex w={"100%"} justifyContent={"space-between"}>
          <Flex gap={2}>
            <Heading fontSize={"25px"}>CCAs</Heading>
          </Flex>
          <Flex gap={5}>
            <Link
              href={"/financeiras/cadastrar"}
              _hover={{ textDecoration: "none" }}
            >
              <Box
                py={2}
                px={7}
                border="3px solid green.600"
                borderRadius="8px"
                bg={"green.600"}
                color={"white"}
                _hover={{ bg: "green.500" }}
                boxShadow={"lg"}
                cursor={"pointer"}
              >
                Criar novo CCA
              </Box>
            </Link>
          </Flex>
        </Flex>
        <Divider my={5} />
        <Box w={"100%"}>
          <Flex
            w={"100%"}
            mb={8}
            justifyContent="center"
            alignItems="center"
          ></Flex>
          <Box>{dados ? <Financeiras data={dados} /> : <></>}</Box>
        </Box>
      </Flex>
    </>
  );
}
