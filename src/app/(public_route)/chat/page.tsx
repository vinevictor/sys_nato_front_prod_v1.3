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

/** /chat sem telefone: pede telefone + CPF (ou usa o token salvo) */
export default function ChatClientePage() {
  return <ChatClienteApp />;
}
