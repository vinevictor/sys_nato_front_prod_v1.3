"use client";
import Loading from "@/app/loading";
import { BotaoRetorno } from "@/components/botoes/btm_retorno";
import Construtora from "@/components/construtora_compoment";
import { useSession } from "@/hook/useSession";

import { Box, Divider, Flex, Heading, Link, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConstrutoraPage() {
  const [Dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      if (session?.hierarquia === "ADM") {
        FetchData();
        setLoading(false);
      } else if (session?.hierarquia === "CCA") {
        const data = session?.construtora
          .map((c) => FetchDataId(c.id))
          .filter((d) => d !== null);
        setDados(data);
        setLoading(false);
      } else if (session?.hierarquia === "GRT") {
        const data = session?.construtora
          .map((c) => FetchDataId(c.id))
          .filter((d) => d !== null);
        setDados(data);
        setLoading(false);
      } else {
        router.push("/");
      }
    }
  }, [session]);

  const FetchData = async () => {
    try {
      const req = await fetch("/api/construtora/getall");
      const res = await req.json();
      setDados(res);
    } catch (error) {
      console.error("Erro ao buscar dados das construtoras:", error);
    }
  };

  const FetchDataId = async (id: number) => {
    try {
      const req = await fetch(`/api/construtora/get/${id}`);
      if (!req.ok) {
        console.error("Erro ao buscar dados da construtora:", req.statusText);
        return null;
      }
      const res = await req.json();
      return res;
    } catch (error) {
      console.error("Erro ao buscar dados das construtoras:", error);
      return null;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Construtoras</title>
        <meta name="description" content="Lista de construtoras cadastradas" />
      </Head>

      <Flex
        w={"100%"}
        minH={"90.9dvh"}
        px={{ base: 2, md: "10rem" }}
        py={5}
        flexDir={"column"}
      >
        <Flex w={"100%"} justifyContent={"space-around"}>
          <Flex gap={2}>
            <Box zIndex={1} alignSelf="baseline" position="initial">
              <BotaoRetorno rota="/" />
            </Box>
            <Heading>Construtora</Heading>
          </Flex>
          <Link
            href={"/construtoras/cadastrar"}
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
              Criar Construtora
            </Box>
          </Link>
        </Flex>
        <Divider my={5} />
        <Box ml={4}>
          <Text fontSize="25px" fontWeight="bold" color="#333333">
            CONSTRUTORA CADASTRADAS
          </Text>
        </Box>
        <Box w={"100%"}>
          {Dados.length === 0 ? (
            <Text>Nenhuma Construtora cadastrada</Text>
          ) : (
            <Construtora data={Dados} />
          )}
        </Box>
      </Flex>
    </>
  );
}
