import { useContext } from "react";
import { HomeNatosignContext } from "@/context/HomeNatosign";

export const dynamic = "force-dynamic";

export default function useHomeNatosignContex() {
  const context = useContext(HomeNatosignContext);

  if (context === undefined) {
    throw new Error("useHomeContex must be used within a HomeProvider");
  }

  return context;
}
