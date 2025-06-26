"use client";

import BotaoJuncao from "@/components/botoes/bt_juncao";


interface PrivateHeaderProps {
  session: SessionNext.Server;
}

export default function PrivateHeader({ session }: PrivateHeaderProps) {
  return <BotaoJuncao session={session?.user || null} />;
}
