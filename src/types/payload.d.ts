export interface Payload {
    token: string;
    user: {
        id: number;
        nome: string;
        telefone: string;
        hierarquia: string;
        cargo: string;
    };
    iat: number;
    exp: number;
}
