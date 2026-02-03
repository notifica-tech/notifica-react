import { createContext, useRef, useEffect, useMemo, useCallback, useContext, useState } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

// src/provider.tsx

// src/styles/tokens.ts
var lightTokens = {
  // Colors
  "--ntf-color-bg": "#ffffff",
  "--ntf-color-bg-hover": "#f9fafb",
  "--ntf-color-bg-unread": "#f0f7ff",
  "--ntf-color-text": "#111827",
  "--ntf-color-text-secondary": "#374151",
  "--ntf-color-text-muted": "#9ca3af",
  "--ntf-color-primary": "#2563eb",
  "--ntf-color-primary-hover": "#1d4ed8",
  "--ntf-color-border": "#e5e7eb",
  "--ntf-color-badge-bg": "#ef4444",
  "--ntf-color-badge-text": "#ffffff",
  "--ntf-color-dot": "#2563eb",
  "--ntf-color-skeleton": "#e5e7eb",
  "--ntf-color-skeleton-shine": "#f3f4f6",
  "--ntf-color-shadow": "rgba(0, 0, 0, 0.1)",
  // Typography
  "--ntf-font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  "--ntf-font-size-sm": "0.75rem",
  "--ntf-font-size-base": "0.875rem",
  "--ntf-font-size-lg": "1rem",
  "--ntf-font-weight-normal": "400",
  "--ntf-font-weight-medium": "500",
  "--ntf-font-weight-semibold": "600",
  // Spacing
  "--ntf-space-xs": "0.25rem",
  "--ntf-space-sm": "0.5rem",
  "--ntf-space-md": "0.75rem",
  "--ntf-space-lg": "1rem",
  "--ntf-space-xl": "1.5rem",
  // Borders
  "--ntf-radius-sm": "0.25rem",
  "--ntf-radius-md": "0.5rem",
  "--ntf-radius-lg": "0.75rem",
  "--ntf-radius-full": "9999px",
  // Sizes
  "--ntf-inbox-width": "380px",
  "--ntf-bell-size": "2.5rem",
  "--ntf-badge-size": "1.25rem",
  "--ntf-dot-size": "0.5rem"
};
var darkTokens = {
  ...lightTokens,
  // Override colors for dark mode
  "--ntf-color-bg": "#1f2937",
  "--ntf-color-bg-hover": "#374151",
  "--ntf-color-bg-unread": "#1e3a5f",
  "--ntf-color-text": "#f9fafb",
  "--ntf-color-text-secondary": "#d1d5db",
  "--ntf-color-text-muted": "#6b7280",
  "--ntf-color-primary": "#3b82f6",
  "--ntf-color-primary-hover": "#60a5fa",
  "--ntf-color-border": "#374151",
  "--ntf-color-skeleton": "#374151",
  "--ntf-color-skeleton-shine": "#4b5563",
  "--ntf-color-shadow": "rgba(0, 0, 0, 0.3)"
};
function tokensToCSS(tokens, selector = ":host, [data-notifica]") {
  const entries = Object.entries(tokens).map(([key, value]) => `  ${key}: ${value};`).join("\n");
  return `${selector} {
${entries}
}`;
}

// src/styles/default-theme.ts
var styles = {
  // ── Inbox ──────────────────────────────────────────
  inbox: {
    fontFamily: "var(--ntf-font-family)",
    fontSize: "var(--ntf-font-size-base)",
    color: "var(--ntf-color-text)",
    backgroundColor: "var(--ntf-color-bg)",
    borderRadius: "var(--ntf-radius-lg)",
    border: "1px solid var(--ntf-color-border)",
    overflow: "hidden",
    width: "100%"
  },
  inboxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "var(--ntf-space-md) var(--ntf-space-lg)",
    borderBottom: "1px solid var(--ntf-color-border)"
  },
  inboxTitle: {
    fontSize: "var(--ntf-font-size-lg)",
    fontWeight: "var(--ntf-font-weight-semibold)",
    margin: 0
  },
  markAllButton: {
    background: "none",
    border: "none",
    color: "var(--ntf-color-primary)",
    fontSize: "var(--ntf-font-size-sm)",
    fontWeight: "var(--ntf-font-weight-medium)",
    cursor: "pointer",
    padding: "var(--ntf-space-xs) var(--ntf-space-sm)",
    borderRadius: "var(--ntf-radius-sm)",
    transition: "color 0.15s ease",
    fontFamily: "inherit"
  },
  // ── List ───────────────────────────────────────────
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    overflowY: "auto"
  },
  loadMoreWrapper: {
    padding: "var(--ntf-space-md)",
    textAlign: "center"
  },
  loadMoreButton: {
    background: "none",
    border: "1px solid var(--ntf-color-border)",
    color: "var(--ntf-color-text-secondary)",
    fontSize: "var(--ntf-font-size-sm)",
    fontWeight: "var(--ntf-font-weight-medium)",
    cursor: "pointer",
    padding: "var(--ntf-space-sm) var(--ntf-space-lg)",
    borderRadius: "var(--ntf-radius-md)",
    width: "100%",
    transition: "background-color 0.15s ease",
    fontFamily: "inherit"
  },
  // ── Item ───────────────────────────────────────────
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--ntf-space-md)",
    padding: "var(--ntf-space-md) var(--ntf-space-lg)",
    cursor: "pointer",
    borderBottom: "1px solid var(--ntf-color-border)",
    transition: "background-color 0.15s ease",
    textDecoration: "none",
    color: "inherit",
    position: "relative"
  },
  itemUnread: {
    backgroundColor: "var(--ntf-color-bg-unread)"
  },
  itemDot: {
    width: "var(--ntf-dot-size)",
    height: "var(--ntf-dot-size)",
    borderRadius: "var(--ntf-radius-full)",
    backgroundColor: "var(--ntf-color-dot)",
    flexShrink: 0,
    marginTop: "0.4rem"
  },
  itemDotPlaceholder: {
    width: "var(--ntf-dot-size)",
    height: "var(--ntf-dot-size)",
    flexShrink: 0,
    marginTop: "0.4rem"
  },
  itemContent: {
    flex: 1,
    minWidth: 0
  },
  itemTitle: {
    fontSize: "var(--ntf-font-size-base)",
    fontWeight: "var(--ntf-font-weight-medium)",
    margin: 0,
    lineHeight: 1.4,
    wordBreak: "break-word"
  },
  itemTitleUnread: {
    fontWeight: "var(--ntf-font-weight-semibold)"
  },
  itemBody: {
    fontSize: "var(--ntf-font-size-sm)",
    color: "var(--ntf-color-text-secondary)",
    margin: "var(--ntf-space-xs) 0 0 0",
    lineHeight: 1.4,
    wordBreak: "break-word",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },
  itemTime: {
    fontSize: "var(--ntf-font-size-sm)",
    color: "var(--ntf-color-text-muted)",
    marginTop: "var(--ntf-space-xs)",
    whiteSpace: "nowrap"
  },
  // ── Empty state ────────────────────────────────────
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--ntf-space-xl) var(--ntf-space-lg)",
    textAlign: "center",
    minHeight: "200px"
  },
  emptyIcon: {
    width: "48px",
    height: "48px",
    color: "var(--ntf-color-text-muted)",
    marginBottom: "var(--ntf-space-md)",
    opacity: 0.5
  },
  emptyTitle: {
    fontSize: "var(--ntf-font-size-base)",
    fontWeight: "var(--ntf-font-weight-medium)",
    color: "var(--ntf-color-text)",
    margin: "0 0 var(--ntf-space-xs) 0"
  },
  emptyDescription: {
    fontSize: "var(--ntf-font-size-sm)",
    color: "var(--ntf-color-text-muted)",
    margin: 0
  },
  // ── Skeleton ───────────────────────────────────────
  skeleton: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--ntf-space-md)",
    padding: "var(--ntf-space-md) var(--ntf-space-lg)",
    borderBottom: "1px solid var(--ntf-color-border)"
  },
  skeletonDot: {
    width: "var(--ntf-dot-size)",
    height: "var(--ntf-dot-size)",
    borderRadius: "var(--ntf-radius-full)",
    backgroundColor: "var(--ntf-color-skeleton)",
    flexShrink: 0,
    marginTop: "0.4rem"
  },
  skeletonContent: {
    flex: 1
  },
  skeletonLine: (width) => ({
    height: "0.75rem",
    borderRadius: "var(--ntf-radius-sm)",
    backgroundColor: "var(--ntf-color-skeleton)",
    marginBottom: "var(--ntf-space-xs)",
    width,
    animation: "ntf-skeleton-pulse 1.5s ease-in-out infinite"
  }),
  // ── Bell ───────────────────────────────────────────
  bellButton: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "var(--ntf-bell-size)",
    height: "var(--ntf-bell-size)",
    padding: 0,
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "var(--ntf-color-text)",
    borderRadius: "var(--ntf-radius-md)",
    transition: "background-color 0.15s ease"
  },
  bellIcon: {
    width: "24px",
    height: "24px"
  },
  badge: {
    position: "absolute",
    top: "0",
    right: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "var(--ntf-badge-size)",
    height: "var(--ntf-badge-size)",
    padding: "0 0.3rem",
    borderRadius: "var(--ntf-radius-full)",
    backgroundColor: "var(--ntf-color-badge-bg)",
    color: "var(--ntf-color-badge-text)",
    fontSize: "0.625rem",
    fontWeight: "var(--ntf-font-weight-semibold)",
    lineHeight: 1,
    fontFamily: "var(--ntf-font-family)",
    pointerEvents: "none"
  },
  // ── Popover ────────────────────────────────────────
  popoverOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9998
  },
  popover: {
    position: "absolute",
    zIndex: 9999,
    width: "var(--ntf-inbox-width)",
    maxWidth: "calc(100vw - 1rem)",
    boxShadow: "0 10px 25px var(--ntf-color-shadow), 0 4px 10px var(--ntf-color-shadow)",
    borderRadius: "var(--ntf-radius-lg)",
    overflow: "hidden",
    animation: "ntf-popover-enter 0.15s ease-out"
  },
  // ── Keyframes (injected once) ──────────────────────
  keyframes: `
@keyframes ntf-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes ntf-popover-enter {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
  `.trim()
};
var LABELS_PT_BR = {
  notifications: "Notifica\xE7\xF5es",
  markAllAsRead: "Marcar todas como lidas",
  loadMore: "Carregar mais",
  emptyTitle: "Nenhuma notifica\xE7\xE3o",
  emptyDescription: "Quando voc\xEA receber notifica\xE7\xF5es, elas aparecer\xE3o aqui.",
  justNow: "agora",
  minutesAgo: (n) => `h\xE1 ${n} min`,
  hoursAgo: (n) => n === 1 ? "h\xE1 1 hora" : `h\xE1 ${n} horas`,
  yesterday: "ontem",
  daysAgo: (n) => `h\xE1 ${n} dias`
};
var LABELS_EN = {
  notifications: "Notifications",
  markAllAsRead: "Mark all as read",
  loadMore: "Load more",
  emptyTitle: "No notifications",
  emptyDescription: "When you receive notifications, they'll appear here.",
  justNow: "just now",
  minutesAgo: (n) => `${n}m ago`,
  hoursAgo: (n) => n === 1 ? "1h ago" : `${n}h ago`,
  yesterday: "yesterday",
  daysAgo: (n) => `${n}d ago`
};
var LOCALE_MAP = {
  "pt-BR": LABELS_PT_BR,
  en: LABELS_EN
};
var NotificaContext = createContext(null);
var DEFAULT_API_URL = "https://api.usenotifica.com.br";
var DEFAULT_POLLING_INTERVAL = 3e4;
var DEFAULT_LOCALE = "pt-BR";
function NotificaProvider({
  apiKey,
  subscriberId,
  apiUrl = DEFAULT_API_URL,
  pollingInterval = DEFAULT_POLLING_INTERVAL,
  locale = DEFAULT_LOCALE,
  labels: labelOverrides,
  children
}) {
  const styleInjectedRef = useRef(false);
  useEffect(() => {
    if (styleInjectedRef.current) return;
    if (typeof document === "undefined") return;
    const existing = document.getElementById("notifica-styles");
    if (existing) {
      styleInjectedRef.current = true;
      return;
    }
    const style = document.createElement("style");
    style.id = "notifica-styles";
    style.textContent = `${tokensToCSS(lightTokens)}
${styles.keyframes}`;
    document.head.appendChild(style);
    styleInjectedRef.current = true;
  }, []);
  const config = useMemo(
    () => ({
      apiKey,
      subscriberId,
      apiUrl: apiUrl.replace(/\/+$/, ""),
      pollingInterval,
      locale
    }),
    [apiKey, subscriberId, apiUrl, pollingInterval, locale]
  );
  const labels = useMemo(() => {
    const base = LOCALE_MAP[locale] ?? LABELS_PT_BR;
    if (!labelOverrides) return base;
    return { ...base, ...labelOverrides };
  }, [locale, labelOverrides]);
  const apiFetch = useCallback(
    async (path, options = {}) => {
      const url = `${config.apiUrl}${path}`;
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${config.apiKey}`);
      headers.set("Content-Type", "application/json");
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        const errorBody = await res.text().catch(() => "");
        throw new Error(
          `Notifica API error: ${res.status} ${res.statusText}${errorBody ? ` \u2014 ${errorBody}` : ""}`
        );
      }
      return res.json();
    },
    [config.apiUrl, config.apiKey]
  );
  const contextValue = useMemo(
    () => ({ config, labels, apiFetch }),
    [config, labels, apiFetch]
  );
  return /* @__PURE__ */ jsx(NotificaContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx("div", { "data-notifica": "", "data-notifica-locale": locale, children }) });
}
function useNotifica() {
  const ctx = useContext(NotificaContext);
  if (!ctx) {
    throw new Error(
      '[Notifica] useNotifica() must be used inside a <NotificaProvider>. Wrap your app or component tree with <NotificaProvider apiKey="..." subscriberId="...">.'
    );
  }
  return ctx;
}

// src/hooks/use-unread-count.ts
function useUnreadCount() {
  const { config, apiFetch } = useNotifica();
  const { subscriberId, pollingInterval } = config;
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const basePath = `/v1/subscribers/${encodeURIComponent(subscriberId)}/notifications/unread-count`;
  const fetchCount = useCallback(async () => {
    try {
      const res = await apiFetch(basePath);
      if (!mountedRef.current) return;
      setCount(res.data.count);
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [apiFetch, basePath]);
  useEffect(() => {
    setIsLoading(true);
    fetchCount().finally(() => {
      if (mountedRef.current) setIsLoading(false);
    });
  }, [fetchCount]);
  useEffect(() => {
    if (pollingInterval <= 0) return;
    const interval = setInterval(fetchCount, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchCount, pollingInterval]);
  const refresh = useCallback(async () => {
    await fetchCount();
  }, [fetchCount]);
  return { count, isLoading, error, refresh };
}
function Popover({
  isOpen,
  onClose,
  anchorRef,
  position,
  children
}) {
  const popoverRef = useRef(null);
  const [posStyle, setPosStyle] = useState({});
  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;
    if (typeof window === "undefined") return;
    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const top = rect.bottom + scrollY + 8;
      let left;
      switch (position) {
        case "bottom-left":
          left = rect.left + scrollX;
          break;
        case "bottom-center":
          left = rect.left + scrollX + rect.width / 2;
          break;
        case "bottom-right":
        default:
          left = rect.right + scrollX;
          break;
      }
      const transform = position === "bottom-center" ? "translateX(-50%)" : position === "bottom-right" ? "translateX(-100%)" : "none";
      setPosStyle({
        top: `${top}px`,
        left: `${left}px`,
        transform
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, anchorRef, position]);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
        anchorRef.current?.focus();
      }
    },
    [onClose, anchorRef]
  );
  useEffect(() => {
    if (!isOpen) return;
    if (typeof document === "undefined") return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);
  useEffect(() => {
    if (!isOpen || !popoverRef.current) return;
    const firstFocusable = popoverRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }, [isOpen]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        style: styles.popoverOverlay,
        onClick: onClose,
        "aria-hidden": "true",
        "data-notifica-popover-overlay": ""
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: popoverRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Notifica\xE7\xF5es",
        style: { ...styles.popover, ...posStyle },
        "data-notifica-popover": "",
        children
      }
    )
  ] });
}
function useNotifications(pageSize = 20) {
  const { config, apiFetch } = useNotifica();
  const { subscriberId, pollingInterval } = config;
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const basePath = `/v1/subscribers/${encodeURIComponent(subscriberId)}/notifications`;
  const fetchNotifications = useCallback(
    async (offset = 0, append = false) => {
      try {
        const params = new URLSearchParams({
          limit: String(pageSize),
          offset: String(offset)
        });
        const res = await apiFetch(`${basePath}?${params.toString()}`);
        if (!mountedRef.current) return;
        const newItems = res.data;
        setHasMore(newItems.length >= pageSize);
        if (append) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const unique = newItems.filter((n) => !existingIds.has(n.id));
            return [...prev, ...unique];
          });
        } else {
          setNotifications(newItems);
        }
        offsetRef.current = offset + newItems.length;
        setError(null);
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [apiFetch, basePath, pageSize]
  );
  useEffect(() => {
    setIsLoading(true);
    offsetRef.current = 0;
    fetchNotifications(0, false).finally(() => {
      if (mountedRef.current) setIsLoading(false);
    });
  }, [fetchNotifications]);
  useEffect(() => {
    if (pollingInterval <= 0) return;
    const interval = setInterval(() => {
      fetchNotifications(0, false);
    }, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchNotifications, pollingInterval]);
  const refresh = useCallback(async () => {
    offsetRef.current = 0;
    await fetchNotifications(0, false);
  }, [fetchNotifications]);
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    fetchNotifications(offsetRef.current, true).finally(() => {
      if (mountedRef.current) setIsLoadingMore(false);
    });
  }, [fetchNotifications, hasMore, isLoadingMore]);
  const markAsRead = useCallback(
    async (id) => {
      setNotifications(
        (prev) => prev.map(
          (n) => n.id === id ? { ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() } : n
        )
      );
      try {
        await apiFetch(`${basePath}/${encodeURIComponent(id)}/read`, {
          method: "POST"
        });
      } catch (err) {
        setNotifications(
          (prev) => prev.map((n) => n.id === id ? { ...n, read_at: null } : n)
        );
        throw err;
      }
    },
    [apiFetch, basePath]
  );
  const markAllAsRead = useCallback(async () => {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    setNotifications(
      (prev) => prev.map((n) => n.read_at ? n : { ...n, read_at: now })
    );
    try {
      await apiFetch(`${basePath}/read-all`, {
        method: "POST"
      });
    } catch (err) {
      await refresh();
      throw err;
    }
  }, [apiFetch, basePath, refresh]);
  return {
    notifications,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    markAsRead,
    markAllAsRead
  };
}
function formatRelativeTime(iso, labels) {
  const now = Date.now();
  const date = new Date(iso);
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 6e4);
  const diffHours = Math.floor(diffMs / 36e5);
  const diffDays = Math.floor(diffMs / 864e5);
  if (diffMin < 1) return labels.justNow;
  if (diffMin < 60) return labels.minutesAgo(diffMin);
  if (diffHours < 24) return labels.hoursAgo(diffHours);
  if (diffDays === 1) return labels.yesterday;
  if (diffDays < 30) return labels.daysAgo(diffDays);
  return date.toLocaleDateString();
}
function NotificationItem({
  notification,
  onClick
}) {
  const { labels } = useNotifica();
  const isUnread = notification.read_at === null;
  const handleClick = useCallback(() => {
    onClick?.(notification);
  }, [onClick, notification]);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.(notification);
      }
    },
    [onClick, notification]
  );
  const timeAgo = useMemo(
    () => formatRelativeTime(notification.inserted_at, labels),
    [notification.inserted_at, labels]
  );
  const itemStyle = useMemo(
    () => ({
      ...styles.item,
      ...isUnread ? styles.itemUnread : {}
    }),
    [isUnread]
  );
  const titleStyle = useMemo(
    () => ({
      ...styles.itemTitle,
      ...isUnread ? styles.itemTitleUnread : {}
    }),
    [isUnread]
  );
  return /* @__PURE__ */ jsxs(
    "li",
    {
      role: "option",
      "aria-selected": false,
      "aria-label": `${notification.title}${isUnread ? " (n\xE3o lida)" : ""}`,
      tabIndex: 0,
      style: itemStyle,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      "data-notifica-item": "",
      "data-notifica-unread": isUnread ? "" : void 0,
      children: [
        isUnread ? /* @__PURE__ */ jsx(
          "span",
          {
            style: styles.itemDot,
            "aria-hidden": "true",
            "data-notifica-dot": ""
          }
        ) : /* @__PURE__ */ jsx(
          "span",
          {
            style: styles.itemDotPlaceholder,
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: styles.itemContent, children: [
          /* @__PURE__ */ jsx("p", { style: titleStyle, children: notification.title }),
          notification.body && /* @__PURE__ */ jsx("p", { style: styles.itemBody, children: notification.body }),
          /* @__PURE__ */ jsx(
            "time",
            {
              style: styles.itemTime,
              dateTime: notification.inserted_at,
              title: new Date(notification.inserted_at).toLocaleString(),
              children: timeAgo
            }
          )
        ] })
      ]
    }
  );
}
function NotificationList({
  notifications,
  onNotificationClick,
  onLoadMore,
  hasMore,
  isLoadingMore
}) {
  const { labels } = useNotifica();
  const handleLoadMore = useCallback(() => {
    onLoadMore?.();
  }, [onLoadMore]);
  return /* @__PURE__ */ jsxs("div", { "data-notifica-list": "", children: [
    /* @__PURE__ */ jsx(
      "ul",
      {
        role: "listbox",
        "aria-label": labels.notifications,
        style: styles.list,
        children: notifications.map((notification) => /* @__PURE__ */ jsx(
          NotificationItem,
          {
            notification,
            onClick: onNotificationClick
          },
          notification.id
        ))
      }
    ),
    hasMore && /* @__PURE__ */ jsx("div", { style: styles.loadMoreWrapper, children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        style: styles.loadMoreButton,
        onClick: handleLoadMore,
        disabled: isLoadingMore,
        "aria-busy": isLoadingMore,
        "data-notifica-load-more": "",
        children: isLoadingMore ? "..." : labels.loadMore
      }
    ) })
  ] });
}
function SkeletonItem() {
  return /* @__PURE__ */ jsxs("div", { style: styles.skeleton, "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("span", { style: styles.skeletonDot }),
    /* @__PURE__ */ jsxs("div", { style: styles.skeletonContent, children: [
      /* @__PURE__ */ jsx("div", { style: styles.skeletonLine("70%") }),
      /* @__PURE__ */ jsx("div", { style: styles.skeletonLine("90%") }),
      /* @__PURE__ */ jsx("div", { style: styles.skeletonLine("40%") })
    ] })
  ] });
}
function LoadingSkeleton() {
  return /* @__PURE__ */ jsxs("div", { role: "status", "aria-label": "Carregando notifica\xE7\xF5es...", children: [
    /* @__PURE__ */ jsx(SkeletonItem, {}),
    /* @__PURE__ */ jsx(SkeletonItem, {}),
    /* @__PURE__ */ jsx(SkeletonItem, {})
  ] });
}
function EmptyState() {
  const { labels } = useNotifica();
  return /* @__PURE__ */ jsxs("div", { style: styles.empty, "data-notifica-empty": "", children: [
    /* @__PURE__ */ jsx(
      "svg",
      {
        style: styles.emptyIcon,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.5,
        "aria-hidden": "true",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          }
        )
      }
    ),
    /* @__PURE__ */ jsx("p", { style: styles.emptyTitle, children: labels.emptyTitle }),
    /* @__PURE__ */ jsx("p", { style: styles.emptyDescription, children: labels.emptyDescription })
  ] });
}
function NotificaInbox({
  maxHeight,
  className,
  onNotificationClick,
  pageSize = 20,
  showHeader = true
}) {
  const { labels } = useNotifica();
  const {
    notifications,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead
  } = useNotifications(pageSize);
  const unreadCount = useMemo(
    () => notifications.filter((n) => n.read_at === null).length,
    [notifications]
  );
  const handleNotificationClick = useCallback(
    async (notification) => {
      if (notification.read_at === null) {
        try {
          await markAsRead(notification.id);
        } catch {
        }
      }
      onNotificationClick?.(notification);
    },
    [markAsRead, onNotificationClick]
  );
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch {
    }
  }, [markAllAsRead]);
  const listStyle = useMemo(
    () => maxHeight ? { ...styles.list, maxHeight: `${maxHeight}px`, overflowY: "auto" } : styles.list,
    [maxHeight]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className,
      style: styles.inbox,
      role: "region",
      "aria-label": labels.notifications,
      "data-notifica-inbox": "",
      children: [
        showHeader && /* @__PURE__ */ jsxs("div", { style: styles.inboxHeader, "data-notifica-inbox-header": "", children: [
          /* @__PURE__ */ jsx("h2", { style: styles.inboxTitle, children: labels.notifications }),
          unreadCount > 0 && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              style: styles.markAllButton,
              onClick: handleMarkAllAsRead,
              "aria-label": labels.markAllAsRead,
              "data-notifica-mark-all": "",
              children: labels.markAllAsRead
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { style: listStyle, children: isLoading ? /* @__PURE__ */ jsx(LoadingSkeleton, {}) : notifications.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {}) : /* @__PURE__ */ jsx(
          NotificationList,
          {
            notifications,
            onNotificationClick: handleNotificationClick,
            onLoadMore: loadMore,
            hasMore,
            isLoadingMore
          }
        ) })
      ]
    }
  );
}
function BellSVG() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      style: styles.bellIcon,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }),
        /* @__PURE__ */ jsx("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
      ]
    }
  );
}
function Badge({ count }) {
  if (count <= 0) return null;
  const display = count > 99 ? "99+" : String(count);
  return /* @__PURE__ */ jsx(
    "span",
    {
      style: styles.badge,
      "aria-label": `${count} notifica\xE7\xF5es n\xE3o lidas`,
      "data-notifica-badge": "",
      children: display
    }
  );
}
function NotificaBell({
  className,
  renderIcon,
  renderBadge,
  popoverPosition = "bottom-right",
  inboxProps
}) {
  const { labels } = useNotifica();
  const { count } = useUnreadCount();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className,
      style: { position: "relative", display: "inline-block" },
      "data-notifica-bell": "",
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            ref: buttonRef,
            type: "button",
            style: styles.bellButton,
            onClick: toggle,
            "aria-label": `${labels.notifications}${count > 0 ? ` (${count} n\xE3o lidas)` : ""}`,
            "aria-expanded": isOpen,
            "aria-haspopup": "dialog",
            "data-notifica-bell-button": "",
            children: [
              renderIcon ? renderIcon(count) : /* @__PURE__ */ jsx(BellSVG, {}),
              renderBadge ? renderBadge(count) : /* @__PURE__ */ jsx(Badge, { count })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Popover,
          {
            isOpen,
            onClose: close,
            anchorRef: buttonRef,
            position: popoverPosition,
            children: /* @__PURE__ */ jsx(NotificaInbox, { maxHeight: 420, ...inboxProps })
          }
        )
      ]
    }
  );
}

export { NotificaBell, NotificaInbox, NotificaProvider, NotificationItem, NotificationList, Popover, darkTokens, lightTokens, styles, tokensToCSS, useNotifica, useNotifications, useUnreadCount };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map