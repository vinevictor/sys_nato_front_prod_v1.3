import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const File = await request.formData();
    const typedoc = File.get("type");
    const arquivo = File.get("file");

    const formData = new FormData();

    if (!arquivo) {
      throw {
        message:
          "Arquivo não informado, por favor entre em contato com o Suporte",
      };
    }
    if (!typedoc) {
      throw {
        message:
          "Tipo de arquivo não informado, por favor entre em contato com o Suporte",
      };
    }

    formData.append("file", arquivo);

    const session = await GetSessionServer();

    if (!File)
      throw {
        message:
          "Arquivo não informado, por favor entre em contato com o Suporte",
      };
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/file/${typedoc}`;
    const Envio = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
      body: formData,
    });
    const retornoArquivo = await Envio.json();
    
    if (!Envio.ok) {
      throw {
        message:
          "Erro ao enviar o arquivo, por favor entre em contato com o Suporte",
      };
    }

    return NextResponse.json(
      { data: retornoArquivo, message: "Arquivo enviado com sucesso" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(error.message, { status: error.status || 500 });
  }
}
