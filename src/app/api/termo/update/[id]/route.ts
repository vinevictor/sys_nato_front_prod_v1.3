import { GetSessionServerApi, updateAndCreateRoleCache } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { termoAceito } = await request.json();
    const session = await GetSessionServerApi();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/aceitar/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`
        },
        body: JSON.stringify({
          termo: termoAceito
        })
      }
    );

    const res = await req.json();

    if (!req.ok) {
      return NextResponse.json(
        { message: res.message },
        { status: res.statusCode }
      );
    }

    // Atualiza cache de role após modificar termo
    const roleResult = await updateAndCreateRoleCache(session.token, session.user.id);
    if (!roleResult.success) {
      console.warn("Aviso ao atualizar cache de role:", roleResult.error);
    }

    return NextResponse.json(
      { ...res, message: "Termo atualizado com sucesso" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Erro ao atualizar o termo, erro: " + error.message   },
      { status: 500 }
    );
  }
}
