import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto-tags/${id}`,
  );
  const data = await response.json();
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto-tags/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    },
  );
  const data = await response.json();
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto-tags/${id}`,
    {
      method: 'DELETE',
    },
  );
  const data = await response.json();
  return NextResponse.json(data);
}
