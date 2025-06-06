import type { ConfigRoutes } from "@/types/route";

export const APP_ROUTES: ConfigRoutes = {
  blockRoutes: ["/home"],
  publicRoutes: ["/login", "/reset-password", "/termos/uso", "/suportefaq"],
  privateRoutes: [
    "/",
    "/solicitacoes",
    "/solicitacoes/:id",
    "/aprovacao",
    "/aprovacao/:id",
    "/perfil",
    "/perfil/:id",
    "/register",
    "/dashboard",
    "/usuarios",
    "/usuarios/:id",
    "/usuarios/cadastrar",
    "/financeiras",
    "/financeiras/:id",
    "/financeiras/cadastrar",
    "/empreendimentos",
    "/empreendimentos/:id",
    "/empreendimentos/cadastrar"
  ],
};
