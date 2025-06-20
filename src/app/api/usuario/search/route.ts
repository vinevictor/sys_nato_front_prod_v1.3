import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await GetSessionServer();

    const Busca = [];
    if (searchParams.get("empreedimento")) {
      Busca.push(`empreedimento=${searchParams.get("empreedimento")}`);
    }
    if (searchParams.get("construtora")) {
      Busca.push(`construtora=${searchParams.get("construtora")}`);
    }
    if (searchParams.get("financeiro")) {
      Busca.push(`financeiro=${searchParams.get("financeiro")}`);
    }
    if (searchParams.get("nome")) {
      Busca.push(`nome=${searchParams.get("nome")}`);
    }
    if (searchParams.get("email")) {
      Busca.push(`email=${searchParams.get("email")}`);
    }
    if (searchParams.get("cpf")) {
      Busca.push(`cpf=${searchParams.get("cpf")}`);
    }
    if (searchParams.get("hierarquia")) {
      Busca.push(`hierarquia=${searchParams.get("hierarquia")}`);
    }

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const reqest = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/Busca?${Busca.join("&")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );

    if (!reqest.ok) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    const data = await reqest.json();
    const users = data.filter((user: any) => user.hierarquia !== "ADM");
    revalidateTag("usuarios_list");
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
