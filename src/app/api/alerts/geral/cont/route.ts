import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
      const session = await GetSessionServer();
      if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      if (!session.user?.role?.alert) {
        return NextResponse.json([], { status: 200 });
      }
      const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/alert/cont`;
      const get = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        cache: "no-store",
      });
      const data = await get.json();
      console.log("🚀 ~ GET ~ data cont:", data)
      if (!get.ok)
        return NextResponse.json(
          { message: data.message },
          { status: get.status }
        );

      return NextResponse.json(data.count, { status: 200 });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json(
        { message: error.message.join("\n") || error.message },
        { status: 500 }
      );
    }
}
