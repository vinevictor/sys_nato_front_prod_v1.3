"use client";
import Loading from "@/app/loading";
import Alertas from "@/components/adm/alertas";
import CardAdmUsuario from "@/components/adm/card";

import RelatorioFinanceiro from "@/components/adm/financeiro/RelatorioFinanceiro";
import ModalAddAlerta from "@/components/adm/modal/add_alerta";
import ModalAddCobranca from "@/components/adm/modal/add_cobranca";
import { useSession } from "@/hook/useSession";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuBuilding, LuDollarSign, LuFileText, LuUsers } from "react-icons/lu";

interface RelatorioType {
  usuarios: number;
  construtoras: number;
  relatorios: number;
  cobrancas_aberto: string;
}

export default function PainelAdministrativo() {
  const [dados, setDados] = useState<RelatorioType | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const session = useSession();

  useEffect(() => {
    if (!dados) {
      setLoading(true);
    }
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const req = await fetch("/api/relatorio/getall");
      const res = await req.json();
      setDados(res);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {dados && (
        <Box
          w={"full"}
          px={{ base: 2, md: 4 }}
          py={{ base: 4, md: 8 }}
          overflow={"auto"}
          bg="white"
        >
          <Box
            w={"full"}
            maxWidth="container.2xl"
            mx="auto"
            bg="gray.50"
            borderRadius={"1rem"}
            boxShadow={"2xl"}
            p={{ base: 4, md: 8 }}
          >
            <VStack spacing={{ base: 6, md: 8 }} align="stretch">
              <Box>
                <Heading fontSize={{ base: "xl", md: "2xl" }}>
                  Painel Administrativo
                </Heading>
              </Box>

              {session?.role.relatorio && (
                <>
                  <Flex
                    w={"100%"}
                    justifyContent={{ base: "center", md: "flex-end" }}
                    gap={2}
                    wrap="wrap"
                  >
                    <ModalAddCobranca />
                    <ModalAddAlerta />
                  </Flex>

                  <SimpleGrid
                    columns={{ base: 1, sm: 2, lg: 4 }}
                    spacing={{ base: 4, md: 6 }}
                  >
                    <CardAdmUsuario
                      count={dados.usuarios}
                      title={"Usuários"}
                      icon={<LuUsers size={24} />}
                    />
                    <CardAdmUsuario
                      count={dados.construtoras}
                      title={"Construtoras"}
                      icon={<LuBuilding size={24} />}
                    />
                    <CardAdmUsuario
                      count={dados.cobrancas_aberto}
                      title={"Cobranças em Aberto"}
                      icon={<LuDollarSign size={24} />}
                    />
                    <CardAdmUsuario
                      count={dados.relatorios}
                      title={"Relatórios Gerados"}
                      icon={<LuFileText size={24} />}
                    />
                  </SimpleGrid>

                  <Flex
                    direction={{ base: "column", lg: "row" }}
                    gap={{ base: 6, md: 8 }}
                  >
                    <Box w={{ base: "100%", lg: "70%" }}>
                      <RelatorioFinanceiro onAtualizar={fetchDados} />
                    </Box>
                    <Box w={{ base: "100%", lg: "30%" }}>
                      <Alertas />
                    </Box>
                  </Flex>
                </>
              )}
            </VStack>
          </Box>
        </Box>
      )}
    </>
  );
}
