"use server";

import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";


export default async function CreateEmpreendimento(_: any, data: FormData) {
  const session = await GetSessionServer();

  if (!session) {
    return { status: 401, message: "Unauthorized", error: true };
  }

  const construtora = Number(data.get("empreendimentoConstrutora") as string);
  const nome = data.get("nomeEmpreendimento") as string;
  const cidade = data.get("nomeCidade") as string;
  const uf = data.get("empreendimentoUf") as string;
  const financeiro = data.get("financeira") as string;
  const financeiroArray = financeiro.split(",");
  const financeiroFinal = financeiroArray.map((element) => {
    return +element;
  });

  const tag = "NATO_";

  const ativo = true;

  const body = {
    nome: nome,
    cidade: cidade,
    estado: uf,
    construtoraId: construtora,
    status: ativo,
    financeiro: financeiroFinal,
    tag: tag,
  };

  if (!construtora || !nome || !cidade || !uf || !financeiro) {
    return {
      error: true,
      message: `Dados das colunas ${!construtora ? "Construtora" : ""} ${!nome ? "Nome" : ""} ${!cidade ? "Cidade" : ""} ${!uf ? "UF" : ""} ${!financeiro ? "Financeira" : ""} são obrigatórios`,
      data: null,
    };
  }

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/empreendimento`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const res = await req.json();

  if (session?.user?.hierarquia === "GRT") {
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/${session?.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({
        empreendimento: [...session?.user.empreendimento, res.id]
      }),
    });
    console.log("🚀 ~ CreateEmpreendimento ~ res:", res)
  }

  if (!req.ok) {
    return { error: true, message: res.message, data: null, status: 500 };
  }

  if (res.error) {
    return { error: true, message: res.message, data: null, status: 500 };
  }

  revalidateTag("empreendimento-all");
  redirect("/empreendimentos");
}
