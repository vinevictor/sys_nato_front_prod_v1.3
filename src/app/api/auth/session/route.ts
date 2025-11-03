import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = await GetSessionServer();
  if (!payload) return NextResponse.json({ session: null });
  const session = payload.user ?? null;

  return NextResponse.json({ session });
}
