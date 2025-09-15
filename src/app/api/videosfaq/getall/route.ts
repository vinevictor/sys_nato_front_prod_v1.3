import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reqest = await fetch(`${process.env.EXPRESS_API_VIDEOS_FAQ}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        // revalida a cada 5 dias
        revalidate: 60 * 60 * 24 * 5,
      },
    });

    if (!reqest.ok) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    const body = await reqest.json();
    const data = body.map((arquivo: any) => {
      return {
        id: arquivo.id,
        src: `${process.env.ROUTE_API_VIEW_VIDEO}/${arquivo.src}`,
        title: arquivo.title,
      };
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
