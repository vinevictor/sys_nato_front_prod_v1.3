"use client";
import Empreendimentos from "@/components/empreendimentoCard";
import { useSession } from "@/hook/useSession";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function EmpreendimentoPage() {
  const [empreendimentos, setEmpreendimentos] = useState([]);
  const toast = useToast();
  const session = useSession();
  console.log("🚀 ~ EmpreendimentoPage ~ session:", session)

  useEffect(() => {
    fetchEmpreendimentos();
  }, []);

  const fetchEmpreendimentos = async () => {
    const response = await fetch("/api/empreendimento/getall");
    const data = await response.json();
    if (!response.ok) {
      toast({
        title: "Erro!",
        description: data,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setEmpreendimentos([]);
    } else {
      toast({
        title: "Sucesso!",
        description: "Empreendimentos carregados com sucesso!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setEmpreendimentos(data);
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
        <Flex w={"100%"} justifyContent={"space-around"}>
          <Flex gap={2}>
            <Heading>Empreendimentos</Heading>
          </Flex>
          <Link
            href={"/empreendimentos/cadastrar"}
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
              Criar Empreendimento
            </Box>
          </Link>
        </Flex>
        <Divider my={5} />
        <Box ml={4}>
          <Text fontSize="25px" fontWeight="bold" color="#333333">
            EMPREENDIMENTOS CADASTRADOS
          </Text>
        </Box>
        <Box w={"100%"} overflow={"auto"}>
          <Box>
            {empreendimentos ? (
              <Empreendimentos data={empreendimentos} />
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </Flex>
    </>
  );
}
