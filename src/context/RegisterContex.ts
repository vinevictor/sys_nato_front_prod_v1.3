import { createContext, Dispatch, SetStateAction } from "react";

interface RegisterContextType {
  Gov: boolean;
  setGov: Dispatch<SetStateAction<boolean>>;
}

export const RegisterContext = createContext<RegisterContextType>({
  Gov: false,
  setGov: () => {},
});