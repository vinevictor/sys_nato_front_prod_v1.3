import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reqest = await fetch(`${process.env.EXPRESS_API_VIDEOS_FAQ}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
