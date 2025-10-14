export type EmpreedimentoType = {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  construtora: {
    id: number;
    fantasia: string;
  };
  financeiros: {
    financeiro: {
      id: number;
      fantasia: string;
    };
  }[];
};