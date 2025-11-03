import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const session = await GetSessionServerApi();
      if (!session) {
        return NextResponse.json({ error: true, message: "Unauthorized"}, { status: 401 });
      }
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/novo_acordo/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      if (!req.ok) {
        return NextResponse.json("Invalid credentials", { status: 401 });
      }
      const data = await req.json();
      console.log("🚀 ~ data:", data);

      return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
}