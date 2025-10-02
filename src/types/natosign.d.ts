declare namespace natosign {
  /**
   * Representa um único objeto de envelope retornado pela API de listagem.
   */
  interface NatosignObjectType {
    id: number;
    UUID: string; // Corrigido: 'UUID' em maiúsculo
    status: string;
    doc_original_viw: string;
    doc_original_down: string;
    doc_modificado_viw: string;
    doc_modificado_down: string;
    original_name: string;
    hash: string;
    valor: number;
    cca_id: number; // Corrigido: a API retorna 'cca_id', não o objeto 'financeiro'
    status_pg: string;
    createdAt: string;
    status_view: string;
    updatedAt: string;
    ativo: boolean;
    // Removido: 'signatarios' e 'financeiro' não estão presentes na resposta da lista
  }

  /**
   * Representa a resposta completa da API ao buscar a lista de envelopes.
   */
  interface NatosignGetType {
    data: NatosignObjectType[];
    total: number;
    pagina: number; // ou 'page', dependendo da sua API
    limite: number; // ou 'limit', dependendo da sua API
  }
}
