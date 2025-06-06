import BotaoAdm from "@/components/botoes/bt_adm";
import { GetSessionServer } from "@/lib/auth_confg";
import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PAINEL ADMINISTRATIVO",
};

export default async function PainelAdmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await GetSessionServer();
  return (
    <>
      <Flex
        w={"100%"}
        h={"100%"}
        p={{ base: 0, md: 3 }}
        pt={{ base: 3, md: 3 }}
        gap={{ base: 0, md: 3 }}
        justifyContent={"space-between"}
        flexDir={{ base: "column", md: "row" }}
      >
        <Flex
          w={{ base: "100%", md: "10%" }}
          minW={"10%"}
          h={"100%"}
          flexDir={"column"}
        >
          <Box w={"100%"}>
            <Text color={"gray.400"} fontSize={"xl"} textAlign={"center"}>
              Gerenciamento
            </Text>
          </Box>
          <Divider
            my={5}
            border={"1px solid"}
            borderColor={"gray.300"}
            w={"100%"}
          />
          <Flex
            flexDir={{ base: "row", md: "column" }}
            w={"100%"}
            gap={2}
            flexWrap={{ base: "wrap", md: "nowrap" }}
            justifyContent={{ base: "center", md: "normal" }}
            alignItems={{ base: "center", md: "normal" }}
          >
            {session?.user.role?.user && <BotaoAdm name={"Usuarios"} />}
            {session?.user.role?.empreendimento && (
              <BotaoAdm name={"Empreendimentos"} />
            )}
            {session?.user.role?.construtora && <BotaoAdm name={"Construtora"} />}
            {session?.user.hierarquia === "ADM" && <BotaoAdm name={"CCAs"} />}
            {session?.user.hierarquia === "ADM" && <BotaoAdm name={"Tags"} />}
          </Flex>
        </Flex>
        <Flex w={{ base: "100%", md: "90%" }} minW={"90%"} h={"full"}>
          {children}
        </Flex>
      </Flex>
    </>
  );
}
