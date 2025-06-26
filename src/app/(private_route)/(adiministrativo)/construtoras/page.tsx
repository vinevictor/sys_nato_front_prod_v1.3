import ConstrutoraPage from "@/components/construtorasClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";

export const dynamic = "force-dynamic";

export default async function Construtoras() {
  const session = await GetSessionServer();

  if (!session) {
    window.location.href = "/login";
  }

  const req =
    session?.user?.hierarquia === "ADM"
      ? await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtora`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
        })
      : await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtora/${session?.user?.id}`,
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

  const data = await req.json();

  return (
    <>
      <ConstrutoraPage data={data} />
    </>
  );
}
