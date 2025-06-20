import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

// Esta rota depende de autenticação baseada em sessão (cookies/token),
// por isso precisa ser marcada como dinâmica para evitar erro DYNAMIC_SERVER_USAGE no build.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag-list`;
    const request = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const data = await request.json();
    if (!request.ok)
      return NextResponse.json(
        { message: "Solicitação não encontrada" },
        { status: 404 }
      );
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
