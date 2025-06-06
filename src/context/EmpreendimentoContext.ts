import { createContext } from "react";

type EmpreendimentoType = {
    construtoraTag: string | any;
    setConstrutoraTag: (value: string | any) => void;
    FinanceiraCX: number[],
    setFinanceiraCX: (value: number[]) => void;
}

export const EmpreendimentoContext = createContext<EmpreendimentoType>({
    construtoraTag: "",
    setConstrutoraTag: () => {},
    FinanceiraCX: [],
    setFinanceiraCX: () => {},
});

