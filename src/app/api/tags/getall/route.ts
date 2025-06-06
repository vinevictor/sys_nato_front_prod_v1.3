import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag-list`;
    const request = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const data = await request.json();
    if (!request.ok)
      return NextResponse.json(
        { message: "Solicitação não encontrada" },
        { status: 404 }
      );
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
