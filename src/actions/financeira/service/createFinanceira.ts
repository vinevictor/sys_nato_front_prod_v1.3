"use server";

import {  GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export default async function FinanceiraCreate(_: any, data: FormData) {
  const cnpj = data.get("cnpj") as string;
  const razaosocial = data.get("razaosocial") as string;
  const tel = data.get("telefone") as string;
  const email = data.get("email") as string;
  const responsavel = data.get("nome") as string;
  const fantasia = data.get("fantasia") as string;
  const construtora = data.get("construtora") as string;
  const direto = data.get("direto") as string;
  const valor_cert = data.get("valor_cert") as string;
  const construtoraArray = construtora.split(",");
  const construtoraFinal = construtoraArray.map((element) => {
    return Number(element);
  });

  console.log(construtoraFinal);

  if (construtoraFinal.length === 1 && construtoraFinal[0] === 0) {
    return {
      error: true,
      message: "Selecione pelo menos uma construtora",
      data: null,
      status: 400,
    };
  }
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
        responsavel: responsavel,
        fantasia: fantasia,
        construtoras: construtoraFinal,
        direto: !direto ? false : true,
        valor_cert: parseFloat(
          valor_cert.replace(",", ".").trim().replace("R$", "")
        ).toFixed(2),
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

  revalidateTag("financeira-all");
  revalidateTag("financeiras-list-page");
  redirect("/financeiras");
}
