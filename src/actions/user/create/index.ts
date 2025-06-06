"use server";

import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

// Função responsável por criar um novo usuário a partir dos dados do formulário
export default async function UserCreate(_: any, data: FormData) {
  
    // Extração dos campos do formulário
    const cpf = data.get("cpf") as string;
    const nome = data.get("nome") as string;
    const username = data.get("usuario") as string;
    const telefone = data.get("telefone") as string;
    const telefoneFormat = telefone ? telefone.replace(/\D/g, "") : "";
    const email = data.get("email") as string;
    const construtora = data.get("construtora") as any;
    const empreendimento = data.get("empreendimento") as any;
    const Financeira = data.get("financeira") as any;

    const construtoraArray = construtora ? construtora.split(",").map(Number) : [];
    const empreendimentoArray = empreendimento ? empreendimento.split(",").map(Number) : [];
    const FinanceiraArray = Financeira ? Financeira.split(",").map(Number) : [];

    const Cargo = data.get("cargo") as string;
    const hierarquia = data.get("hierarquia") as string;
    const password = data.get("senha") as string;
    const passwordConfir = data.get("confirsenha") as string;

    // Busca a sessão do usuário logado
    const session = await GetSessionServer();
    if (!session) {
      return {
        error: true,
        message: "Usuário não autorizado.",
        id: undefined,
      };
    }

    // Monta o corpo da requisição
    const body = {
      nome: nome,
      username: username,
      password: password,
      telefone: telefoneFormat,
      email: email,
      cpf: cpf,
      cargo: Cargo,
      construtora: construtoraArray,
      empreendimento: empreendimentoArray,
      hierarquia: hierarquia,
      Financeira: FinanceiraArray,
      passwordConfir: passwordConfir,
    };

    // Faz a requisição para a API
    const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify(body),
    });

    const res = await req.json();

    // Se a requisição falhar, retorna erro padronizado
    if (!req.ok) {
      return {
        error: true,
        message: res.message || "Erro ao cadastrar usuário.",
        id: undefined,
      };
    }

    revalidateTag("usuarios_list");
    redirect(`/usuarios`);
    // Retorno de sucesso padronizado
    return {
      error: false,
      message: res.message || "Usuário cadastrado com sucesso.",
      id: res.data?.id?.toString() || undefined, // Garante que o id seja string ou undefined
    };
}
