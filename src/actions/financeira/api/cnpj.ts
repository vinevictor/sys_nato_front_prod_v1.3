'use server'
export default async function ApiCpnj(cnpj: string) {
  try {
    const response = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
    );
    const data = await response.json();

    if (data && !data.error) {
      const result = {
        razaosocial: data.razao_social == null ? "" : data.razao_social,
        nomefantasia: data.nome_fantasia == null ? "" : data.nome_fantasia,
        telefone: data.ddd_telefone_1 == null ? "" : data.ddd_telefone_1,
        email: data.email == null ? "" : data.email,
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
