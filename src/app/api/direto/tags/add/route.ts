import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { diretoId, tagId } = body;

    if (!diretoId || !tagId) {
      return new NextResponse("Missing diretoId or tagId", { status: 400 });
    }

    const apiReq = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto-tags`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          data: {
            direto: diretoId,
            tag: tagId,
          },
        }),
      }
    );

    if (!apiReq.ok) {
      const error = await apiReq.json();
      console.error("Error creating tag association:", error);
      return new NextResponse(JSON.stringify(error), { status: apiReq.status });
    }

    const data = await apiReq.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.log('Error in /api/direto/tags/add:', error);
    return NextResponse.json(
      { message: "Erro ao associar a tag" },
      { status: 500 }
    );
  }
}