import { GetSessionServerApi } from "@/lib/auth_confg";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const Body = await request.json();
    const session = await GetSessionServerApi();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag-list`;
    const reqAxios = await axios.post(url,  Body);

    const data = reqAxios.data;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Erro ao buscar tags:", error);
    return NextResponse.json(
      { message: "Erro ao buscar tags" },
      { status: 500 }
    );
  }
}
