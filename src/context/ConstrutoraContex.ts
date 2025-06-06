import {createContext} from 'react';

type ContrutoraType = {
    data: any;
    setData: (value: any) => void;
}

export const ConstrutoraContext = createContext<ContrutoraType>({
    data: null,
    setData: () => {},
});