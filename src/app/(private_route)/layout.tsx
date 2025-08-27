import FooterComponent from "@/components/footer";
import PrivateHeader from "@/components/layout/private-header";
import { GetSessionServer } from "@/lib/auth_confg";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = await GetSessionServer();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      <PrivateHeader session={session} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </div>
      <FooterComponent />
    </div>
  );
}