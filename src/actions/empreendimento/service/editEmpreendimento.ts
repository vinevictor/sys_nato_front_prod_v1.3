"use server";
import { GetSessionServer } from "@/lib/auth_confg";
import { redirect } from "next/navigation";

export async function EditEmpreendimento(_: any, data: FormData) {
  const id = Number(data.get("id") as string);
  const construtora = Number(data.get("empreendimentoConstrutora") as string);
  const nome = data.get("nomeEmpreendimento") as string;
  const cidade = data.get("nomeCidade") as string;
  const uf = data.get("empreendimentoUf") as string;
  const financeiro = data.get("financeira") as any;
  const financeiroArray = financeiro.split(",");
  const financeiroFinal = financeiroArray.map((element: number) => {
    return +element;
  });

  const session = await GetSessionServer();

  if (!session) {
    return { status: 401, message: "Unauthorized", error: true };
  }

  const body = {
    nome: nome,
    construtoraId: construtora,
    cidade: cidade,
    estado: uf,
    financeiro: financeiroFinal,
  };

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/empreendimento/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!req.ok) {
    return { status: req.status, message: "Error", error: true };
  }

  redirect("/empreendimentos");
}
