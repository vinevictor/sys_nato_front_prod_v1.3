"use server";
import { NextResponse } from "next/server";
import { GetSessionServer } from "@/lib/auth_confg";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const session = await GetSessionServer();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/dashboard/get/infos/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
        cache: "no-store",
      }
    );
    if (!req.ok) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    const res = await req.json();
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
