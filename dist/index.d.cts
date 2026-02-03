/** A single in-app notification as returned by the API. */
interface NotificaNotification {
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
interface NotificaListResponse {
    data: NotificaNotification[];
}
/** Unread count response from the API. */
interface NotificaUnreadCountResponse {
    data: {
        count: number;
    };
}
/** Mark-all-read response from the API. */
interface NotificaMarkAllReadResponse {
    data: {
        updated: number;
    };
}
/** Supported locales for i18n labels. */
type NotificaLocale = 'pt-BR' | 'en';
/** Provider configuration. */
interface NotificaConfig {
    /** API key (e.g. "nk_live_...") */
    apiKey: string;
    /** Subscriber ID to fetch notifications for */
    subscriberId: string;
    /** Base API URL (default: "https://api.usenotifica.com.br") */
    apiUrl?: string;
    /** Polling interval in ms (default: 30000) */
    pollingInterval?: number;
    /** Locale for labels (default: "pt-BR") */
    locale?: NotificaLocale;
    /** Custom labels override */
    labels?: Partial<NotificaLabels>;
}
/** All translatable labels. */
interface NotificaLabels {
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
/** Value provided by NotificaProvider context. */
interface NotificaContextValue {
    config: Required<Pick<NotificaConfig, 'apiKey' | 'subscriberId' | 'apiUrl' | 'pollingInterval' | 'locale'>>;
    labels: NotificaLabels;
    /** Fetch wrapper with auth headers. */
    apiFetch: <T = unknown>(path: string, options?: RequestInit) => Promise<T>;
}
interface NotificaProviderProps {
    apiKey: string;
    subscriberId: string;
    apiUrl?: string;
    pollingInterval?: number;
    locale?: NotificaLocale;
    labels?: Partial<NotificaLabels>;
    children: React.ReactNode;
}
interface NotificaBellProps {
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
interface NotificaInboxProps {
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
interface NotificationItemProps {
    notification: NotificaNotification;
    onClick?: (notification: NotificaNotification) => void;
}
interface NotificationListProps {
    notifications: NotificaNotification[];
    onNotificationClick?: (notification: NotificaNotification) => void;
    onLoadMore?: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
}
interface PopoverProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement | null>;
    position: 'bottom-left' | 'bottom-right' | 'bottom-center';
    children: React.ReactNode;
}
interface NotificaThemeTokens {
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
    '--ntf-font-family': string;
    '--ntf-font-size-sm': string;
    '--ntf-font-size-base': string;
    '--ntf-font-size-lg': string;
    '--ntf-font-weight-normal': string;
    '--ntf-font-weight-medium': string;
    '--ntf-font-weight-semibold': string;
    '--ntf-space-xs': string;
    '--ntf-space-sm': string;
    '--ntf-space-md': string;
    '--ntf-space-lg': string;
    '--ntf-space-xl': string;
    '--ntf-radius-sm': string;
    '--ntf-radius-md': string;
    '--ntf-radius-lg': string;
    '--ntf-radius-full': string;
    '--ntf-inbox-width': string;
    '--ntf-bell-size': string;
    '--ntf-badge-size': string;
    '--ntf-dot-size': string;
}
interface UseNotificationsReturn {
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
interface UseUnreadCountReturn {
    count: number;
    isLoading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
}

declare function NotificaProvider({ apiKey, subscriberId, apiUrl, pollingInterval, locale, labels: labelOverrides, children, }: NotificaProviderProps): React.JSX.Element;

/**
 * Bell icon with unread count badge. Clicking opens a popover inbox.
 *
 * @example
 * ```tsx
 * <NotificaBell popoverPosition="bottom-right" />
 * ```
 */
declare function NotificaBell({ className, renderIcon, renderBadge, popoverPosition, inboxProps, }: NotificaBellProps): React.JSX.Element;

/**
 * Full inbox panel showing notification history with mark-as-read,
 * mark-all-as-read, infinite scroll, empty state, and loading skeleton.
 *
 * @example
 * ```tsx
 * <NotificaInbox
 *   maxHeight={400}
 *   onNotificationClick={(n) => router.push(n.action_url)}
 * />
 * ```
 */
declare function NotificaInbox({ maxHeight, className, onNotificationClick, pageSize, showHeader, }: NotificaInboxProps): React.JSX.Element;

/**
 * A single notification row in the inbox list.
 */
declare function NotificationItem({ notification, onClick, }: NotificationItemProps): React.JSX.Element;

/**
 * Scrollable list of notification items with "load more" support.
 */
declare function NotificationList({ notifications, onNotificationClick, onLoadMore, hasMore, isLoadingMore, }: NotificationListProps): React.JSX.Element;

/**
 * Lightweight, accessible popover positioned relative to an anchor element.
 *
 * - Closes on Escape, click outside, or focus leaving the popover
 * - Traps focus within while open
 * - SSR safe (no window access during render)
 */
declare function Popover({ isOpen, onClose, anchorRef, position, children, }: PopoverProps): React.JSX.Element | null;

/**
 * Access the Notifica context (config, labels, apiFetch).
 *
 * Must be used inside a <NotificaProvider>.
 *
 * @example
 * ```tsx
 * const { apiFetch, labels } = useNotifica();
 * ```
 */
declare function useNotifica(): NotificaContextValue;

/**
 * Fetch, poll, and manage in-app notifications.
 *
 * @param pageSize — notifications per page (default 20)
 *
 * @example
 * ```tsx
 * const { notifications, markAsRead, markAllAsRead, loadMore, hasMore } = useNotifications();
 * ```
 */
declare function useNotifications(pageSize?: number): UseNotificationsReturn;

/**
 * Fetch and poll the unread notification count.
 *
 * @example
 * ```tsx
 * const { count, isLoading } = useUnreadCount();
 * return <span>Unread: {count}</span>;
 * ```
 */
declare function useUnreadCount(): UseUnreadCountReturn;

/**
 * CSS custom property prefix: --ntf-*
 *
 * Consumers override tokens via CSS:
 *   :root { --ntf-color-primary: #7c3aed; }
 *
 * Or via the <NotificaProvider> style override (injected inline).
 */
declare const lightTokens: NotificaThemeTokens;
declare const darkTokens: NotificaThemeTokens;
/**
 * Injects theme tokens as CSS custom properties on a style element.
 * Returns a CSS string suitable for a <style> tag.
 */
declare function tokensToCSS(tokens: NotificaThemeTokens, selector?: string): string;

/**
 * Default inline styles for components.
 *
 * All styles reference CSS custom properties (--ntf-*) so consumers can
 * override them with a single CSS rule. No runtime CSS-in-JS library.
 */
declare const styles: {
    readonly inbox: React.CSSProperties;
    readonly inboxHeader: React.CSSProperties;
    readonly inboxTitle: React.CSSProperties;
    readonly markAllButton: React.CSSProperties;
    readonly list: React.CSSProperties;
    readonly loadMoreWrapper: React.CSSProperties;
    readonly loadMoreButton: React.CSSProperties;
    readonly item: React.CSSProperties;
    readonly itemUnread: React.CSSProperties;
    readonly itemDot: React.CSSProperties;
    readonly itemDotPlaceholder: React.CSSProperties;
    readonly itemContent: React.CSSProperties;
    readonly itemTitle: React.CSSProperties;
    readonly itemTitleUnread: React.CSSProperties;
    readonly itemBody: React.CSSProperties;
    readonly itemTime: React.CSSProperties;
    readonly empty: React.CSSProperties;
    readonly emptyIcon: React.CSSProperties;
    readonly emptyTitle: React.CSSProperties;
    readonly emptyDescription: React.CSSProperties;
    readonly skeleton: React.CSSProperties;
    readonly skeletonDot: React.CSSProperties;
    readonly skeletonContent: React.CSSProperties;
    readonly skeletonLine: (width: string) => React.CSSProperties;
    readonly bellButton: React.CSSProperties;
    readonly bellIcon: React.CSSProperties;
    readonly badge: React.CSSProperties;
    readonly popoverOverlay: React.CSSProperties;
    readonly popover: React.CSSProperties;
    readonly keyframes: string;
};

export { NotificaBell, type NotificaBellProps, type NotificaConfig, type NotificaContextValue, NotificaInbox, type NotificaInboxProps, type NotificaLabels, type NotificaListResponse, type NotificaLocale, type NotificaMarkAllReadResponse, type NotificaNotification, NotificaProvider, type NotificaProviderProps, type NotificaThemeTokens, type NotificaUnreadCountResponse, NotificationItem, type NotificationItemProps, NotificationList, type NotificationListProps, Popover, type PopoverProps, type UseNotificationsReturn, type UseUnreadCountReturn, darkTokens, lightTokens, styles, tokensToCSS, useNotifica, useNotifications, useUnreadCount };
