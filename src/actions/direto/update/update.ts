"use server";

import { GetSessionServer } from "@/lib/auth_confg";

export async function UpdateSolicitacaoDireto(_: any, data: FormData) {

  const session = await GetSessionServer();
  if (!session) {
    return {
      error: true,
      message: "Unauthorized",
      data: null
    };
  }


  const id = Number(data.get("id_cliente"));
  const TagsArray = data.get("Tags") as any;
  await PostTags(TagsArray, id);

  const DateNascimento = data.get("DataNascimento")?.toString() || "";
  const Dados = {
    ...(data.get("nome") && { nome: data.get("nome") }),
    ...(data.get("cpf") && { cpf: data.get("cpf") }),
    ...(data.get("telefones1") && { telefone: data.get("telefones1") }),
    ...(data.get("email") && { email: data.get("email") }),
    ...(data.get("DataNascimento") && { dt_nascimento: DateNascimento }),
    ...(data.get("financeiro") && { financeiro: Number(data.get("financeiro")) }),
    ...(data.get("pixCopiaECola") && { pixCopiaECola: data.get("pixCopiaECola") }),
    ...(data.get("qrcode") && { qrcode: data.get("qrcode") }),
    ...(data.get("txid") && { txid: data.get("txid") }),
    ...(data.get("valorcd") && { valorcd: Number(data.get("valorcd")) }),
    ...(data.get("imagemQrcode") && { imagemQrcode: data.get("imagemQrcode") }),
    ...(data.get("status_pgto") && { status_pgto: data.get("status_pgto") }),
  };

  console.log("🚀 ~ UpdateSolicitacaoDireto ~ Dados:", Dados)
  
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`
      },
      body: JSON.stringify(Dados)
    }
  );

  

  if (request.ok) {
    const response = await request.json();

    if (response.name === "PrismaClientValidationError") {
      return {
        data: null,
        message: "Erro ao atualizar o registro - PrismaClientValidationError",
        error: true
      };
    }
    return {
      error: false,
      message: "Atualização bem-sucedida",
      data: response
    };
  } else {
    console.error("Erro ao atualizar:", request.statusText);
    return {
      error: true,
      message: "Erro ao atualizar o registro" + request.statusText,
      data: null
    };
  }
}

async function PostTags(value: any, id: number) {
  const session = await GetSessionServer();
  const tags = JSON.parse(value);

  await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/posttags`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.token}`
      },
      body: JSON.stringify({
        tags: tags,
        solicitacao: id
      })
    },
  )
}
