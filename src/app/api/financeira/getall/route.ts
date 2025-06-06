import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await GetSessionServer();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqest = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/financeiro`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        next: { revalidate: 5 },
      }
    );

    if (!reqest.ok) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    const data = await reqest.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
