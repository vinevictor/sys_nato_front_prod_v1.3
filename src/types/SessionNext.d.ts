declare namespace SessionNext {
  /**
   * AuthUser
   * @param {Financeira[]} Financeira
   * @param {number} id
   * @param {string} nome
   * @param {Construtora[]} construtora
   * @param {string} telefone
   * @param {Empreendimento[]} empreendimento
   * @param {"ADM" | "CCA" | "GRT" | "CONST" | "USER"} hierarquia
   * @param {string} cargo
   * @param {UserRoler} role
   * @param {boolean} reset_password
   * @param {boolean} termos
   */
  interface Client {
    Financeira: Financeira[];
    id: number;
    nome: string;
    construtora: Construtora[];
    telefone: string;
    empreendimento: Empreendimento[];
    hierarquia: "ADM" | "CCA" | "GRT" | "CONST" | "USER";
    cargo: string;
    role: UserRoler | null;
    reset_password: boolean;
    termos: boolean;
  }

  /**
   * Server
   * @param {string} token
   * @param {Client} user
   * @param {number} iat
   * @param {number} exp
   */
  interface Server {
    token: string;
    user: Client;
    iat: number;
    exp: number;
  }

  /**
   * Construtora
   * @param {number} id
   * @param {string} fantasia
   */
  interface Construtora {
    id: number;
    fantasia: string;
  }

  /**
   * Empreendimento
   * @param {number} id
   * @param {string} nome
   */
  interface Empreendimento {
    id: number;
    nome: string;
  }

  /**
   * Financeira
   * @param {number} id
   * @param {string} fantasia
   */
  interface Financeira {
    id: number;
    fantasia: string;
  }

  /**
   * UserRoler
   * @param {boolean} adm
   * @param {boolean} now
   * @param {boolean} user
   * @param {boolean} alert
   * @param {boolean} direto
   * @param {boolean} chamado
   * @param {boolean} financeiro
   * @param {boolean} construtora
   * @param {boolean} lista_const
   * @param {boolean} lista_empre
   * @param {boolean} solicitacao
   * @param {boolean} lista_finace
   * @param {boolean} empreendimento
   * @param {boolean} relatorio
   */
  interface UserRoler {
    adm?: boolean;
    now?: boolean;
    user?: boolean;
    alert?: boolean;
    direto?: boolean;
    chamado?: boolean;
    financeiro?: boolean;
    construtora?: boolean;
    lista_const?: boolean;
    lista_empre?: boolean;
    solicitacao?: boolean;
    lista_finace?: boolean;
    empreendimento?: boolean;
    relatorio?: boolean;
  }
}
