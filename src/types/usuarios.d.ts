declare namespace UsuariosType {
  /**
   * @type {GetAllUsers}
   * @param {number} id
   * @param {string} nome
   * @param {string} cargo
   * @param {string} hierarquia
   * @param {Empreedimento[]} empreendimento
   * @param {Construtora[]} construtora
   * @param {Financeira[]} Financeira
   * @param {string} telefone
   * @param {string} email
   * @param {string} cpf
   * @param {boolean} sms_relat
   * @param {Date | string | any} createdAt
   * @param {boolean} status
   */
  interface GetAllUsers {
    id: number;
    nome: string;
    cargo: string;
    hierarquia: string;
    empreendimento: Empreedimento[];
    construtoras: Construtora[];
    Financeira: Financeira[];
    telefone: string;
    email: string;
    cpf: string;
    sms_relat: boolean;
    createdAt: string | any | Date;
    status: boolean;
  }

  interface PostUpdateUser {
    nome: string;
    cargo: string;
    hierarquia: string;
    empreendimento: any | string[];
    construtora: any | string[];
    Financeira: any | string[];
    telefone: string;
    email: string;
    cpf: string;
    sms_relat: boolean;
  }
}

/**
 * @type {Empreedimento}
 * @param {number} id
 * @param {string} nome
 * @param {string} uf
 * @param {string} cidade
 */
type Empreedimento = {
  id: number;
  nome: string;
  uf: string;
  cidade: string;
};

/**
 * @type {Construtora}
 * @param {number} id
 * @param {string} fantasia
 * @param {string} tel
 * @param {string} email
 */
type Construtora = {
  id: number;
  fantasia: string;
  tel: string;
  email: string;
};

declare namespace FinanceiraType {
  /**
   * @type {Financeira}
   * @param {number} id
   * @param {string} fantasia
   * @param {string} tel
   * @param {string} email
   */
  type Financeira = {
    id: number;
    fantasia: string;
    tel: string;
    email: string;
  };

  interface GetAllFinanceiras {
    id: number;
    cnpj: string;
    razaosocial: string;
    tel: string;
    email: string;
    responsavel: string;
    fantasia: string;
  }
}
