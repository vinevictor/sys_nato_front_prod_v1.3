export type SuporteTags = {
    id: number;
    label: string;
};

export type SuporteTagsProps = SuporteTags[];
/**
 * TagsOptions
 * @returns TagsProps [{ id: number, label: string }]
 */
export const SuporteTagsOptions: SuporteTagsProps = [
    {
        id: 1,
        label: 'Esqueceu a senha',
    },
    {
        id: 2,
        label: 'Instalação do BirdID',
    },
    {
        id: 3,
        label: 'Emissão Certificado',
    },
    {
        id: 4,
        label: 'Sincronização Certificado',
    },
    {
        id: 5,
        label: 'Assinatura de Contrato',
    },
    {
        id: 6,
        label: 'Email do cliente, foi registrado incorretamente',
    },
    {
        id: 7,
        label: 'Credito zerado',
    }
]