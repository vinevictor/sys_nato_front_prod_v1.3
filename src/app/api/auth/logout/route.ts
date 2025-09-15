import { DeleteSession, GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  await DeleteSession();
  const session = await GetSessionServer();
  if (!session) {
    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  }
  return NextResponse.json({ message: "Logout failed" }, { status: 401 });
}
