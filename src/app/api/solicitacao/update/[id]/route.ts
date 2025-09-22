import { GetSessionServer } from "@/lib/auth_confg";
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
    };
    const session = await GetSessionServer();

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
    const tagsSalvas = await response.json();

    if (tagsSalvas.length < tags.length) {
      try {
        // selecionar ids das tags salvas
        const tagsSalvasDescriptions = new Set(
          tagsSalvas.map((tagSalva: any) => tagSalva.descricao)
        );

        // selecionar tags novas
        const newTagsToCreate = tags.filter(
          (novaTag: any) => !tagsSalvasDescriptions.has(novaTag.label)
        );

        // criar tags novas
        if (newTagsToCreate.length > 0) {
          newTagsToCreate.map(async (tagToCreate: any) => {
            const createResponse = await fetch(
              `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session?.token}`,
                },
                body: JSON.stringify({
                  descricao: tagToCreate.label,
                  solicitacao: +id,
                }),
              }
            );

            if (!createResponse.ok) {
              throw new Error(
                `Erro ao criar tag "${tagToCreate.label}": ${createResponse.statusText}`
              );
            }

            return createResponse.json();
          });
        }
      } catch (error) {
        console.error("Erro no processo de gerenciamento de tags:", error);
      }
    }

    if (tagsSalvas.length > tags.length) {
      // verificar quais a tags que foram removidas
      const tagsRemovidas = tagsSalvas.filter(
        (tagSalva: any) => !tags.some((tag: any) => tag.id === tagSalva.id)
      );

      // selecionar ids das tags removidas
      const idsTagsRemovidas = tagsRemovidas.map((tag: any) => tag.id);

      // deletar tags removidas
      idsTagsRemovidas.map(async (id: number) => {
        const deleteResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );

        if (!deleteResponse.ok) {
          throw new Error(
            `Erro ao deletar tag "${id}": ${deleteResponse.statusText}`
          );
        }

        return deleteResponse.json();
      });
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
