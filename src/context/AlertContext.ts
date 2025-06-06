import { createContext } from "react";

export const AlertContext = createContext<any>({
    Alert: false,
    setAlert: () => {},
});