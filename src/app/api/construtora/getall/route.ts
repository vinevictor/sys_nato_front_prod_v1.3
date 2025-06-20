import crypto from 'crypto';
import { DeleteSession, GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await GetSessionServer();
    if (!session) {
      await DeleteSession();
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtora`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        cache: "force-cache",
        next: {
          tags: ["construtora-all"],
        },
      }
    );

    const data = await req.json();
    if (!req.ok) {
      throw new Error(data.message);
    }


    const bodyString = JSON.stringify(data);
    const etag = crypto.createHash('md5').update(bodyString).digest('hex');


    const ifNoneMatch = request.headers.get('If-None-Match');
    if (ifNoneMatch === etag) {

      return new NextResponse(null, { status: 304 });
    }


    return NextResponse.json(data, {
      status: 200,
      headers: {
        'ETag': etag,
        'Cache-Control': 'private, max-age=0, must-revalidate',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
