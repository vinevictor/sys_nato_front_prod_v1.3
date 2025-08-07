import { BugReport } from "@/components/bug";
import { Flex, FormLabel, Text } from "@chakra-ui/react";
import { BtnListNow } from "../imputs/BtnListNow";
import { FinanceiraLinks } from "../data";
import { mask } from "remask";

interface UserCompomentInfoProps {
  session: SessionNext.Server | null;
}

export const UserCompomentInfo = ({ session }: UserCompomentInfoProps) => {
  return (
    <>
      {session && (
        <Flex
          display={{ base: "none", "lg": "flex" }}
          w={"20%"}
          minH={"100%"}
          borderRight="1px solid"
          borderColor="gray.200"
          p={4}
          flexDir="column"
          gap={6}
          bg="gray.50"
          overflowY="auto"
        >
          <Flex
            bg="linear-gradient(135deg, #38A169 0%, #2F855A 100%)"
            p={5}
            borderRadius="xl"
            flexDir="column"
            gap={4}
            color="white"
            shadow="lg"
          >
            {/* Nome e Cargo */}
            <Flex flexDir="column" gap={2} align="center">
              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                {session.user.nome}
              </Text>
              <Text
                fontSize="sm"
                textAlign="center"
                bg="whiteAlpha.300"
                px={4}
                py={1}
                borderRadius="full"
                fontWeight="semibold"
              >
                {session.user.cargo.toUpperCase()}
              </Text>
            </Flex>

            <Flex gap={2} flexWrap="wrap" justify="center">
              <Flex
                flexDir="column"
                align="center"
                bg="whiteAlpha.200"
                p={3}
                borderRadius="lg"
                flex="1"
                minW="80px"
              >
                <FormLabel fontSize="xs" fontWeight="bold" color="whiteAlpha.800" mb={1}>ID</FormLabel>
                <Text fontSize="sm" fontWeight="bold">{session.user.id}</Text>
              </Flex>
              <Flex
                flexDir="column"
                align="center"
                bg="whiteAlpha.200"
                p={3}
                borderRadius="lg"
                flex="1"
                minW="120px"
              >
                <FormLabel fontSize="xs" fontWeight="bold" color="whiteAlpha.800" mb={1}>Telefone</FormLabel>
                <Text fontSize="sm" fontWeight="bold">{mask(session.user.telefone, "(99) 9 9999-9999")}</Text>
              </Flex>

              <Flex
                flexDir="column"
                align="center"
                bg="whiteAlpha.200"
                p={3}
                borderRadius="lg"
                flex="1"
                minW="100px"
              >
                <FormLabel fontSize="xs" fontWeight="bold" color="whiteAlpha.800" mb={1}>Hierarquia</FormLabel>
                <Text fontSize="sm" fontWeight="bold">{session.user.hierarquia}</Text>
              </Flex>
            </Flex>
          </Flex>

          <BugReport />

          {session.user.hierarquia !== "ADM" && <FinanceiraLinks />}

          <Flex flexDir="column" gap={3}>
            <Text fontSize="sm" fontWeight="bold" color="gray.600" textTransform="uppercase">
              Construtora{session.user.construtora.length > 1 ? 's' : ''}
            </Text>
            <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
              {session.user.construtora.length === 0 && 'Sem Construtoras'}
              {session.user.construtora.length > 0 && `${session.user.construtora.length} Construtora(s)`}
            </Text>
          </Flex>

          <Flex flexDir="column" gap={3}>
            <Text fontSize="sm" fontWeight="bold" color="gray.600" textTransform="uppercase">
              Empreendimento{session.user.empreendimento.length > 1 ? 's' : ''}
            </Text>
            <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
              {session.user.empreendimento.length === 0 && 'Sem Empreendimentos'}
              {session.user.empreendimento.length > 0 && `${session.user.empreendimento.length} Empreendimento(s)`}
            </Text>
          </Flex>

          <Flex flexDir="column" gap={3}>
            <Text fontSize="sm" fontWeight="bold" color="gray.600" textTransform="uppercase">
              Financeira{session.user.Financeira.length > 1 ? 's' : ''}
            </Text>
            <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
              {session.user.Financeira.length === 0 && 'Sem Financeiras'}
              {session.user.Financeira.length > 0 && `${session.user.Financeira.length} Financeira(s)`}
            </Text>
          </Flex>

          <BtnListNow />
        </Flex>
      )}
    </>
  );
};
