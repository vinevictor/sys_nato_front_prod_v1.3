import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const pass = process.env.PASS_API_FCWEB;
    const session = await GetSessionServerApi();
    const { id, ...res } = data;

    const credentials = Buffer.from(`${pass}`).toString("base64");
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const response = await fetch(
      `https://apifcweb.redebrasilrp.com.br/fcweb/import`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(res),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Strapi error:", text);
      return new NextResponse(`Erro ao criar o registro: ${text}`, {
        status: response.status,
      });
    }

    const retorno = await response.json();
    console.log("retorno da API", retorno);
    if (retorno.id) {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/fcweb/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({ id_fcw: retorno.id }),
        }
      );

      if (!request.ok) {
        const text = await request.text();
        console.error("Strapi error:", text);
        throw new Error(`Erro ao criar ficha de cadastro: ${text}`);
      }
    }

    return NextResponse.json(
      {
        message: "FC criado com sucesso",
        data: retorno,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(error.message, { status: error.status || 500 });
  }
}
