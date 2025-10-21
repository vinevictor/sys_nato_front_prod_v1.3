"use server";
export default async function ApiCpnj(cnpj: string) {
  try {
    const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
    const data = await response.json();
    
    if (data && !data.error) {
      const result = {
        razaosocial: data.razao_social == null ? "" : data.razao_social,
        nomefantasia:
          data.estabelecimento.nome_fantasia == null
            ? ""
            : data.estabelecimento.nome_fantasia,
        email:
          data.estabelecimento.email == null ? "" : data.estabelecimento.email,
        telefone:
          data.estabelecimento.telefone1 ? `${data.estabelecimento.ddd1}${data.estabelecimento.telefone1}`: "",
      };
      return result;
    }

    return { error: true, message: "CNPJ não encontrado" };
  } catch (error) {
    return {
      error: true,
      message: "Erro ao buscar dados do CNPJ",
      data: error,
    };
  }
}
