import { CreateSessionServer, updateAndCreateRoleCache } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, ip, geolocation } = body ?? {};

    if (!username || !password) {
      return NextResponse.json({ message: "Credenciais inválidas." }, { status: 400 });
    }

    const metadataHeaders: Record<string, string> = {};

    if (typeof ip === "string" && ip.length > 0) {
      metadataHeaders["x-client-ip"] = ip;
    }

    if (geolocation && typeof geolocation === "object") {
      metadataHeaders["x-client-geo"] = JSON.stringify(geolocation);
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
    await CreateSessionServer({ token, user });

    // Cria cache de role (cookie session-role) - Route Handler pode modificar cookies
    try {
      await updateAndCreateRoleCache(token, user.id);
    } catch (error) {
      console.error("Erro ao criar cache de role:", error);
      // Continua mesmo se falhar, pois será criado na próxima requisição
    }

    return NextResponse.json({ message: "Login realizado com sucesso" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
