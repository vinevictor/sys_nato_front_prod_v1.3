import { CreateSessionServer, updateAndCreateRoleCache } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};

    if (!username || !password) {
      return NextResponse.json({ message: "Credenciais inválidas." }, { status: 400 });
    }
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth`;
    const res = await fetch(
      url,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    const data = await res.json();
    console.log("🚀 ~ POST ~ data:", data)
    if (!res.ok) {
      return NextResponse.json({ message: data.message }, { status: 400 });
    }
    const { token, user } = data;

    // Cria sessão principal
    const sessionResult = await CreateSessionServer({ token, user });
    if (!sessionResult.success) {
      console.error("Erro ao criar sessão:", sessionResult.error);
      return NextResponse.json({ message: "Erro ao criar sessão do usuário" }, { status: 500 });
    }

    // Cria cache de role (cookie session-role) - Route Handler pode modificar cookies
    const roleResult = await updateAndCreateRoleCache(token, user.id);
    if (!roleResult.success) {
      console.warn("Aviso ao criar cache de role:", roleResult.error);
      // Continua mesmo se falhar, não é crítico
    }

    return NextResponse.json({ message: "Login realizado com sucesso" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
