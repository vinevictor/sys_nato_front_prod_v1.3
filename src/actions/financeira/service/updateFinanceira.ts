"use server";
import { GetSessionServer } from "@/lib/auth_confg";
import { redirect } from "next/navigation";

export async function UpdateFinanceira(_: any, data: FormData) {
  const id = Number(data.get("id"));
  const razaoSocial = data.get("razaosocial") as string;
  const email = data.get("email") as string;
  const telefone = data.get("telefone") as string;
  const responsavel = data.get("responsavel") as string;
  const fantasia = data.get("fantasia") as string;
  const construtora = data.get("construtora") as string;
  const construtoraArray = construtora.split(",");
  const construtoraFinal = construtoraArray.map((element) => {
    return Number(element);
  });

  const session = await GetSessionServer();

  if (!session) {
    return {
      error: true,
      message: "Unauthorized",
      data: null,
      status: 401,
    };
  }

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/financeiro/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({
        razaosocial: razaoSocial,
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
