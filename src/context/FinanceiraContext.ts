import { createContext } from "react";

type FinanceiraType = {
  cnpj: string;
  setCnpj: (value: string) => void;
  razaosocial: string;
  setRazaosocial: (value: string) => void;
  tel: string | null;
  setTelefone: (value: string | null) => void;
  email: string | null;
  setEmail: (value: string | null) => void;
  responsavel: string | null;
  setResponsavel: (value: string | null) => void;
  fantasia: string | null;
  setFantasia: (value: string | null) => void;
  data: any;
  setData: (value: any) => void;
  ConstrutoraCX: number[];
  setConstrutoraCX: (value: number[]) => void;
};

export const FinanceiraContext = createContext<FinanceiraType>({
  cnpj: "",
  setCnpj: () => {},
  razaosocial: "",
  setRazaosocial: () => {},
  tel: null,
  setTelefone: () => {},
  email: null,
  setEmail: () => {},
  responsavel: null,
  setResponsavel: () => {},
  fantasia: null,
  setFantasia: () => {},
  data: null,
  setData: () => {},
  ConstrutoraCX: [],
  setConstrutoraCX: () => {},
});
