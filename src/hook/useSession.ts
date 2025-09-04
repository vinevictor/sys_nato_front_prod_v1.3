// retornar o payload do token session do cookies
import { useState, useEffect } from "react";
import { SessionClient } from "@/types/session";

export const useSession = (): SessionClient | null => {
  const [session, setSession] = useState<SessionClient | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/session");
      const json = await res.json();
      setSession(json.session);
    })();
  }, []);

  return session;
};
