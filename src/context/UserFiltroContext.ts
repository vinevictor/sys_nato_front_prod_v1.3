import { createContext } from "react";


type FiltroType = {
    nome: string,
    setNome: (value: string) => void,
    id: number,
    setId: (value: number) => void,
    construtora: number,
    setConstrutora: (value: number) => void,
    hierarquia: string,
    setHierarquia: (value: string) => void,
    financeira: number,
    setFinanceira: (value: number) => void,
}

export const FiltroContext = createContext<FiltroType>({
    nome: '',
    setNome: () => { },
    id: 0,
    setId: () => { },
    construtora: 0,
    setConstrutora: () => { },
    hierarquia: '',
    setHierarquia: () => { },
    financeira: 0,
    setFinanceira: () => { },
});
