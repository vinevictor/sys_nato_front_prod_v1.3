// servidor: biblioteca de auth (removido 'use server')
"use server";
import * as jose from "jose";
import { cookies } from "next/headers";
import type { SessionServer } from "@/types/session";

type ExtendedAuthUser = SessionServer["user"] & {
  status?: boolean;
};

type RoleCache = {
  role: ExtendedAuthUser["role"] | null;
  reset_password: boolean;
  termos: boolean;
  status: boolean;
  hierarquia: ExtendedAuthUser["hierarquia"];
  construtora: ExtendedAuthUser["construtora"];
  empreendimento: ExtendedAuthUser["empreendimento"];
  Financeira: ExtendedAuthUser["Financeira"];
};

function isRoleCache(value: unknown): value is RoleCache {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    ("reset_password" in data && typeof data.reset_password === "boolean") &&
    ("termos" in data && typeof data.termos === "boolean") &&
    ("status" in data && typeof data.status === "boolean")
  );
}

export async function OpenSessionToken(token: string) {
  if (!token || typeof token !== "string" || token.trim() === "") {
    throw new Error("Token inválido ou vazio");
  }

  const jwtKey = process.env.JWT_SIGNING_PRIVATE_KEY;
  if (!jwtKey) {
    throw new Error("JWT_SIGNING_PRIVATE_KEY não configurada no ambiente");
  }

  try {
    const secret = new TextEncoder().encode(jwtKey);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("Erro ao verificar token JWT:", error);
    throw new Error(`Falha na verificação do token: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

export async function CreateSessionServer(payload: Record<string, any> = {}): Promise<{ success: boolean; error?: string }> {
  try {
    // Validação do ambiente
    const jwtKey = process.env.JWT_SIGNING_PRIVATE_KEY;
    if (!jwtKey) {
      const errorMsg = "JWT_SIGNING_PRIVATE_KEY não configurada no ambiente";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Validação do payload
    if (!payload || typeof payload !== "object") {
      const errorMsg = "Payload inválido para criação de sessão";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Criação do JWT
    const secret = new TextEncoder().encode(jwtKey);
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("12h")
      .sign(secret);

    if (!jwt) {
      const errorMsg = "Falha ao gerar token JWT";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Verificação do token gerado
    const { exp } = await OpenSessionToken(jwt);

    if (!exp || typeof exp !== "number") {
      const errorMsg = "Token gerado sem data de expiração válida";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Definição do cookie
    const cookieStore = cookies();
    cookieStore.set("session-token", jwt, {
      expires: new Date((exp as number) * 1000),
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true };
  } catch (error) {
    const errorMsg = `Erro ao criar token de sessão: ${error instanceof Error ? error.message : "Erro desconhecido"}`;
    console.error(errorMsg, error);
    return { success: false, error: errorMsg };
  }
}

/**
 * Aplica valores padrão aos dados do usuário
 * Centraliza a lógica de fallback para evitar duplicação
 */
function applyDefaultUserValues(user: ExtendedAuthUser) {
  user.role = ({} as SessionServer["user"]["role"]);
  user.reset_password = false;
  user.termos = false;
  user.status = false;
  user.hierarquia = "USER";
  user.construtora = [];
  user.empreendimento = [];
  user.Financeira = [];
}

/**
 * Atualiza dados do usuário com dados da API
 * Centraliza a lógica de mapeamento para evitar duplicação
 */
function updateUserDataFromApi(user: ExtendedAuthUser, apiData: any) {
  user.role = (apiData.role as SessionServer["user"]["role"]) || ({} as SessionServer["user"]["role"]);
  user.reset_password = apiData.reset_password || false;
  user.termos = apiData.termos || false;
  user.status = apiData.status || false;
  user.hierarquia = apiData.hierarquia || "USER";
  user.construtora = apiData.construtoras || [];
  user.empreendimento = apiData.empreendimentos || [];
  user.Financeira = apiData.financeiros || [];
}

/**
 * Atualiza dados do usuário com dados do cookie
 * Centraliza a lógica de mapeamento do cache
 */
function updateUserDataFromCache(user: ExtendedAuthUser, cacheData: RoleCache) {
  user.role = cacheData.role || ({} as SessionServer["user"]["role"]);
  user.reset_password = cacheData.reset_password || false;
  user.termos = cacheData.termos || false;
  user.status = cacheData.status || false;
  user.hierarquia = cacheData.hierarquia || "USER";
  user.construtora = cacheData.construtora || [];
  user.empreendimento = cacheData.empreendimento || [];
  user.Financeira = cacheData.Financeira || [];
}

/**
 * Cria objeto de role normalizado para o cookie
 */
function createRolePayload(data: any): RoleCache {
  return {
    role: (data.role as SessionServer["user"]["role"]) || null,
    reset_password: data.reset_password || false,
    termos: data.termos || false,
    status: data.status || false,
    hierarquia: data.hierarquia || "USER",
    construtora: data.construtoras || data.construtora || [],
    empreendimento: data.empreendimentos || data.empreendimento || [],
    Financeira: data.financeiros || data.Financeira || [],
  };
}

/**
 * Realiza o parse seguro dos dados de role armazenados no cookie
 * Retorna null quando o conteúdo não é um JSON válido.
 */
function parseRoleCookie(value?: string | null): RoleCache | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (!isRoleCache(parsed)) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn("Aviso: Cookie session-role corrompido, recriando...", error);
    return null;
  }
}

/**
 * Valida o payload retornado pelo JWT garantindo a estrutura mínima esperada.
 */
function isValidSessionPayload(payload: unknown): payload is SessionServer {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const data = payload as Record<string, unknown>;
  const user = data.user as Record<string, unknown> | undefined;

  return (
    typeof data.token === "string" &&
    typeof user === "object" &&
    typeof user.id !== "undefined"
  );
}

/**
 * Busca dados do usuário da API e atualiza o cache
 */
async function fetchAndCacheUserData(
  token: string,
  userId: number,
  user: ExtendedAuthUser,
) {
  try {
    // Validação dos parâmetros
    if (!token || typeof token !== "string" || token.trim() === "") {
      console.warn("Token inválido ao buscar dados do usuário");
      applyDefaultUserValues(user);
      return;
    }

    if (!userId || typeof userId !== "number" || userId <= 0) {
      console.warn("ID de usuário inválido ao buscar dados");
      applyDefaultUserValues(user);
      return;
    }

    const apiData = await fetchUserData(token, userId);

    if (!apiData) {
      console.warn("Dados da API não retornados");
      applyDefaultUserValues(user);
      return;
    }

    updateUserDataFromApi(user, apiData);

    // Tenta criar cache em background sem bloquear
    const rolePayload = createRolePayload(apiData);
    CreateRole(rolePayload).catch((err) =>
      console.warn("Aviso: Não foi possível criar session-role:", err)
    );
  } catch (error) {
    console.warn("Aviso: Erro ao buscar dados do usuário:", error);
    applyDefaultUserValues(user);
  }
}

/**
 * Obtém sessão do servidor com cache otimizado
 * Reduz duplicação de código e melhora performance
 */
export async function GetSessionServer(): Promise<SessionServer | null> {
  try {
    // Validação do token principal
    const cookieStore = cookies();
    const token = cookieStore.get("session-token");

    if (!token || !token.value || token.value.trim() === "") {
      console.warn("Token de sessão não encontrado ou vazio");
      return null;
    }

    // Validação do payload do token
    let payload;
    try {
      payload = await OpenSessionToken(token.value);
    } catch (error) {
      console.error("Erro ao abrir token de sessão:", error);
      // Token inválido ou expirado - limpa cookies
      await DeleteSession().catch(() => {});
      return null;
    }

    if (!isValidSessionPayload(payload)) {
      console.warn("Aviso: Payload de sessão inválido recebido.");
      await DeleteSession().catch(() => {});
      return null;
    }

    const session: SessionServer = {
      ...payload,
      user: { ...payload.user } as ExtendedAuthUser,
    };

    // Validação adicional do usuário
    if (!session.user.id || typeof session.user.id !== "number") {
      console.error("ID do usuário inválido na sessão");
      await DeleteSession().catch(() => {});
      return null;
    }

    const roleData = parseRoleCookie(cookieStore.get("session-role")?.value);
    const userId = session.user.id;

    if (roleData) {
      updateUserDataFromCache(session.user, roleData);
      return session;
    }

    // Busca dados da API apenas se não houver cache
    await fetchAndCacheUserData(session.token, userId, session.user);
    return session;
  } catch (error) {
    console.error("Erro crítico na sessão:", error);
    // Em caso de erro crítico, limpa a sessão
    await DeleteSession().catch((e) => console.error("Erro ao limpar sessão:", e));
    return null;
  }
}

export async function DeleteSession() {
  const session= await cookies();
   session.delete("session-token");
   session.delete("session-role"); // Limpa cache auxiliar
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
async function fetchUserData(token: string, id: number) {
  // Validação da URL da API
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_STRAPI_API_URL não configurada no ambiente");
  }

  // Validação dos parâmetros
  if (!token || typeof token !== "string" || token.trim() === "") {
    throw new Error("Token inválido para buscar dados do usuário");
  }

  if (!id || typeof id !== "number" || id <= 0) {
    throw new Error("ID de usuário inválido para buscar dados");
  }

  try {
    const url = `${apiUrl}/user/get/${id}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ["user-get"],
      },
      cache: "no-store", // Evita cache de dados sensíveis
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Erro desconhecido" }));
      throw new Error(
        errorData.message ||
        `Erro ${response.status}: ${response.statusText}`
      );
    }

    const retorno = await response.json();

    if (!retorno || typeof retorno !== "object") {
      throw new Error("Resposta da API inválida");
    }

    return retorno;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Erro desconhecido";
    console.error(`Erro ao buscar dados do usuário (ID: ${id}):`, errorMsg);
    throw error;
  }
}

// Função para criar cookie de role (apenas em Server Actions/Route Handlers)
export async function updateAndCreateRoleCache(token: string, id: number): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Validação dos parâmetros
    if (!token || typeof token !== "string" || token.trim() === "") {
      const errorMsg = "Token inválido ou vazio";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!id || typeof id !== "number" || id <= 0) {
      const errorMsg = "ID do usuário inválido";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Busca dados do usuário
    const dataRole = await fetchUserData(token, id);

    if (!dataRole) {
      const errorMsg = "Dados do usuário não encontrados";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Cria o cache de role
    const rolePayload = createRolePayload(dataRole);
    const roleResult = await CreateRole(rolePayload);

    if (!roleResult.success) {
      console.error("Falha ao criar cache de role:", roleResult.error);
      return { success: false, error: roleResult.error };
    }

    return { success: true, data: dataRole };
  } catch (error) {
    const errorMsg = `Erro ao atualizar cache de role: ${error instanceof Error ? error.message : "Erro desconhecido"}`;
    console.error(errorMsg, error);
    return { success: false, error: errorMsg };
  }
}

export async function CreateRole(role: any): Promise<{ success: boolean; error?: string }> {
  try {
    // Validação do role
    if (!role || typeof role !== "object") {
      const errorMsg = "Dados de role inválidos";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Validação dos campos obrigatórios
    if (!("reset_password" in role) || typeof role.reset_password !== "boolean") {
      const errorMsg = "Campo reset_password obrigatório e deve ser boolean";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!("termos" in role) || typeof role.termos !== "boolean") {
      const errorMsg = "Campo termos obrigatório e deve ser boolean";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!("status" in role) || typeof role.status !== "boolean") {
      const errorMsg = "Campo status obrigatório e deve ser boolean";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Serialização do role
    const roleJson = JSON.stringify(role);

    if (!roleJson || roleJson === "null" || roleJson === "undefined") {
      const errorMsg = "Falha ao serializar dados de role";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Definição do cookie
    const cookieStore = cookies();
    cookieStore.set("session-role", roleJson, {
      expires: new Date(Date.now() + 20 * 60 * 1000), // 20 minutos
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true };
  } catch (error) {
    const errorMsg = `Erro ao criar cookie de role: ${error instanceof Error ? error.message : "Erro desconhecido"}`;
    console.error(errorMsg, error);
    return { success: false, error: errorMsg };
  }
}
