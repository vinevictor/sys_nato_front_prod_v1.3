import TagsClientComponent from "@/components/tagsClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";
import { Metadata } from "next";

// Força a renderização dinâmica desta página, pois ela usa cookies (via GetSessionServer)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tags",
};

const getTags = async (session: SessionNext.Server) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag-list`;
    const req = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      cache: "no-store", // Garante dados sempre atualizados
    });

    if (!req.ok) {
      throw new Error("Erro ao buscar tags");
    }

    const res = await req.json();
    return res;
  } catch (error) {
    console.error("Erro ao buscar tags:", error);
    return [];
  }
};

type TagType = {
  id: number;
  label: string;
  createdAt: string;
};

/**
 * Página de gerenciamento de tags
 * 
 * Funcionalidades:
 * - Exibe lista de tags
 * - Filtros de busca
 * - Criação e edição via modal
 * - Layout moderno seguindo padrão de empreendimentos
 * - Responsivo e com tema adaptativo
 * 
 * @component
 */
export default async function Tags() {
  const session = (await GetSessionServer()) as SessionNext.Server;
  const tags = (await getTags(session)) as TagType[];

  return (
    <>
      <TagsClientComponent dados={tags} />
    </>
  );
}
