import { DeleteSession, GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await GetSessionServer();
    if (!session) {
      await DeleteSession();
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const reqest = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/relatorio`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`
        }
      }
    );

    const data = await reqest.json();
    if (!reqest.ok) {
      throw new Error(data.message);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}