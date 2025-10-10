import { GetSessionServer } from "@/lib/auth_confg";
import {
  Badge,
  Box,
  Button,
  Code,
  Divider,
  Flex,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import BtnChamado from "@/components/chamado/btn";
import FiltroChamados from "../filtro/filtroChamado";

interface TypeChamado {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  departamento: string;
  prioridade: string;
  dth_qru: string;
  idUser: number;
  solicitacaoId: number;
  temp: any[];
  chat: any[];
  images: any[];
  createAt: string;
  updatedAt?: string;
  user_nome?: string;
}

interface PageProps {
  searchParams: {
    id?: string;
    busca?: string;
    status?: string;
    prioridade?: string;
    departamento?: string;
  };
}

async function getChamados(session: any, filtros: PageProps["searchParams"]) {
  const params = new URLSearchParams(filtros as any);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/chamado?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("getChamados status:", response.status);
    return [];
  }
  return response.json();
}

async function getChamadosAllOptions(session: any): Promise<TypeChamado[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/chamado`,
    {
      headers: { Authorization: `Bearer ${session?.token}` },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("getChamadosAllOptions status:", response.status);
    return [];
  }

  const data = await response.json();
  return data ?? [];
}

export default async function ChamadoSwitch({
  searchParams,
}: {
  searchParams: PageProps["searchParams"];
}) {
  const session = await GetSessionServer();

  const chamadosFiltrados = session
    ? await getChamados(session, searchParams)
    : [];

  const todosChamadosParaOpcoes = session
    ? await getChamadosAllOptions(session)
    : [];

  const statusUnicos: string[] = [
    ...new Set(todosChamadosParaOpcoes.map((c: TypeChamado) => c.status)),
  ].filter(Boolean);

  const prioridadesUnicas: string[] = [
    ...new Set(todosChamadosParaOpcoes.map((c: TypeChamado) => c.prioridade)),
  ].filter(Boolean);

  const departamentosUnicos: string[] = [
    ...new Set(todosChamadosParaOpcoes.map((c: TypeChamado) => c.departamento)),
  ].filter(Boolean);

  return (
    <Flex
      minH="88.6vh"
      w="100%"
      bg="#F8F8F8"
      justifyContent={"center"}
      px={{ base: 4, md: "8rem", lg: "15rem" }}
    >
      <Flex w={"100%"} minH={"100%"} py={4} flexDir={"column"} gap={4}>
        <Flex
          justifyContent={"space-between"}
          alignItems={"end"}
          mb={10}
          flexWrap="wrap"
          gap={4}
        >
          <Box>
            <Heading>Chamados de Suporte</Heading>
            <Flex gap={2} flexWrap="wrap" mt={2}>
              <Text fontWeight="bold">
                {chamadosFiltrados.length} chamados encontrados
              </Text>
            </Flex>
          </Box>
          <Flex>
            <Button as={Link} href="/chamado/novo" colorScheme="green">
              Novo Chamado
            </Button>
          </Flex>
        </Flex>

        <FiltroChamados
          statusUnicos={statusUnicos}
          prioridadesUnicas={prioridadesUnicas}
          departamentosUnicos={departamentosUnicos}
        />

        <Divider my={4} borderColor="gray.300" />

        <Flex flexDir={"column"} gap={3}>
          {chamadosFiltrados.length > 0 ? (
            chamadosFiltrados.map((item: TypeChamado) => (
              <Box
                key={item.id}
                p={4}
                borderRadius="15px"
                shadow="md"
                bg="#fff"
                border="1px solid"
                borderColor="gray.200"
              >
                <Flex justifyContent={"space-between"} alignItems={"start"}>
                  <Flex flexDir={"column"} gap={3}>
                    <Flex gap={2} alignItems={"center"} flexWrap="wrap">
                      <Text fontSize={"md"} fontWeight={"bold"}>
                        {item.titulo}
                      </Text>
                      <Badge colorScheme="blue">{item.status}</Badge>
                      <Badge colorScheme="yellow">{item.prioridade}</Badge>
                    </Flex>
                    <Flex gap={2} flexWrap="wrap">
                      <Text fontSize={"sm"}>Solicitante: {item.user_nome}</Text>
                      •
                      <Text fontSize={"sm"}>
                        Departamento: {item.departamento}
                      </Text>
                    </Flex>
                    <Flex gap={4} flexWrap="wrap">
                      <Code>{`ID: ${item.id}`}</Code>
                      <Code>
                        {`Aberto em: ${new Date(
                          item.createAt
                        ).toLocaleDateString("pt-BR")}`}
                      </Code>
                      {item.updatedAt && (
                        <Code>
                          {`Última atualização: ${new Date(
                            item.updatedAt
                          ).toLocaleDateString("pt-BR")}`}
                        </Code>
                      )}
                    </Flex>
                  </Flex>
                  <Flex gap={2}>
                    <BtnChamado name="Editar" id={item.id} type="edit" />
                    <BtnChamado name="Excluir" id={item.id} type="delete" />
                  </Flex>
                </Flex>
              </Box>
            ))
          ) : (
            <Text textAlign="center" p={10} color="gray.500">
              Nenhum chamado encontrado com os filtros aplicados.
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
