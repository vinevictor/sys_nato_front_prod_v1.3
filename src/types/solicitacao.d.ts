declare namespace solictacao {
  /**
   * SolicitacaoGetType
   * @param {number} id
   * @param {string} nome
   * @param {string} cpf
   * @param {boolean} distrato
   * @param {string | Date | null} dt_agendamento
   * @param {string | Date | null} hr_agendamento
   * @param {string | Date | null} dt_aprovacao
   * @param {string | Date | null} hr_aprovacao
   * @param {string} type_validacao
   * @param {boolean} alertanow
   * @param {boolean} ativo
   * @param {boolean} statusAtendimento
   * @param {boolean} pause
   * @param {string} andamento
   * @param {object} corretor { id: number, nome: string }
   * @param {object} construtora { id: number, fantasia: string }
   * @param {object} empreendimento { id: number, nome: string, cidade: string }
   * @param {object} financeiro { id: number, fantasia: string }
   * @param {number} id_fcw
   * @param {object[]} tags { id: number, solicitacao: number, descricao: string, createdAt: string | Date }
   * @param {string | Date} createdAt
   */
  interface SolicitacaoObjectType {
    id: number;
    nome: string;
    cpf: string;
    distrato: boolean;
    dt_agendamento: string | Date | null;
    hr_agendamento: string | Date | null;
    dt_aprovacao: string | Date | null;
    hr_aprovacao: string | Date | null;
    type_validacao: string;
    alertanow: boolean;
    ativo: boolean;
    statusAtendimento: boolean;
    pause: boolean;
    andamento: string;
    corretor: {
      id: number;
      nome: string;
    };
    construtora: {
      id: number;
      fantasia: string;
    };
    empreendimento: {
      id: number;
      nome: string;
      cidade: string;
    };
    financeiro: {
      id: number;
      fantasia: string;
    };
    id_fcw: number;
    tags: [
      {
        id: number;
        solicitacao: number;
        descricao: string;
        createdAt: string | Date;
      }
    ];
    createdAt: string | Date;
  }
  interface SolicitacaoObjectCompleteType {
  id: number;
  nome: string;
  cpf: string;

  ativo: boolean;
  statusAtendimento: boolean;
  pause: boolean;
  andamento: string;

  valorcd: number | null;
  dt_nascimento: string;               // ISO string recebida do back-end
  telefone?: string | null;
  telefone2?: string | null;
  email?: string | null;

  corretor?: {
    id: number;
    nome: string;
  } | null;

  construtora?: {
    id: number;
    fantasia: string;
  } | null;

  empreendimento?: {
    id: number;
    nome: string;
    cidade?: string;
  } | null;

  financeiro?: {
    id: number;
    fantasia: string;
  } | null;

  id_fcw: number | null;

  distrato?: boolean;
  distrato_id?: number | null;
  distrato_dt?: string | null;

  alertanow: boolean;

  // coleções
  tags: {
    id: number;
    solicitacao: number;
    descricao: string;
    createdAt: string;
  }[];

  // datas
  createdAt: string;
  dt_agendamento: string | null;
  hr_agendamento: string | null;
  dt_aprovacao: string | null;
  hr_aprovacao: string | null;

  // uploads & docs
  docSuspenso?: boolean;
  uploadCnh?: string | null;
  uploadRg?: string | null;

  // logs
  logDelete?: React.JSX.Element;

  }

  /**
   * SolicitacaoPutType
   * @param {string} nome
   * @param {string} cpf
   * @param {string} email
   * @param {number} corretor
   * @param {number} construtora
   * @param {string} telefone
   * @param {Date | string | any} dt_nascimento
   * @param {boolean} ass_doc
   * @param {string} link_doc
   * @param {number | null} id_fcw
   * @param {string} obs
   * @param {string} alert
   * @param {number} empreedimento
   * @param {number} Financeira
   * @param {string} cnh
   * @param {string} uploadCnh
   * @param {string[]} relacionamento
   * @param {string} telefone2
   * @param {string} uploadRg
   *
   */
  interface SolicitacaoPutType {
    nome?: string;
    cpf?: string;
    email?: string;
    corretor?: number;
    construtora?: number;
    Financeira?: number;
    telefone?: string;
    dt_nascimento?: Date | string | any;
    ass_doc?: boolean;
    link_doc?: string;
    id_fcw?: number | null;
    obs?: string;
    empreedimento?: number;
    cnh?: string;
    uploadCnh?: string;
    relacionamento?: string[];
    telefone2?: string;
    uploadRg?: string;
    mult_link?: string[];
    mult_ass_doc?: string[];
    rela_quest?: boolean;
  }
  /**
   * AlertProps
   * @param {number} id
   * @param {string} titulo
   * @param {string} texto
   * @param {number} solicitacao_id
   * @param {number} corretor
   * @param {string} tipo
   * @param {string} tag
   * @param {number} empreendimento
   */
  interface AlertProps {
    status: boolean | null | undefined;
    id: number;
    titulo: string;
    texto: string;
    solicitacao_id: number;
    corretor: number;
    tipo: string;
    tag: string;
    empreendimento: number;
    rela_quest: boolean;
    createdAt: Date | string | any;
  }

  /**
   * SolicitacaoPost
   * @param {string} url
   * @param {string} nome
   * @param {string} telefone
   * @param {string} cpf
   * @param {string} telefone2
   * @param {Date | string | any} dt_nascimento
   * @param {string} email
   * @param {string} uploadRg
   * @param {string} uploadCnh
   * @param {number} empreedimento
   * @param {number} construtora
   * @param {number} financeiro
   * @param {number} corretor
   * @param {string[]} relacionamento
   * @param {string} cpfdois
   * @param {boolean} rela_quest
   * @param {string} voucher
   * @param {string} vendedorName
   * @param {string} obs
   */
  interface SolicitacaoPost {
    url?: string;
    nome: string;
    telefone: string;
    cpf: string;
    telefone2: string;
    dt_nascimento: Date | string | any;
    email: string;
    uploadRg?: string;
    uploadCnh?: string;
    empreedimento: number;
    construtora: number;
    financeiro: number;
    corretor: number;
    relacionamento: string[];
    cpfdois?: string;
    rela_quest?: boolean;
    voucher?: string;
    vendedorName?: string;
    obs?: string;
  }

  /**
   * SolicitacaoGetType
   * @param {SolicitacaoObjectType[]} data
   * @param {number} total
   * @param {number} pagina
   * @param {number} limite
   */
  interface SolicitacaoGetType {
    data: SolicitacaoObjectType[];
    total: number;
    pagina: number;
    limite: number;
  }
  
}

interface DadosApi {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  dt_nascimento: string;
  createdAt: string;
  updatedAt: string;
  imagemQrcode: string;
  pixCopiaECola: string;
  qrcode: string;
  txid: string;
  valor: number;
  status_pgto: string;
}