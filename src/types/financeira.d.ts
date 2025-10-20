export type FinanceiraTypeById = {
  id: number;
  cnpj: string;
  razaosocial: string;
  fantasia: string;
  tel: string;
  email: string;
  obs: string;
  createdAt: string;
  updatedAt: string;
  direto: boolean;
  responsavel: string;
  valor_cert: number;
  Intelesign_status: boolean;
  Intelesign_price: number;
  status: boolean;
  construtoras: {
    id: number;
    fantasia: string;
  }[];
};
