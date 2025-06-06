import type { ConfigRoutes } from "@/types/route";
import { NextRequest } from "next/server";

/**
 * Função responsável por fazer um match de rotas, retornando se a rota é pública, privada ou de admin
 * @param {import("@/types/route").ConfigRoutes} route
 * @param {import("next/server").NextRequest} req
 * @returns {{
 *  isBlockRoute: boolean
 *  isPlublicRoute: boolean
 *  isPrivateRoute: boolean
 *  isAdminRoute: boolean
 * }}
 */
export const createRouteMatch = (
  route: ConfigRoutes,
  req: NextRequest
): {
  isBlockRoute: boolean;
  isPlublicRoute: boolean;
  isPrivateRoute: boolean;
} => {
  const { publicRoutes, privateRoutes, blockRoutes } = route;
  const pathName = req.nextUrl.pathname;

  // Função de correspondência de rotas
  const matchRoute = (routes: string[]): boolean => {
    return routes.some((route) => {
      // Cria uma regex onde parâmetros dinâmicos (:param) são substituídos por qualquer valor numérico ou alfanumérico
      const regex = new RegExp(`^${route.replace(/:\w+/g, "[^/]+")}$`);
      return regex.test(pathName);
    });
  };

  return {
    isBlockRoute: matchRoute(blockRoutes),
    isPlublicRoute: matchRoute(publicRoutes),
    isPrivateRoute: matchRoute(privateRoutes),
  };
};
