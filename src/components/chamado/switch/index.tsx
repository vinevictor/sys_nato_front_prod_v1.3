import { GetSessionServer } from "@/lib/auth_confg";
import ChamadoSwitchClient from "./client";

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

  if (!session) {
    return (
      <ChamadoSwitchClient
        chamadosFiltrados={[]}
        statusUnicos={[]}
        prioridadesUnicas={[]}
        searchParams={searchParams}
      />
    );
  }

  const [chamadosFiltrados, todosChamadosParaOpcoes] = await Promise.all([
    getChamados(session, searchParams),
    getChamadosAllOptions(session),
  ]);

  const statusUnicos: string[] = [
    ...new Set((todosChamadosParaOpcoes as TypeChamado[]).map((c) => c.status)),
  ].filter(Boolean);

  const prioridadesUnicas: string[] = [
    ...new Set(
      (todosChamadosParaOpcoes as TypeChamado[]).map((c) => c.prioridade)
    ),
  ].filter(Boolean);

  return (
    <ChamadoSwitchClient
      chamadosFiltrados={chamadosFiltrados as TypeChamado[]}
      statusUnicos={statusUnicos}
      prioridadesUnicas={prioridadesUnicas}
      searchParams={searchParams}
    />
  );
}
