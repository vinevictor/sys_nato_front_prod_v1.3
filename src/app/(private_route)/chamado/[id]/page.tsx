export const dynamic = "force-dynamic";

import { ChamadoRootComponent } from "@/components/chamado";
import { GetSessionServerApi } from "@/lib/auth_confg";
import {
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiAlertCircle } from "react-icons/fi";
import Link from "next/link";

const Requestes = async (id: string, token: string) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/chamado/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("Requestes status:", response.status);
    return null;
  }
  const data = await response.json();
  return data ?? null;
};

type Props = {
  params: { id: string };
};

export default async function EditarChamadoPage({ params }: Props) {
  const { id } = params;
  const session = await GetSessionServerApi();

  const data = session && (await Requestes(id, session?.token));

  if (!data) {
    return (
      <Container
        maxW={{ base: "100%", sm: "95%", md: "96%", lg: "98%" }}
        py={{ base: 4, md: 5, lg: 6 }}
        px={{ base: 3, sm: 4, md: 5, lg: 6 }}
      >
        <VStack spacing={{ base: 5, md: 6 }} align="stretch" w="full">
          <Flex
            w="full"
            minH="400px"
            justifyContent="center"
            alignItems="center"
            bg="white"
            _dark={{ bg: "gray.800" }}
            borderRadius="xl"
            p={8}
            flexDir="column"
            gap={4}
            shadow="lg"
          >
            <Icon as={FiAlertCircle} w={16} h={16} color="red.500" />
            <Heading
              fontSize={{ base: "xl", md: "2xl" }}
              color="#023147"
              _dark={{ color: "gray.100" }}
              textAlign="center"
            >
              Chamado não encontrado
            </Heading>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="gray.600"
              _dark={{ color: "gray.400" }}
              textAlign="center"
            >
              O chamado #{id} não existe ou você não tem permissão para visualizá-lo.
            </Text>
            <Button
              as={Link}
              href="/chamado"
              colorScheme="green"
              bg="#00713D"
              mt={4}
              _hover={{ bg: "#005a31" }}
              _dark={{
                bg: "#00d672",
                color: "gray.900",
                _hover: { bg: "#00c060" },
              }}
            >
              Voltar para Chamados
            </Button>
          </Flex>
        </VStack>
      </Container>
    );
  }

  return (
    <>
      {session && <ChamadoRootComponent data={data} session={session.user} />}
    </>
  );
}
