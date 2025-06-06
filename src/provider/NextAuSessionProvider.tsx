"use client";
interface NextAuSessionProviderProps {
  children: React.ReactNode;
}

export default function NextAuSessionProvider({
  children
}: NextAuSessionProviderProps) {
  return <>{children}</>;
}
