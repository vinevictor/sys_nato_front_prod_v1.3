import { GetSessionServer } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const body = await req.json();
   
      const session = await GetSessionServer();

      if (!session) {
        return NextResponse.json("Unauthorized", { status: 401 });
      }

      const user = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/limpar/fcweb/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await user.json();
      console.log("🚀 ~ PUT ~ data:", data)
    

      if (!user.ok) {
        return NextResponse.json(data, { status: 402 });
      }

      return NextResponse.json(data, { status: 200 });
      
    } catch (error) {
      return NextResponse.json(error, { status: 500 });
    }
}