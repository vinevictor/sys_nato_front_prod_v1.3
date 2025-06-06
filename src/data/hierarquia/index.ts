export type Hierarquia = {
    id: number;
    Label: string;
    param: string;
};


export const HierarquiaOptions: Hierarquia[] = [
    {
        id : 1,
        Label: 'Vendedor',
        param: 'USER'
    },
    {
        id: 2,
        Label: 'Construtora',
        param: 'CONST'
    },
    {
        id: 3,
        Label: 'CCA',
        param: 'CCA'
    },
    {
        id: 4,
        Label: 'Administrador',
        param: 'ADM'
    },
    {
        id: 5,
        Label: 'Gerente',
        param: 'GRT'
    }
]