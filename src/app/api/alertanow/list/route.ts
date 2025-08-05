import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

// Esta rota precisa ser dinâmica pois utiliza autenticação baseada em sessão (cookies/token)
export const dynamic = 'force-dynamic';


export async function GET() {
    try {
      const session = await GetSessionServer();

      if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/list/now/get`;

      const user = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        next: {
          tags: ["alertanow-list"],
          revalidate: 60 * 30,
        },
      });
      const data = await user.json();
      if (!user.ok) {
        console.error("GetListaDados status:", data.message);
        return NextResponse.json({ error: "Erro ao buscar lista" }, { status: 500 });
      }
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Erro ao buscar lista" }, { status: 500 });
    }
}
