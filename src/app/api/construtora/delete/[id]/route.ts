import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "ID da Construtora não fornecido" }, { status: 400 });
    }
    const session = await GetSessionServer();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const request = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtora/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        cache: "no-store",
      }
    );
    if (!request.ok) {
      const res = await request.json();
      console.log("🚀 ~ res:", res)
      return NextResponse.json(
        { message: res.message },
        { status: request.status }
      );
    }

    return NextResponse.json(
      { message: "Construtora Desativada com sucesso" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
