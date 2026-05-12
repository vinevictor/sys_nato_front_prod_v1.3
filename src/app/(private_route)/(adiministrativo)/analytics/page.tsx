export const dynamic = "force-dynamic";

import { GetSessionServer } from "@/lib/auth_confg";
import { redirect } from "next/navigation";
import DashboardClientWrapper from "@/components/dashboard/DashboardClientWrapper";
import AnalyticsView from "@/components/dashboard/AnalyticsView";
import { Box } from "@chakra-ui/react";

export default async function AnalyticsAdminPage({
  searchParams,
}: {
  searchParams: {
    startDate?: string;
    endDate?: string;
    construtoraId?: string;
    financeiroId?: string;
  };
}) {
  const session = await GetSessionServer();

  if (!session || session.user.role.adm !== true) {
    redirect("/dashboard");
  }

  const agora = new Date();
  const primeiroDiaMesPassado = new Date(
    agora.getFullYear(),
    agora.getMonth() - 1,
    1
  );
  const ultimoDiaMesPassado = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    0
  );

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const defaultStart = formatDate(primeiroDiaMesPassado);
  const defaultEnd = formatDate(ultimoDiaMesPassado);

  const startDate = searchParams.startDate || defaultStart;
  const endDate = searchParams.endDate || defaultEnd;

  const query = new URLSearchParams({
    startDate,
    endDate,
    ...(searchParams.construtoraId && {
      construtoraId: searchParams.construtoraId,
    }),
    ...(searchParams.financeiroId && {
      financeiroId: searchParams.financeiroId,
    }),
  }).toString();

  try {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const headers = { Authorization: `Bearer ${session.token}` };

    // Buscamos tudo em paralelo
    const [resOverview, resRanking, resConstrutoras, resFinanceiras] =
      await Promise.all([
        fetch(`${baseUrl}/analytics/overview?${query}`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${baseUrl}/analytics/ranking?${query}`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${baseUrl}/dashboard/construtoras`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${baseUrl}/dashboard/financeiras`, {
          headers,
          cache: "no-store",
        }),
      ]);

    const overview = await resOverview.json();
    const ranking = await resRanking.json();
    const listConstrutoras = await resConstrutoras.json();
    const listFinanceiras = await resFinanceiras.json();

    return (
      <DashboardClientWrapper>
        <AnalyticsView
          overview={overview}
          ranking={ranking}
          startDate={startDate}
          endDate={endDate}
          currentFilters={searchParams}
          // Passamos as listas para popular os Selects do filtro
          lists={{
            construtoras: listConstrutoras || [],
            financeiras: listFinanceiras || [],
          }}
        />
      </DashboardClientWrapper>
    );
  } catch (error) {
    console.error("Erro ao carregar Analytics:", error);
    return <Box p={8}>Erro ao carregar dados do servidor.</Box>;
  }
}
