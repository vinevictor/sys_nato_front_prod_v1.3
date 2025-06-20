import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

// Esta rota depende de autenticação baseada em sessão (cookies/token),
// por isso precisa ser marcada como dinâmica para evitar erro DYNAMIC_SERVER_USAGE no build.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await GetSessionServer();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag-list`;
    const req = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const res = await req.json();

    if (!req.ok) {
      return NextResponse.json(
        { message: res.message },
        { status: req.status }
      );
    }

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erro ao buscar tags" },
      { status: 500 }
    );
  }
}
