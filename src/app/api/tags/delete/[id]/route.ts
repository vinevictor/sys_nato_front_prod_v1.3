import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const session = await GetSessionServerApi();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqest = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag-list/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );

    if (!reqest.ok) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    return NextResponse.json(
      { message: "Tag excluída com sucesso" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Erro ao excluir a tag" },
      { status: 500 }
    );
  }
}
