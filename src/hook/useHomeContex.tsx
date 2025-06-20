import { useContext } from "react";
import { HomeContext } from "@/context/HomeContex";

export const dynamic = "force-dynamic";

export default function useHomeContex() {
    const context = useContext(HomeContext)

    if(context === undefined) {
        throw new Error("useHomeContex must be used within a HomeProvider")
    }

    return context
}
