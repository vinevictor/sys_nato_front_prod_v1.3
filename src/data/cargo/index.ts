export type Cargo = {
    id: number;
    Label: string;
    param: string;
};


export const CargoOptions: Cargo[] = [
  {
    id: 1,
    Label: "Cadastrante (user)",
    param: "Cadastrante",
  },
  {
    id: 2,
    Label: "Construtor (gestor da construtora)",
    param: "Construtor",
  },
  {
    id: 4,
    Label: "CCA (gestor do CCA)",
    param: "CCA",
  },
  {
    id: 5,
    Label: "Admin",
    param: "admin",
  },
];