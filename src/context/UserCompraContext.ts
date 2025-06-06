import { createContext } from "react";

type UserCompraType = {
    ContrutoraCX: number,
    setContrutoraCX: (value: number) => void,
    EmpreedimentoCX: number,
    setEmpreedimentoCX: (value: number) => void,
    CorretorCx: number,
    setCorretorCx: (value: number) => void,
    FinanceiraCX: number,
    setFinanceiraCX: (value: number) => void,
    ServiceTags: any,
    setServiceTags: (value: any) => void
}

export const UserCompraContext = createContext<UserCompraType>({
    ContrutoraCX: 0,
    setContrutoraCX: () => { },
    EmpreedimentoCX: 0,
    setEmpreedimentoCX: () => { },
    CorretorCx: 0,
    setCorretorCx: () => { },
    FinanceiraCX: 0,
    setFinanceiraCX: () => { },
    ServiceTags: [],
    setServiceTags: () => { }
});