"use server";

export default async function ApiCpnjJson(cnpj: string) {
  // console.log("🚀 ~ ApiCpnjJson ~ cnpj:", cnpj)
  try {
    if (!cnpj) {
      throw new Error("CNPJ obrigatório");
    }
    const response = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "PostmanRuntime/7.30.0"
        }
      }
    );

    if (!response.ok) {
      throw new Error("CNPJ não encontrado");
    }

    const data = await response.json();
    return {
      error: false,
      message: "CNPJ encontrado",
      data: data
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      data: error
    };
  }
}
