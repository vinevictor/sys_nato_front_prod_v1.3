import { DeleteSession } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await DeleteSession();
    return NextResponse.redirect(new URL("/login", req.url));
  } catch (error) {
    console.error("Erro no logout:", error);
    // Mesmo com erro, redireciona para login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
