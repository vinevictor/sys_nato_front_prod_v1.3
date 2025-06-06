import { createContext } from "react";

type HomeType = {
  data: solictacao.SolicitacaoGetType;
  setData: (value: solictacao.SolicitacaoGetType) => void;
};

export const HomeContext = createContext<HomeType>({
  setData: () => {},
  data: {
    data: [],
    total: 0,
    pagina: 0,
    limite: 0,
  },
});
