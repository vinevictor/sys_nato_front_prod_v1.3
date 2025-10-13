import SidebarLayout from "@/components/sidebar/SidebarLayout";
import { GetSessionServer } from "@/lib/auth_confg";

export const runtime = 'nodejs';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout da rota /home2
 * 
 * Funcionalidades:
 * - Sidebar responsiva com toggle
 * - Altura fixa 100dvh
 * - Auto-hide em mobile/tablet
 * - Gerenciamento de sessão
 * 
 * @component
 */
export default async function Home2Layout({ children }: PrivateLayoutProps) {
  const session = await GetSessionServer();
  
  return (
    <SidebarLayout session={session?.user || null}>
      {children}
    </SidebarLayout>
  );
}