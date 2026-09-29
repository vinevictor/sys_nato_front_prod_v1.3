/**
 * Regras de acesso do Agente Imobiliário (hierarquia "IMOB").
 *
 * O agente só pode usar o NatoDoc e o FAQ de suporte; qualquer outra rota
 * da área logada é redirecionada para o NatoDoc.
 */

export const HIERARQUIA_IMOBILIARIA = "IMOB";

/** Página inicial do agente imobiliário */
export const HOME_AGENTE_IMOBILIARIO = "/natodoc";

/** Prefixos de rota liberados para o agente imobiliário */
const ROTAS_PERMITIDAS = [
  "/natodoc",
  "/faq",
  "/suportefaq",
  "/termos",
  "/reset-password",
];

/** Rotas de API liberadas (o restante é bloqueado com 403) */
const APIS_PERMITIDAS = [
  "/api/natodoc",
  "/api/auth",
  "/api/faq",
  "/api/videosfaq",
  "/api/video-thumbnail",
  "/api/video-proxy",
  "/api/termo",
  "/api/reset_password",
  "/api/utils",
];

const casaPrefixo = (pathname: string, prefixo: string) =>
  pathname === prefixo || pathname.startsWith(`${prefixo}/`);

export function isAgenteImobiliario(
  user: { hierarquia?: string | null } | null | undefined
): boolean {
  return user?.hierarquia === HIERARQUIA_IMOBILIARIA;
}

export function rotaPermitidaAgenteImobiliario(
  pathname: string,
  userId: number
): boolean {
  // Modal de primeiro acesso consulta os próprios dados do usuário
  if (pathname === `/api/usuario/getId/${userId}`) {
    return true;
  }
  const lista = pathname.startsWith("/api/") ? APIS_PERMITIDAS : ROTAS_PERMITIDAS;
  return lista.some((prefixo) => casaPrefixo(pathname, prefixo));
}
