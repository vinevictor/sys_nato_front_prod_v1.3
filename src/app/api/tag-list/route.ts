import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await GetSessionServer();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag-list`;
    const req = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      cache: "force-cache",
      next: {
        tags: ["get_tags"],
      },
    });
    const res = await req.json();

    if (!req.ok) {
      return NextResponse.json(
        { message: res.message },
        { status: req.status }
      );
    }

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erro ao buscar tags" },
      { status: 500 }
    );
  }
}
