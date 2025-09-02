import { NextRequest, NextResponse } from "next/server";
import { GetSessionServer } from "./lib/auth_confg";

const publicRoutes = ["/login", "/faq", "/termos/privacidade", "/termos/uso", "/api/auth", "/api/auth/logout", "/api/faq", "/api/video-thumbnail", "/api/video-proxy", "/faq/videos-tutoriais", "/teste-video", "/faq/autenticacao-gov","/faq/biometria-senha","/faq/instalacao-certificado-app","/faq/perguntas-frequentes","/faq/senha-app","/suportefaq/senha-bird-id","/faq/senha-emissao","/faq/sincronizar-conta","/faq/primeiro-acesso","/faq/recuperacao-senhas","/faq/recuperacao-senhas"];

export async function middleware(req: NextRequest) {
  const session = await GetSessionServer();
  
  const { pathname } = req.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!session) {
    if (isPublicRoute) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if(session && pathname.startsWith("/api")){
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

}

export const config = {
  matcher: "/((?!_next|favicon.ico|public|.*\\..*).*)",
};
