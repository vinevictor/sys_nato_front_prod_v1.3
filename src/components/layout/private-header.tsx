"use client";

import BotaoJuncao from "@/components/botoes/bt_juncao";
import { Session } from "@/types/session";


interface PrivateHeaderProps {
  session: Session.SessionServer;
}

export default function PrivateHeader({ session }: PrivateHeaderProps) {
  const clientSession = session.user || null;

  return <BotaoJuncao session={clientSession} />;
}
