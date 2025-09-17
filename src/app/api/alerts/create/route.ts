import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const session = await GetSessionServer();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!session.user?.role?.alert) {
      return NextResponse.json(
        { message: "Você não tem permissão para criar um alerta" },
        { status: 401 }
      );
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/alert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      }
    );
    revalidateTag("alert-geral-all");
    const retorno = await response.json();
    return NextResponse.json(retorno, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message.join("\n") || error.message }, { status: 500 });
  }
}
