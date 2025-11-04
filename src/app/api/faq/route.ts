import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/file/sisnato/videos/faq`;
    const reqest = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        //revalidar com 1 hora
        next: { revalidate: 60 * 60 },
      }
    );

    const data = await reqest.json();
    if (!reqest.ok) {
      throw new Error(data.message);
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
