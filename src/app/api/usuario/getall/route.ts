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

    const reqest = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        cache: "force-cache",
        next: {
          tags: ["usuarios_list"],
        },
      }
    );

    const data = await reqest.json();
    if (!reqest.ok) {
      throw { message: data.message };
    }
    const users = data.filter((user: any) => user.hierarquia !== "ADM");

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
