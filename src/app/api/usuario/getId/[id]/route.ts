import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await GetSessionServer();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqest = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/get/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );

    if (!reqest.ok) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    const data = await reqest.json();
    console.log("🚀 ~ data:", data)
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log("🚀 ~ error:", error)
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
