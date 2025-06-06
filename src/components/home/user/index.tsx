import { BugReport } from "@/components/bug";
import { Flex, FormLabel, Link, Text } from "@chakra-ui/react";
import { mask } from "remask";
import { BtnListNow } from "../imputs/BtnListNow";
import BtnAlertList from "../imputs/BtnAlertList";

interface UserCompomentInfoProps {
  session: SessionNext.Client;
}

export const UserCompomentInfo = ({ session }: UserCompomentInfoProps) => {
  return (
    <>
      {session && (
        <Flex
          display={{ base: "none", "xl": "flex" }}
          w={"20%"}
          minH={"100%"}
          borderRight="1px solid"
          borderColor="gray.300"
          p={3}
          flexDir="column"
          gap={4}
        >
          <BugReport />
          <Flex gap={4}>
            <Flex flexDir="column" py={0} px={2} lineHeight={"1rem"}>
              <FormLabel fontWeight={"bold"}>Id</FormLabel>
              <Text>{session.id}</Text>
            </Flex>
            <Flex flexDir="column" px={2} lineHeight={"1rem"}>
              <FormLabel fontWeight={"bold"}>Nome</FormLabel>
              <Text>{session.nome}</Text>
            </Flex>
            <Flex flexDir="column" px={2} lineHeight={"1rem"}>
              <FormLabel fontWeight={"bold"}>Cargo</FormLabel>
              <Text>{session.cargo.toUpperCase()}</Text>
            </Flex>
          </Flex>
          <Flex gap={4}>
            <Flex flexDir="column" px={2} lineHeight={"1rem"}>
              <FormLabel fontWeight={"bold"}>Telefone</FormLabel>
              <Text>{mask(session.telefone, "(99) 9 9999-9999")}</Text>
            </Flex>
            <Flex flexDir="column" px={2} lineHeight={"1rem"}>
              <FormLabel fontWeight={"bold"}>Hierarquia</FormLabel>
              <Text>{session.hierarquia}</Text>
            </Flex>
          </Flex>
          <Flex gap={2} flexWrap={"wrap"}>
            {session.construtora.length > 1 &&
              session.construtora.map(
                (item: SessionNext.Construtora, index: number) => (
                  <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                    <FormLabel fontWeight={"bold"}>
                      Construtora {index + 1}
                    </FormLabel>
                    <Text>{item.fantasia}</Text>
                  </Flex>
                )
              )}
            {session.construtora.length === 1 &&
              session.construtora.map((item: SessionNext.Construtora) => (
                <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                  <FormLabel fontWeight={"bold"}>Construtora</FormLabel>
                  <Text>{item.fantasia}</Text>
                </Flex>
              ))}
            {session.empreendimento.length > 1 &&
              session.empreendimento.map(
                (item: SessionNext.Empreendimento, index: number) => (
                  <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                    <FormLabel fontWeight={"bold"}>
                      Empreendimento {index + 1}
                    </FormLabel>
                    <Text>{item.nome}</Text>
                  </Flex>
                )
              )}
            {session.empreendimento.length === 1 &&
              session.empreendimento.map((item: SessionNext.Empreendimento) => (
                <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                  <FormLabel fontWeight={"bold"}>Empreendimento</FormLabel>
                  <Text>{item.nome}</Text>
                </Flex>
              ))}
            {session.Financeira.length > 1 &&
              session.Financeira.map(
                (item: SessionNext.Financeira, index: number) => (
                  <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                    <FormLabel fontWeight={"bold"}>
                      Financeira {index + 1}
                    </FormLabel>
                    <Text>{item.fantasia}</Text>
                  </Flex>
                )
              )}
            {session.Financeira.length === 1 &&
              session.Financeira.map((item: SessionNext.Financeira) => (
                <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                  <FormLabel fontWeight={"bold"}>Financeira</FormLabel>
                  <Text>{item.fantasia}</Text>
                </Flex>
              ))}
          </Flex>
          <Flex gap={2} w={"100%"} flexDir={"column"}>
            {session.role?.now && <BtnListNow session={session} />}
            {session.role?.alert && <BtnAlertList session={session} />}
            <Link
              w={"100%"}
              color="white"
              textAlign="center"
              p={"8px"}
              href="/chamado"
              bg="blue.500"
              fontWeight="bold"
              borderRadius="md"
              fontSize={"1rem"}
              _hover={{ bg: "blue.600" }}
            >
              Chamados
            </Link>
          </Flex>
        </Flex>
      )}
    </>
  );
};
