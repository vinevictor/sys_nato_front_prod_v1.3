declare namespace natosign {
  /**
   * Representa a estrutura de um signatário dentro da lista de envelopes.
   */
  interface SignatarioType {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    state: string;
    updatedAt: string;
    telefone?: string | null;
    filled_at?: string | null;
  }

  /**
   * Representa um único objeto de envelope retornado pela API de listagem.
   */
  interface NatosignObjectType {
    id: number;
    UUID: string;
    status: string;
    doc_original_viw: string;
    doc_original_down: string;
    doc_modificado_viw: string;
    doc_modificado_down: string;
    public_link: string;
    original_name: string;
    hash: string;
    valor: number;
    cca_id: number;
    status_pg: string;
    createdAt: string;
    status_view: string;
    updatedAt: string;
    ativo: boolean;
    /** Cancelado só no SisNato; null quando ativo */
    cancelado_em?: string | null;
    cancelado_por?: string | null;
    motivo_cancelamento?: string | null;

    construtora_id: number;
    user_id: number;
    title: string;
    description: string;
    message: string;
    type: string;

    signatarios: SignatarioType[];
  }

  /**
   * Representa a resposta completa da API ao buscar a lista de envelopes.
   */
  interface NatosignGetType {
    data: NatosignObjectType[];
    total: number;
    pagina: number;
    limite: number;
  }
}
