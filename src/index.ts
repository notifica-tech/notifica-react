// ── Components ───────────────────────────────────────
export { NotificaProvider } from './provider';
export { NotificaBell } from './components/bell';
export { NotificaInbox } from './components/inbox';
export { NotificationItem } from './components/notification-item';
export { NotificationList } from './components/notification-list';
export { Popover } from './components/popover';

// ── Hooks ────────────────────────────────────────────
export { useNotifica } from './hooks/use-notifica';
export { useNotifications } from './hooks/use-notifications';
export { useUnreadCount } from './hooks/use-unread-count';

// ── Theme ────────────────────────────────────────────
export { lightTokens, darkTokens, tokensToCSS } from './styles/tokens';
export { styles } from './styles/default-theme';

// ── Types ────────────────────────────────────────────
export type {
  NotificaNotification,
  NotificaListResponse,
  NotificaUnreadCountResponse,
  NotificaMarkAllReadResponse,
  NotificaLocale,
  NotificaConfig,
  NotificaLabels,
  NotificaContextValue,
  NotificaProviderProps,
  NotificaBellProps,
  NotificaInboxProps,
  NotificationItemProps,
  NotificationListProps,
  PopoverProps,
  NotificaThemeTokens,
  UseNotificationsReturn,
  UseUnreadCountReturn,
} from './types';
