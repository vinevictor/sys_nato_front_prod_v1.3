/**
 * Tipos e interfaces para o componente de Sidebar
 */

import { IconType } from "react-icons";

/**
 * Interface para definir um item de menu da sidebar
 */
export interface SidebarMenuItem {
  /** Identificador único do item */
  id: string;
  /** Texto a ser exibido no menu */
  label: string;
  /** Ícone do menu (React Icons) */
  icon: IconType;
  /** URL de navegação */
  href: string;
  /** Badge de notificação (opcional) */
  badge?: number;
  /** Indica se o item está ativo */
  isActive?: boolean;
}

/**
 * Interface para notificações
 */
export interface Notification {
  /** ID único da notificação */
  id: string;
  /** Título da notificação */
  title: string;
  /** Descrição/mensagem */
  message: string;
  /** Data/hora da notificação */
  timestamp: Date;
  /** Indica se foi lida */
  isRead: boolean;
  /** Tipo de notificação */
  type?: "info" | "warning" | "success" | "error";
}

/**
 * Props do componente SidebarNavigation
 */
export interface SidebarNavigationProps {
  /** Itens do menu */
  menuItems: SidebarMenuItem[];
  /** Dados da sessão do usuário */
  session: SessionNext.Client;
  /** Notificações do usuário */
  notifications?: Notification[];
  /** Callback ao clicar em notificação */
  onNotificationClick?: (notification: Notification) => void;
  /** Callback ao marcar notificação como lida */
  onMarkAsRead?: (notificationId: string) => void;
}
