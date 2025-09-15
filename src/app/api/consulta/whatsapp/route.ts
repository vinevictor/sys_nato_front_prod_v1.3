import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body: any = await request.json();
    const tel = body.telefone;
   
    const api = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/checktel/${tel}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        next: {
          // revalida a cada 1 minuto
          revalidate: 30,
        },
      }
    );
    const data = await api.json();
    console.log("🚀 ~ data:", data);
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
