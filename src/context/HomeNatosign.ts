import { createContext } from "react";

type HomeNatosignType = {
  data: natosign.NatosignGetType;
  setData: (value: natosign.NatosignGetType) => void;
};

export const HomeNatosignContext = createContext<HomeNatosignType>({
  setData: () => {},
  data: {
    data: [],
    total: 0,
    pagina: 0,
    limite: 0,
  },
});
