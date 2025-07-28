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
                {session.nome}
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
                {session.cargo.toUpperCase()}
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
                <Text fontSize="sm" fontWeight="bold">{session.id}</Text>
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
                <Text fontSize="sm" fontWeight="bold">{mask(session.telefone, "(99) 9 9999-9999")}</Text>
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
                <Text fontSize="sm" fontWeight="bold">{session.hierarquia}</Text>
              </Flex>
            </Flex>
          </Flex>

          <BugReport />

          <Flex flexDir="column" gap={3}>
            <Text fontSize="sm" fontWeight="bold" color="gray.600" textTransform="uppercase">
              Construtora{session.construtora.length > 1 ? 's' : ''}
            </Text>
            <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
              {session.construtora.length === 0 && 'Sem Construtoras'}
              {session.construtora.length > 0 && session.construtora.length + ' Construtora'}
            </Text>
            <Flex gap={3} flexWrap="wrap">
            </Flex>
          </Flex>

          <Flex flexDir="column" gap={3}>
            <Text fontSize="sm" fontWeight="bold" color="gray.600" textTransform="uppercase">
              Empreendimento{session.empreendimento.length > 1 ? 's' : ''}
            </Text>
            <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
              {session.empreendimento.length === 0 && 'Sem Empreendimentos'}
              {session.empreendimento.length > 0 && session.empreendimento.length + ' Empreendimento'}
            </Text>
          </Flex>

          <Flex flexDir="column" gap={3}>
            <Text fontSize="sm" fontWeight="bold" color="gray.600" textTransform="uppercase">
              Financeira{session.Financeira.length > 1 ? 's' : ''}
            </Text>
            <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
              {session.Financeira.length === 0 && 'Sem Financeiras'}
              {session.Financeira.length > 0 && session.Financeira.length + ' Financeira'}
            </Text>
          </Flex>

          <Flex gap={3} w={"100%"} flexDir={"column"} mt={2}>
            {session.role?.now && <BtnListNow session={session} />}
            {session.role?.alert && <BtnAlertList session={session} />}
            <Link
              w={"100%"}
              color="white"
              textAlign="center"
              p={"6px"}
              href="/chamado"
              bg="linear-gradient(135deg, #38A169 0%, #2F855A 100%)"
              fontWeight="bold"
              borderRadius="lg"
              fontSize={"1rem"}
              shadow="md"
              transition="all 0.3s"
              _hover={{
                bg: "linear-gradient(135deg, #2F855A 0%, #276749 100%)",
                transform: "translateY(-2px)",
                shadow: "lg"
              }}
            >
              📞 Chamados
            </Link>
          </Flex>
        </Flex>
      )}
    </>
  );
};