// servidor: biblioteca de auth (removido 'use server')
"use server";
import * as jose from "jose";
import { cookies } from "next/headers";

export async function OpenSessionToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SIGNING_PRIVATE_KEY);
  const { payload } = await jose.jwtVerify(token, secret);
  return payload;
}

export async function CreateSessionServer(payload = {}) {
  const secret = new TextEncoder().encode(process.env.JWT_SIGNING_PRIVATE_KEY);
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("4h")
    .sign(secret);

  const { exp } = await OpenSessionToken(jwt);

  cookies().set("session-token", jwt, {
    expires: (exp as number) * 1000,
    path: "/",
    httpOnly: true,
  });
}

export async function GetSessionServer() {
  try {
    const token = cookies().get("session-token");
    if (!token) {
      return null;
    }
    const data: any = await OpenSessionToken(token.value);
    if (!data) {
      return null;
    }

    const cookieRole = cookies().get("session-role");
    if (!cookieRole) {
      // Busca dados do usuário mas não cria cookie (será criado pela API)
      try {
        const dataRole: any = await fetchUserData(data.token, data.user.id);
        const dadosRetorno: any = data;
        dadosRetorno.user.role = dataRole.role || null;
        dadosRetorno.user.reset_password = dataRole.reset_password || false;
        dadosRetorno.user.termos = dataRole.termos || false;
        dadosRetorno.user.status = dataRole.status || false;
        dadosRetorno.user.hierarquia = dataRole.hierarquia || "USER";
        dadosRetorno.user.construtora = dataRole.construtoras || [];
        dadosRetorno.user.empreendimento = dataRole.empreendimentos || [];
        dadosRetorno.user.Financeira = dataRole.financeiros || [];

        return await Promise.resolve(dadosRetorno);
      } catch (error) {
        // Se falhar ao buscar dados, retorna com valores padrão
        const dadosRetorno: any = data;
        dadosRetorno.user.role = null;
        dadosRetorno.user.reset_password = false;
        dadosRetorno.user.termos = false;
        dadosRetorno.user.status = false;
        dadosRetorno.user.hierarquia = "USER";
        dadosRetorno.user.construtora = [];
        dadosRetorno.user.empreendimento = [];
        dadosRetorno.user.Financeira = [];
        return await Promise.resolve(dadosRetorno);
      }
    }

    const dadosRetorno: any = data;

    const retorno = await OpenSessionToken(cookieRole.value);
    dadosRetorno.user.role = retorno.role || null;
    dadosRetorno.user.reset_password = retorno.reset_password || false;
    dadosRetorno.user.termos = retorno.termos || false;
    dadosRetorno.user.status = retorno.status || false;
    dadosRetorno.user.hierarquia = retorno.hierarquia || "USER";
    dadosRetorno.user.construtora = retorno.construtoras || [];
    dadosRetorno.user.empreendimento = retorno.empreendimentos || [];
    dadosRetorno.user.Financeira = retorno.financeiros || [];

    return await Promise.resolve(dadosRetorno);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function DeleteSession() {
  cookies().delete("session");
  cookies().delete("session-token");
}

export async function GetSessionServerApi() {
  try {
    const token = cookies().get("session-token");
    if (!token) {
      return null;
    }
    const data: any = await OpenSessionToken(token.value);
    return await Promise.resolve(data);
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Função auxiliar para buscar dados do usuário (sem modificar cookies)
async function fetchUserData(token: string, id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/get/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: {
          tags: ["user-get"],
        },
      }
    );
    const retorno = await response.json();
    if (!response.ok) {
      throw new Error(retorno.message || "Erro ao buscar dados do usuário");
    }
    return retorno;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw error;
  }
}

// Função para criar cookie de role (apenas em Server Actions/Route Handlers)
export async function updateAndCreateRoleCache(token: string, id: string) {
  try {
    const dataRole = await fetchUserData(token, id);
    await CreateRole({
      role: dataRole.role || null,
      reset_password: dataRole.reset_password || false,
      termos: dataRole.termos || false,
      status: dataRole.status || false,
      hierarquia: dataRole.hierarquia || "USER",
      construtora: dataRole.construtoras || [],
      empreendimento: dataRole.empreendimentos || [],
      Financeira: dataRole.financeiros || [],
    });
    return dataRole;
  } catch (error) {
    console.error("Erro ao atualizar cache de role:", error);
    throw error;
  }
}

export async function CreateRole(role: {}) {
  const secret = new TextEncoder().encode(process.env.JWT_SIGNING_PRIVATE_KEY);
  const jwt = await new jose.SignJWT(role)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("20m") // 20 minutos (consistente com o cookie)
    .setIssuedAt()
    .sign(secret);

  cookies().set("session-role", jwt, {
    expires: new Date(Date.now() + 20 * 60 * 1000), // 20 minutos
    path: "/",
    httpOnly: true,
  });
}
