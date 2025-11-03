"use server";
import { GetSessionServerApi } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function UpdateFinanceira(_: any, data: FormData) {
  const id = Number(data.get("id"));
  const razaoSocial = data.get("razaosocial") as string;
  const email = data.get("email") as string;
  const telefone = data.get("telefone") as string;
  const responsavel = data.get("nome") as string;
  const fantasia = data.get("fantasia") as string;
  const construtora = data.get("construtora") as string;
  const construtoraArray = construtora.split(",");
  const direto = data.get("direto") as string;
  const valor_cert = data.get("valor_cert") as string;
  const construtoraFinal = construtoraArray.map((element) => {
    return Number(element);
  });
  const Intelesign_status = data.get("Intelesign_status") as string;

  const session = await GetSessionServerApi();

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
        direto: !direto ? false : true,
        valor_cert: parseFloat(
          valor_cert.replace(",", ".").trim().replace("R$", "")
        ).toFixed(2),
        razaosocial: razaoSocial.trim(),
        tel: telefone,
        email: email.trim(),
        responsavel: responsavel.trim(),
        fantasia: fantasia.trim(),
        construtoras: construtoraFinal,
        Intelesign_status: Intelesign_status === "true",
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
