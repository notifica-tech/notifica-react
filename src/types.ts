// ── Core Types ───────────────────────────────────────

/** A single in-app notification as returned by the API. */
export interface NotificaNotification {
  id: string;
  tenant_id: string;
  subscriber_id: string;
  title: string;
  body: string | null;
  action_url: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  inserted_at: string;
  updated_at: string;
}

/** Paginated list response from the API. */
export interface NotificaListResponse {
  data: NotificaNotification[];
}

/** Unread count response from the API. */
export interface NotificaUnreadCountResponse {
  data: {
    count: number;
  };
}

/** Mark-all-read response from the API. */
export interface NotificaMarkAllReadResponse {
  data: {
    updated: number;
  };
}

// ── Configuration ────────────────────────────────────

/** Supported locales for i18n labels. */
export type NotificaLocale = 'pt-BR' | 'en';

/** Provider configuration (resolved internally). */
export interface NotificaConfig {
  /** Publishable key (e.g. "pk_live_...") */
  publishableKey: string;
  /** Subscriber ID to fetch notifications for */
  subscriberId: string;
  /** Base API URL (default: "https://app.usenotifica.com.br") */
  apiUrl?: string;
  /** Polling interval in ms (default: 30000) */
  pollingInterval?: number;
  /** Locale for labels (default: "pt-BR") */
  locale?: NotificaLocale;
  /** Custom labels override */
  labels?: Partial<NotificaLabels>;
}

/** All translatable labels. */
export interface NotificaLabels {
  notifications: string;
  markAllAsRead: string;
  loadMore: string;
  emptyTitle: string;
  emptyDescription: string;
  justNow: string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  yesterday: string;
  daysAgo: (n: number) => string;
}

// ── Errors ───────────────────────────────────────────

/** Error subclass for origin-restricted 403 responses. */
export class NotificaOriginError extends Error {
  public readonly status = 403;

  constructor(origin: string) {
    super(
      `[Notifica] This origin (${origin}) is not allowed to access the API. ` +
        'Add it to the origin allowlist in your Notifica dashboard, ' +
        'or use dev mode (pk_test_...) for local development.'
    );
    this.name = 'NotificaOriginError';
  }
}

// ── Context ──────────────────────────────────────────

/** Value provided by NotificaProvider context. */
export interface NotificaContextValue {
  config: Required<Pick<NotificaConfig, 'publishableKey' | 'subscriberId' | 'apiUrl' | 'pollingInterval' | 'locale'>>;
  labels: NotificaLabels;
  /** Fetch wrapper with auth headers. */
  apiFetch: <T = unknown>(path: string, options?: RequestInit) => Promise<T>;
}

// ── Component Props ──────────────────────────────────

export interface NotificaProviderProps {
  /** Publishable key (e.g. "pk_live_..." or "pk_test_..." for dev mode). */
  publishableKey?: string;
  /**
   * @deprecated Use `publishableKey` instead. Will be removed in 0.3.0.
   *
   * Legacy API key — automatically mapped to `publishableKey` with a deprecation warning.
   */
  apiKey?: string;
  /** Subscriber ID to scope notifications. */
  subscriberId: string;
  /** Base API URL (default: "https://app.usenotifica.com.br") */
  apiUrl?: string;
  /** Polling interval in ms (default: 30000) */
  pollingInterval?: number;
  /** Locale for labels (default: "pt-BR") */
  locale?: NotificaLocale;
  /** Partial label overrides for i18n. */
  labels?: Partial<NotificaLabels>;
  children: React.ReactNode;
}

export interface NotificaBellProps {
  /** Custom class on the bell wrapper */
  className?: string;
  /** Custom bell icon (replaces default SVG) */
  renderIcon?: (unreadCount: number) => React.ReactNode;
  /** Custom badge render */
  renderBadge?: (count: number) => React.ReactNode;
  /** Popover placement */
  popoverPosition?: 'bottom-left' | 'bottom-right' | 'bottom-center';
  /** Props forwarded to the inner NotificaInbox */
  inboxProps?: Omit<NotificaInboxProps, 'className'>;
}

export interface NotificaInboxProps {
  /** Max height in px (enables scroll) */
  maxHeight?: number;
  /** Custom class on the inbox wrapper */
  className?: string;
  /** Callback when a notification is clicked */
  onNotificationClick?: (notification: NotificaNotification) => void;
  /** Number of notifications per page (default 20) */
  pageSize?: number;
  /** Show header with title + mark-all button (default true) */
  showHeader?: boolean;
}

export interface NotificationItemProps {
  notification: NotificaNotification;
  onClick?: (notification: NotificaNotification) => void;
}

export interface NotificationListProps {
  notifications: NotificaNotification[];
  onNotificationClick?: (notification: NotificaNotification) => void;
  onLoadMore?: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  position: 'bottom-left' | 'bottom-right' | 'bottom-center';
  children: React.ReactNode;
}

// ── Theme ────────────────────────────────────────────

export interface NotificaThemeTokens {
  // Colors
  '--ntf-color-bg': string;
  '--ntf-color-bg-hover': string;
  '--ntf-color-bg-unread': string;
  '--ntf-color-text': string;
  '--ntf-color-text-secondary': string;
  '--ntf-color-text-muted': string;
  '--ntf-color-primary': string;
  '--ntf-color-primary-hover': string;
  '--ntf-color-border': string;
  '--ntf-color-badge-bg': string;
  '--ntf-color-badge-text': string;
  '--ntf-color-dot': string;
  '--ntf-color-skeleton': string;
  '--ntf-color-skeleton-shine': string;
  '--ntf-color-shadow': string;

  // Typography
  '--ntf-font-family': string;
  '--ntf-font-size-sm': string;
  '--ntf-font-size-base': string;
  '--ntf-font-size-lg': string;
  '--ntf-font-weight-normal': string;
  '--ntf-font-weight-medium': string;
  '--ntf-font-weight-semibold': string;

  // Spacing
  '--ntf-space-xs': string;
  '--ntf-space-sm': string;
  '--ntf-space-md': string;
  '--ntf-space-lg': string;
  '--ntf-space-xl': string;

  // Borders
  '--ntf-radius-sm': string;
  '--ntf-radius-md': string;
  '--ntf-radius-lg': string;
  '--ntf-radius-full': string;

  // Sizes
  '--ntf-inbox-width': string;
  '--ntf-bell-size': string;
  '--ntf-badge-size': string;
  '--ntf-dot-size': string;
}

// ── Hook Return Types ────────────────────────────────

export interface UseNotificationsReturn {
  notifications: NotificaNotification[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export interface UseUnreadCountReturn {
  count: number;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}
