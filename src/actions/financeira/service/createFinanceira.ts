"use server";

import { GetSessionClient, GetSessionServer } from "@/lib/auth_confg";
import { redirect } from "next/navigation";

export default async function FinanceiraCreate(_: any, data: FormData) {
  const cnpj = data.get("cnpj") as string;
  const razaosocial = data.get("razaosocial") as string;
  const tel = data.get("telefone") as string;
  const email = data.get("email") as string;
  const responsavel = data.get("responsavel") as string;
  const fantasia = data.get("fantasia") as string;
  const construtora = data.get("construtora") as string;
  const construtoraArray = construtora.split(",");
  const construtoraFinal = construtoraArray.map((element) => {
    return Number(element);
  });

  const telefone = tel.replace(/[^0-9]/g, "");

  const session = await GetSessionServer();

  if (!session) {
    return { error: true, message: "Unauthorized", data: null, status: 401 };
  }

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/financeiro`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({
        cnpj: cnpj,
        razaosocial: razaosocial,
        tel: telefone,
        email: email,
        responsavelId: +responsavel,
        fantasia: fantasia,
        construtoras: construtoraFinal,
      }),
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

  redirect("/financeiras");
}
