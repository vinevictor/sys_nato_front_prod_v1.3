import { DeleteSession, GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

// Esta rota depende de autenticação baseada em sessão (cookies/token),
// por isso precisa ser marcada como dinâmica para evitar erro DYNAMIC_SERVER_USAGE no build.
export const dynamic = "force-dynamic";

export async function GET() {
    try {
      const session = await GetSessionServerApi();
      if (!session) {
        await DeleteSession();
        return NextResponse.json({ error: true, message: "Unauthorized"}, { status: 401 });
      }
        const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/relatorio/numeros/geral`, {
          headers: {
            "Authorization": `Bearer ${session.token}`
          },
          next: {
            tags: ["relatorio-all"],
            revalidate: 60 * 3,
          },
        });
        const res = await req.json();

        if (!req.ok) {
            throw new Error(res.message);
        }
        return NextResponse.json(res, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
