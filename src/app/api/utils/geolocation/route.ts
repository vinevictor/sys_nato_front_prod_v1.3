import { NextResponse } from "next/server";

interface GeolocationData {
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface IpAndGeolocationData {
  ip: string | null;
  geolocation: GeolocationData | null;
}

type FetchWithTimeoutOptions = RequestInit & {
  timeoutMs?: number;
};

const fetchWithTimeout = async (
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> => {
  const { timeoutMs = 3000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...fetchOptions, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const parseGeolocationData = (data: any): GeolocationData => ({
  city: data?.city ?? null,
  region: data?.region ?? null,
  country: data?.country_name ?? null,
  latitude:
    typeof data?.latitude === "number"
      ? data.latitude
      : data?.latitude
      ? Number(data.latitude)
      : null,
  longitude:
    typeof data?.longitude === "number"
      ? data.longitude
      : data?.longitude
      ? Number(data.longitude)
      : null,
});

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  let ip: string | null = null;

  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const forwardedIp = forwardedFor?.split(",")[0]?.trim();

    if (forwardedIp && forwardedIp.includes(".")) {
      ip = forwardedIp;
    }

    if (!ip) {
      const ipv4Response = await fetchWithTimeout("https://api.ipify.org?format=json", {
        timeoutMs: 3000,
      });

      if (ipv4Response.ok) {
        const ipv4Json = await ipv4Response.json();
        const ipv4Value = ipv4Json?.ip;

        if (typeof ipv4Value === "string" && ipv4Value.includes(".")) {
          ip = ipv4Value;
        }
      }
    }

    const geoUrl = ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/";

    const geoResponse = await fetchWithTimeout(geoUrl, {
      cache: "no-store",
      timeoutMs: 3000,
    });

    if (!geoResponse.ok) {
      return NextResponse.json<IpAndGeolocationData>({ ip, geolocation: null }, { status: 200 });
    }

    const geoJson = await geoResponse.json();
    const finalIp = typeof geoJson?.ip === "string" ? geoJson.ip : ip;

    return NextResponse.json<IpAndGeolocationData>(
      {
        ip: finalIp ?? ip ?? null,
        geolocation: parseGeolocationData(geoJson),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao obter geolocalização:", error);
    return NextResponse.json<IpAndGeolocationData>({ ip, geolocation: null }, { status: 200 });
  }
}
