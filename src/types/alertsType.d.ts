declare namespace AlertsType {

  /**
   * AlertsProps
   * @description Tipos de alertas
   * @typedef {Object} AlertsProps
   * @property {number} id - Id do alerta
   * @property {string} titulo - Titulo do alerta
   * @property {string} texto - Texto do alerta
   * @property {number} solicitacao_id - Id da solicitacao
   * @property {number} corretor - Id do corretor
   * @property {string} tipo - Tipo do alerta
   * @property {string} tag - Tag do alerta (Ex: "info" | "warning" | "success" | "error" | "loading")
   * @property {boolean} status - Status do alerta
   * @property {number} empreendimento - Id do empreendimento
   * @property {Date} createdAt - Data de criacao do alerta
   * @property {Date} updatedAt - Data de atualizacao do alerta
   */
  export interface AlertsProps{
    id?: number;
    descricao: string;
    solicitacao_id?: number;
    corretor_id?: number;
    status?: boolean;
    createdAt?: Date | string |any;
    updatedAt?: Date | string | any | null;
  }
}