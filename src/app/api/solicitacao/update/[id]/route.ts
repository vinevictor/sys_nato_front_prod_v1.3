import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const req = await request.json();
    const body = req.form || req;
    const tags = body.tags || [];

    const dataSend = {
      ...(body.nome && { nome: body.nome }),
      ...(body.email && { email: body.email }),
      ...(body.cpf && { cpf: body.cpf }),
      ...(body.telefone && { telefone: body.telefone }),
      ...(body.telefone2 && { telefone2: body.telefone2 }),
      ...(body.dt_nascimento && { dt_nascimento: body.dt_nascimento }),
      ...(body.uploadCnh && { uploadCnh: body.uploadCnh }),
      ...(body.uploadRg && { uploadRg: body.uploadRg }),
      ...(body.corretorId && { corretor: body.corretorId }),
      ...(body.construtoraId && { construtora: body.construtoraId }),
      ...(body.financeiroId && { financeiro: body.financeiroId }),
      ...(body.empreendimentoId && { empreendimento: body.empreendimentoId }),
      ...(body.id_fcw && { id_fcw: body.id_fcw }),
      ...(body.andamento && { andamento: body.andamento }),
      gov: body.gov || false,
    };
    const session = await GetSessionServerApi();

    /**
     *  verificar se existe tags para essa solicitação
     */
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag/solicitacao/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar tags salvas: ${response.statusText}`);
    }
    const tagsSalvas: any[] = await response.json();

    const tagsDesejadasStrings: string[] = (body.tags || [])
      .map((tag: any) => tag.label || tag.descricao)
      .filter(Boolean);

    const tagsSalvasMap = new Map(
      tagsSalvas.map((tag) => [tag.descricao, tag.id])
    );
    const tagsDesejadasSet = new Set(tagsDesejadasStrings);

    // Identificar quais tags precisam ser CRIADAS
    const tagsParaCriar = tagsDesejadasStrings.filter(
      (tagStr) => !tagsSalvasMap.has(tagStr)
    );

    // Identificar quais tags precisam ser DELETADAS
    const tagsParaDeletar = tagsSalvas.filter(
      (tagSalva) => !tagsDesejadasSet.has(tagSalva.descricao)
    );

    // [FIX] Executar criações em paralelo e ESPERAR (await)
    if (tagsParaCriar.length > 0) {
      const createPromises = tagsParaCriar.map((tagDescricao) => {
        return fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({
            descricao: tagDescricao,
            solicitacao: +id,
          }),
        }).then((res) => {
          if (!res.ok) {
            throw new Error(
              `Erro ao criar tag "${tagDescricao}": ${res.statusText}`
            );
          }
          return res.json();
        });
      });
      await Promise.all(createPromises);
    }

    // [FIX] Executar deleções em paralelo e ESPERAR (await)
    if (tagsParaDeletar.length > 0) {
      const deletePromises = tagsParaDeletar.map((tag) => {
        return fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag/${tag.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.token}`,
            },
          }
        ).then((res) => {
          if (!res.ok) {
            throw new Error(
              `Erro ao deletar tag "${tag.descricao}": ${res.statusText}`
            );
          }
          return res.json();
        });
      });
      await Promise.all(deletePromises);
    }

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(dataSend),
      }
    );

    const data = await user.json();

    if (!user.ok) {
      return new NextResponse("Invalid credentials", { status: 402 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
