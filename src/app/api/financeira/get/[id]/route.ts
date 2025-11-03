import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * API Route para buscar financeira por ID
 * 
 * @param request - Request object
 * @param params - Parâmetros da rota (id)
 * @returns Dados da financeira
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await GetSessionServerApi();
    const { id } = params;

    if (!session?.token) {
      console.log("Unauthorized - No session token");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/financeiro/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        cache: "no-store", // Sempre busca dados atualizados
      }
    );

    if (!req.ok) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    
    const data = await req.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching financeira:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
