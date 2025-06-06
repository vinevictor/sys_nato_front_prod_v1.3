import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
