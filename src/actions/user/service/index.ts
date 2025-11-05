"use server";
import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function UpdateUser(_: any, data: FormData) {
  console.log("🚀 ~ UpdateUser ~ data:", data);
  const session = await GetSessionServer();
  if (!session) {
    return {
      error: true,
      message: "Unauthorized",
      data: null,
      status: 401,
    };
  }

  const natosign = data.get("natosign") ? true : false;
  const adm = data.get("adm") ? true : false;
  const direto = data.get("direto") ? true : false;
  const relatorio = data.get("relatorio") ? true : false;
  const financeiro = data.get("cad_financeiro") ? true : false;
  const user = data.get("user") ? true : false;
  const construtora = data.get("cad_construtora") ? true : false;
  const empreendimento = data.get("cad_empreendimento") ? true : false;
  const now = data.get("now") ? true : false;
  const alert = data.get("alerta") ? true : false;
  const chamado = data.get("chamado") ? true : false;
  const solicitacao = data.get("solicitacao") ? true : false;
  const id = data.get("id") ?? "";
  const cpf = (data.get("cpf") as string)?.replace(/\D/g, "") ?? "";
  const nome = data.get("nome") ?? "";
  const usuario = data.get("usuario") ?? "";
  const telefone = (data.get("whatsapp") as string).replace(/\D/g, "") ?? "";
  const email = data.get("email") ?? "";
  const ListConstrutora =
    (data.get("construtora") as string)?.split(",").map(Number) ?? [];
  const ListEmpreendimento =
    (data.get("empreendimento") as string)?.split(",").map(Number) ?? [];
  const ListFinanceiro =
    (data.get("financeira") as string)?.split(",").map(Number) ?? [];
  const cargo = data.get("cargo") ?? "";
  const hierarquia = data.get("hierarquia") ?? "";

  const roleEdit = {
    adm,
    direto,
    relatorio,
    financeiro,
    user,
    construtora,
    empreendimento,
    now,
    alert,
    chamado,
    solicitacao,
    natosign,
  };

  const body = {
    nome,
    username: usuario,
    telefone: telefone,
    email: email,
    empreendimento: ListEmpreendimento,
    Financeira: ListFinanceiro,
    cargo: cargo,
    hierarquia: hierarquia,
    construtora: ListConstrutora,
    role: roleEdit,
  };

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/update/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const res = await req.json();

  if (!req.ok) {
    return {
      error: true,
      message: res.message,
      data: null,
      status: req.status,
    };
  }
  revalidateTag("user-get");
  revalidateTag("user-role");
  revalidateTag("usuarios_list");
  revalidateTag("Usuarios-list-page");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  redirect("/usuarios");
}
