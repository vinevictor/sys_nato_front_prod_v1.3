import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
    try {
      const { id } = params;
      const session = await GetSessionServerApi();

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/suspense/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        next: {
          tags: ["usuarios-list-page"],
        },
      });
      
      if (!req.ok) {
        throw new Error("Erro ao suspender usuário");
      }

      return NextResponse.json({ message: "Usuário suspenso com sucesso" }, { status: 200 });
    } catch (error) {
      console.error("Erro ao suspender usuário:", error);
      return NextResponse.json({ error: "Erro ao suspender usuário" }, { status: 500 });
    }
}