import { BugReport } from "@/components/bug";
import { Flex, FormLabel, Text } from "@chakra-ui/react";
import { mask } from "remask";
import { BtnListNow } from "../imputs/BtnListNow";

interface UserCompomentInfoProps {
  session: SessionNext.Server | null;
}

export const UserCompomentInfo = ({ session }: UserCompomentInfoProps) => {
  return (
    <>
      {session && (
        <Flex
          display={{ base: "none", "2xl": "flex" }}
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
              <Text>{session.user.id}</Text>
            </Flex>
            <Flex flexDir="column" px={2} lineHeight={"1rem"}>
              <FormLabel fontWeight={"bold"}>Nome</FormLabel>
              <Text>{session.user.nome}</Text>
            </Flex>
            <Flex flexDir="column" px={2} lineHeight={"1rem"}>
              <FormLabel fontWeight={"bold"}>Cargo</FormLabel>
              <Text>{session.user.cargo.toUpperCase()}</Text>
            </Flex>
          </Flex>
          <Flex gap={4}>
            <Flex flexDir="column" px={2} lineHeight={"1rem"}>
              <FormLabel fontWeight={"bold"}>Telefone</FormLabel>
              <Text>{mask(session.user.telefone, "(99) 9 9999-9999")}</Text>
            </Flex>
            <Flex flexDir="column" px={2} lineHeight={"1rem"}>
              <FormLabel fontWeight={"bold"}>Hierarquia</FormLabel>
              <Text>{session.user.hierarquia}</Text>
            </Flex>
          </Flex>
          {session.user.construtora.length > 1 &&
            session.user.construtora.map(
              (item: SessionNext.Construtora, index: number) => (
                <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                  <FormLabel fontWeight={"bold"}>
                    Construtora {index + 1}
                  </FormLabel>
                  <Text>{item.fantasia}</Text>
                </Flex>
              )
            )}
          {session.user.construtora.length === 1 &&
            session.user.construtora.map((item: SessionNext.Construtora) => (
              <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                <FormLabel fontWeight={"bold"}>Construtora</FormLabel>
                <Text>{item.fantasia}</Text>
              </Flex>
            ))}
          {session.user.empreendimento.length > 1 &&
            session.user.empreendimento.map(
              (item: SessionNext.Empreendimento, index: number) => (
                <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                  <FormLabel fontWeight={"bold"}>
                    Empreendimento {index + 1}
                  </FormLabel>
                  <Text>{item.nome}</Text>
                </Flex>
              )
            )}
          {session.user.empreendimento.length === 1 &&
            session.user.empreendimento.map(
              (item: SessionNext.Empreendimento) => (
                <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                  <FormLabel fontWeight={"bold"}>Empreendimento</FormLabel>
                  <Text>{item.nome}</Text>
                </Flex>
              )
            )}
          {session.user.Financeira.length > 1 &&
            session.user.Financeira.map(
              (item: SessionNext.Financeira, index: number) => (
                <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                  <FormLabel fontWeight={"bold"}>
                    Financeira {index + 1}
                  </FormLabel>
                  <Text>{item.fantasia}</Text>
                </Flex>
              )
            )}
          {session.user.Financeira.length === 1 &&
            session.user.Financeira.map((item: SessionNext.Financeira) => (
              <Flex flexDir="column" px={2} lineHeight={"1rem"}>
                <FormLabel fontWeight={"bold"}>Financeira</FormLabel>
                <Text>{item.fantasia}</Text>
              </Flex>
            ))}
          <BtnListNow />

          {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
        </Flex>
      )}
    </>
  );

  //TODO:  criar lista chamados
  //TODO:  criar lista alerts ativos
};
