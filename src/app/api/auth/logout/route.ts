import { DeleteSession } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await DeleteSession();
  return NextResponse.redirect(new URL("/login", req.url));
}
