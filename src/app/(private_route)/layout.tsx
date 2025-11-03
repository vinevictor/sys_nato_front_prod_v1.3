import { SidebarLayout } from "@/components/sidebar";
import { GetSessionServer } from "@/lib/auth_confg";
import type { Session, SessionServer } from "@/types/session";

export const dynamic = "force-dynamic";

interface PrivateLayoutProps {
  children: React.ReactNode;
}


export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = await GetSessionServer();
  const clientSession = session?.user || null;

  return <SidebarLayout session={clientSession}>{children}</SidebarLayout>;
}
