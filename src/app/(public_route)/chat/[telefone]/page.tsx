import ChatClienteApp from "@/components/chat/cliente/ChatClienteApp";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Atendimento",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#023147",
};

export const dynamic = "force-dynamic";

/** Link enviado pelo WhatsApp: /chat/+5516999999999 */
export default function ChatClienteTelefonePage({
  params,
}: {
  params: { telefone: string };
}) {
  return <ChatClienteApp telefone={decodeURIComponent(params.telefone)} />;
}
