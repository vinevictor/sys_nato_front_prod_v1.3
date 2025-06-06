export type Cargo = {
    id: number;
    Label: string;
    param: string;
};


export const CargoOptions:  Cargo[] = [
    {
        id : 1,
        Label: 'Vendedor',
        param: 'vendedor',

    },
    {
        id : 2,
        Label: 'Construtor',
        param: 'construtor',
    },
    {
        id : 3,
        Label: 'Gerente',
        param: 'gerente',
    },
    {
        id : 4,
        Label: 'Financeiro',
        param: 'financeiro',
    },
    {
        id : 5,
        Label: 'Admin',
        param: 'admin',
    }
]