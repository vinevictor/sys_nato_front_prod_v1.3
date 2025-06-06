"use server";

import { GetSessionServer } from "@/lib/auth_confg";

export async function UpdateSolicitacao(_: any, data: FormData) {
  const session = await GetSessionServer();
  if (!session) {
    return {
      error: true,
      message: "Unauthorized",
      data: null
    };
  }
  // console.log(data);

  const id = Number(data.get("id_cliente"));
  console.log("🚀 ~ UpdateSolicitacao ~ id:", id)
  const Ativo = data.get("StatusAtivo") === "true" ? true : false;
  const corretor = Number(data.get("corretor")) || 0;
  const hierarquia = session?.user?.hierarquia;
  const avaliar = !Ativo && corretor > 0 && hierarquia === "ADM" ? true : false;
  const Avaliar2 =
    !Ativo && corretor > 0 && hierarquia !== "ADM" ? true : false;

  const TagsArray = data.get("Tags") as any;
  await PostTags(TagsArray, id);

  const DateNascimento = data.get("DataNascimento")?.toString() || "";
  const Dados = {
    ...(Ativo && { ativo: Ativo }),
    ...(Ativo &&
      session?.user?.hierarquia !== "ADM" && {
        corretor: Number(session.user.id)
      }),
    ...(Avaliar2 && {
      corretor: Number(session.user.id),
      ativo: true
    }),
    ...(Ativo &&
      session?.user?.hierarquia === "ADM" && {
        corretor: Number(data.get("corretor"))
      }),
    ...(avaliar && {
      corretor: Number(data.get("corretor")),
      ativo: true
    }),
    ...(data.get("cpf") && { cpf: data.get("cpf") }),
    ...(data.get("nome") && { nome: data.get("nome") }),
    ...(data.get("telefones1") && { telefone: data.get("telefones1") }),
    ...(data.get("telefones2") && { telefone2: data.get("telefones2") }),
    ...(data.get("email") && { email: data.get("email") }),
    ...(data.get("update_RG") && { uploadRg: data.get("update_RG") }),
    ...(data.get("update_CNH") && { uploadCnh: data.get("update_CNH") }),
    ...(data.get("DataNascimento") && {
      dt_nascimento: DateNascimento
    }),
    ...(data.get("Obs") && { obs: data.get("Obs") }),
    ...(data.get("empreendimento") && {
      empreedimento: Number(data.get("empreendimento"))
    }),
    ...(data.get("construtora") && {
      construtora: Number(data.get("construtora"))
    }),
    ...(data.get("financeiro") && {
      financeiro: Number(data.get("financeiro"))
    }),
    ...(data.get("links") && {
      mult_link: data.get("links")
        ? data.get("links")?.toString().split(", ")
        : []
    }),
    ...(data.get("Relacionamento") && {
      relacionamento: data.get("Relacionamento")
        ? JSON.parse(data.get("Relacionamento")?.toString() || "")
        : []
    }),
    ...(data.get("Relacionamento") && { rela_quest: true })
  };

  const request = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/update/${id}`,
    {
      method: "PUT",
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
