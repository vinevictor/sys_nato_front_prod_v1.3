import { DeleteSession, GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await GetSessionServer();
    if (!session) {
      await DeleteSession();
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { id } = params;
    const body = await request.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/relatorio/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`
        },
        body: JSON.stringify(body)
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
