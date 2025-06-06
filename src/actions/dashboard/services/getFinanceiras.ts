
"use server";

import { GetSessionServer } from "@/lib/auth_confg";

export default async function GetFinanceiras() {
  const session = await GetSessionServer();

  if (!session) {
    return null;
  }

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/dashboard/financeiras`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    }
  );

  if (!req.ok) {
    return null;
  }

  return await req.json();
}
