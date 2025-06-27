import BtnChamado from "@/components/chamado/btn";
import { GetSessionServer } from "@/lib/auth_confg";
import {
  Badge,
  Box,
  Button,
  Code,
  Divider,
  Flex,
  Heading,
  Input,
  Link,
  Select,
  Text,
} from "@chakra-ui/react";
import { redirect } from "next/navigation";

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
    clear?: string;
  };
}

async function getChamadosAll(session: SessionNext.Server | null) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/chamado`,
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
    console.error("getChamadosAll status:", response.status);
    return [];
  }

  const data = await response.json();
  return data ?? [];
}

// Função para filtrar chamados
function filtrarChamados(
  chamados: TypeChamado[],
  filtros: PageProps["searchParams"]
) {
  let resultado = [...chamados];

  if (filtros.id?.trim()) {
    resultado = resultado.filter((c) => String(c.id) === filtros.id!.trim());
  }

  if (filtros.busca?.trim()) {
    const termo = filtros.busca.toLowerCase();
    resultado = resultado.filter(
      (c) =>
        c.titulo.toLowerCase().includes(termo) ||
        c.descricao?.toLowerCase().includes(termo) ||
        c.user_nome?.toLowerCase().includes(termo)
    );
  }

  if (filtros.status)
    resultado = resultado.filter((c) => c.status === filtros.status);
  if (filtros.prioridade)
    resultado = resultado.filter((c) => c.prioridade === filtros.prioridade);
  if (filtros.departamento)
    resultado = resultado.filter(
      (c) => c.departamento === filtros.departamento
    );

  return resultado;
}

// Server Action para filtros
async function handleFilter(formData: FormData) {
  "use server";

  const params = new URLSearchParams();

  const busca = formData.get("busca") as string;
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  const prioridade = formData.get("prioridade") as string;
  const departamento = formData.get("departamento") as string;

  if (busca?.trim()) params.set("busca", busca.trim());
  if (id?.trim()) params.set("id", id.trim());
  if (status) params.set("status", status);
  if (prioridade) params.set("prioridade", prioridade);
  if (departamento) params.set("departamento", departamento);

  // Adiciona parâmetro para limpar os inputs após a filtragem
  params.set("clear", "true");

  redirect(`/chamado?${params.toString()}`);
}

// Server Action para limpar filtros
async function handleClearFilters() {
  "use server";
  redirect("/chamado");
}

interface ChamadoSwitchProps {
  searchParams: PageProps["searchParams"];
}

export default async function ChamadoSwitch({ searchParams }: ChamadoSwitchProps) {
  const session = await GetSessionServer();
  const chamadosTodos = session ? await getChamadosAll(session) : [];
  const chamados = filtrarChamados(chamadosTodos, searchParams);

  // Determina se deve limpar os inputs (quando clear=true)
  const shouldClearInputs = searchParams.clear === "true";

  // Obter valores únicos para os selects
  const statusUnicos: any = [
    ...new Set(chamadosTodos.map((c: any) => c.status)),
  ].filter(Boolean);
  const prioridadesUnicas = [
    ...new Set(chamadosTodos.map((c: any) => c.prioridade)),
  ].filter(Boolean);
  const departamentosUnicos = [
    ...new Set(chamadosTodos.map((c: any) => c.departamento)),
  ].filter(Boolean);

  return (
    <>
      <Flex
        minH="88.6vh"
        w="100%"
        bg="#F8F8F8"
        overflowY="auto"
        overflowX="hidden"
        justifyContent={"center"}
        px={{ base: 0, md: "8rem", lg: "15rem" }}
      >
        <Flex
          w={"100%"}
          minH={"100%"}
          px={{ base: 0, md: 4 }}
          py={4}
          flexDir={"column"}
          gap={4}
        >
          {/* 1 */}
          <Flex justifyContent={"space-between"} alignItems={"end"} mb={10}>
            <Box>
              <Heading>Chamados de Suporte</Heading>
              <Flex gap={2}>
                <Text>{chamados.length} chamados</Text>
                <Badge colorScheme="red">
                  {
                    chamados.filter((item: any) => item.prioridade === "alta")
                      .length
                  }{" "}
                  críticos
                </Badge>
                <Badge colorScheme="green">
                  {
                    chamados.filter(
                      (item: any) => item.status === "EM_ANDAMENTO"
                    ).length
                  }{" "}
                  abertos
                </Badge>
                <Badge colorScheme="yellow">
                  {chamados.filter((item: any) => item.status === "LV2").length}{" "}
                  nível 2
                </Badge>
              </Flex>
            </Box>
            <Flex>
              <Button as={Link} href="/chamado/novo" colorScheme="green">
                Novo Chamado
              </Button>
            </Flex>
          </Flex>

          {/* 2 */}
          <Flex gap={2} justifyContent={"center"} alignItems={"center"}>
            <form action={handleFilter} style={{ display: "contents" }}>
              <Box w={"25rem"}>
                <Input
                  name="busca"
                  type="text"
                  placeholder="Buscar chamados"
                  w={"100%"}
                  defaultValue={
                    shouldClearInputs ? "" : searchParams.busca || ""
                  }
                />
              </Box>
              <Box w={"15rem"}>
                <Input
                  name="id"
                  type="text"
                  placeholder="ID"
                  w={"100%"}
                  defaultValue={shouldClearInputs ? "" : searchParams.id || ""}
                />
              </Box>
              <Box w={"15rem"}>
                <Select
                  name="status"
                  placeholder="status"
                  w={"100%"}
                  defaultValue={
                    shouldClearInputs ? "" : searchParams.status || ""
                  }
                >
                  {statusUnicos.map((status: any) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box w={"15rem"}>
                <Select
                  name="prioridade"
                  placeholder="prioridade"
                  w={"100%"}
                  defaultValue={
                    shouldClearInputs ? "" : searchParams.prioridade || ""
                  }
                >
                  {prioridadesUnicas.map((prioridade: any) => (
                    <option key={prioridade} value={prioridade}>
                      {prioridade.toUpperCase()}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box w={"15rem"}>
                <Select
                  name="departamento"
                  placeholder="Departamento"
                  w={"100%"}
                  defaultValue={
                    shouldClearInputs ? "" : searchParams.departamento || ""
                  }
                >
                  {departamentosUnicos.map((departamento: any) => (
                    <option key={departamento} value={departamento}>
                      {departamento.toUpperCase()}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box w={"10rem"}>
                <Button type="submit" colorScheme="green" w={"100%"}>
                  Filtrar
                </Button>
              </Box>
            </form>
            <Box w={"10rem"}>
              <form action={handleClearFilters}>
                <Button type="submit" colorScheme="gray" w={"100%"}>
                  Limpar
                </Button>
              </form>
            </Box>
          </Flex>
          <Divider my={4} borderColor="gray.300" />

          {/* 3 */}
          <Flex flexDir={"column"} gap={2}>
            {/* card */}
            {chamados.map((item: any) => (
              <Box
                key={item.id}
                p={4}
                borderRadius="15px"
                shadow="md"
                _hover={{ shadow: "xl" }}
                overflowY="auto"
                w={"100%"}
                bg="#fff"
                border="1px solid"
                borderColor="gray.300"
              >
                <Flex justifyContent={"space-between"} alignItems={"start"}>
                  <Flex flexDir={"column"} gap={4}>
                    <Flex gap={2} alignItems={"center"}>
                      <Text fontSize={"md"} fontWeight={"bold"}>
                        {item.titulo}
                      </Text>
                      <Badge colorScheme="blue">{item.status}</Badge>
                      <Badge colorScheme="yellow">{item.prioridade}</Badge>
                    </Flex>
                    <Flex gap={2}>
                      <Text fontSize={"sm"}>Solicitante: {item.user_nome}</Text>
                      •
                      <Text fontSize={"sm"}>
                        Departamento: {item.departamento}
                      </Text>
                    </Flex>
                    <Flex gap={4}>
                      <Code children={`ID: ${item.id}`} />
                      <Code children={`Aberto em: ${item.createAt}`} />
                      <Code
                        children={`Última atualização: ${item.updatedAt}`}
                      />
                    </Flex>
                  </Flex>
                  <Flex gap={2}>
                    <BtnChamado name="Editar" id={item.id} type="edit" />
                    <BtnChamado name="Excluir" id={item.id} type="delete" />
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
