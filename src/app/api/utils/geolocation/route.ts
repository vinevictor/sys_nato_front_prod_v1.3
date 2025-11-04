import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const req = await fetch('http://ip-api.com/json/')
    const data = await req.json()
    return NextResponse.json({
      ip: data.query || "indisponível",
      geolocation: {
        city: data.city || "indisponível",
        region: data.region || "indisponível",
        country: data.country || "indisponível",
        timezone: data.timezone || "indisponível",
        operadora: data.isp || "indisponível",
        lat: data.lat || 0,
        lng: data.lon || 0,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter geolocalização:", error);
    return NextResponse.json({ ip: 'indisponível', geolocation: null }, { status: 200 });
  }
}
