/**
 * Default inline styles for components.
 *
 * All styles reference CSS custom properties (--ntf-*) so consumers can
 * override them with a single CSS rule. No runtime CSS-in-JS library.
 */

export const styles = {
  // ── Inbox ──────────────────────────────────────────
  inbox: {
    fontFamily: 'var(--ntf-font-family)',
    fontSize: 'var(--ntf-font-size-base)',
    color: 'var(--ntf-color-text)',
    backgroundColor: 'var(--ntf-color-bg)',
    borderRadius: 'var(--ntf-radius-lg)',
    border: '1px solid var(--ntf-color-border)',
    overflow: 'hidden',
    width: '100%',
  } as React.CSSProperties,

  inboxHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--ntf-space-md) var(--ntf-space-lg)',
    borderBottom: '1px solid var(--ntf-color-border)',
  } as React.CSSProperties,

  inboxTitle: {
    fontSize: 'var(--ntf-font-size-lg)',
    fontWeight: 'var(--ntf-font-weight-semibold)',
    margin: 0,
  } as React.CSSProperties,

  markAllButton: {
    background: 'none',
    border: 'none',
    color: 'var(--ntf-color-primary)',
    fontSize: 'var(--ntf-font-size-sm)',
    fontWeight: 'var(--ntf-font-weight-medium)',
    cursor: 'pointer',
    padding: 'var(--ntf-space-xs) var(--ntf-space-sm)',
    borderRadius: 'var(--ntf-radius-sm)',
    transition: 'color 0.15s ease',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  // ── List ───────────────────────────────────────────
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    overflowY: 'auto',
  } as React.CSSProperties,

  loadMoreWrapper: {
    padding: 'var(--ntf-space-md)',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  loadMoreButton: {
    background: 'none',
    border: '1px solid var(--ntf-color-border)',
    color: 'var(--ntf-color-text-secondary)',
    fontSize: 'var(--ntf-font-size-sm)',
    fontWeight: 'var(--ntf-font-weight-medium)',
    cursor: 'pointer',
    padding: 'var(--ntf-space-sm) var(--ntf-space-lg)',
    borderRadius: 'var(--ntf-radius-md)',
    width: '100%',
    transition: 'background-color 0.15s ease',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  // ── Item ───────────────────────────────────────────
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--ntf-space-md)',
    padding: 'var(--ntf-space-md) var(--ntf-space-lg)',
    cursor: 'pointer',
    borderBottom: '1px solid var(--ntf-color-border)',
    transition: 'background-color 0.15s ease',
    textDecoration: 'none',
    color: 'inherit',
    position: 'relative' as const,
  } as React.CSSProperties,

  itemUnread: {
    backgroundColor: 'var(--ntf-color-bg-unread)',
  } as React.CSSProperties,

  itemDot: {
    width: 'var(--ntf-dot-size)',
    height: 'var(--ntf-dot-size)',
    borderRadius: 'var(--ntf-radius-full)',
    backgroundColor: 'var(--ntf-color-dot)',
    flexShrink: 0,
    marginTop: '0.4rem',
  } as React.CSSProperties,

  itemDotPlaceholder: {
    width: 'var(--ntf-dot-size)',
    height: 'var(--ntf-dot-size)',
    flexShrink: 0,
    marginTop: '0.4rem',
  } as React.CSSProperties,

  itemContent: {
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,

  itemTitle: {
    fontSize: 'var(--ntf-font-size-base)',
    fontWeight: 'var(--ntf-font-weight-medium)',
    margin: 0,
    lineHeight: 1.4,
    wordBreak: 'break-word' as const,
  } as React.CSSProperties,

  itemTitleUnread: {
    fontWeight: 'var(--ntf-font-weight-semibold)',
  } as React.CSSProperties,

  itemBody: {
    fontSize: 'var(--ntf-font-size-sm)',
    color: 'var(--ntf-color-text-secondary)',
    margin: 'var(--ntf-space-xs) 0 0 0',
    lineHeight: 1.4,
    wordBreak: 'break-word' as const,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  } as React.CSSProperties,

  itemTime: {
    fontSize: 'var(--ntf-font-size-sm)',
    color: 'var(--ntf-color-text-muted)',
    marginTop: 'var(--ntf-space-xs)',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  // ── Empty state ────────────────────────────────────
  empty: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--ntf-space-xl) var(--ntf-space-lg)',
    textAlign: 'center' as const,
    minHeight: '200px',
  } as React.CSSProperties,

  emptyIcon: {
    width: '48px',
    height: '48px',
    color: 'var(--ntf-color-text-muted)',
    marginBottom: 'var(--ntf-space-md)',
    opacity: 0.5,
  } as React.CSSProperties,

  emptyTitle: {
    fontSize: 'var(--ntf-font-size-base)',
    fontWeight: 'var(--ntf-font-weight-medium)',
    color: 'var(--ntf-color-text)',
    margin: '0 0 var(--ntf-space-xs) 0',
  } as React.CSSProperties,

  emptyDescription: {
    fontSize: 'var(--ntf-font-size-sm)',
    color: 'var(--ntf-color-text-muted)',
    margin: 0,
  } as React.CSSProperties,

  // ── Skeleton ───────────────────────────────────────
  skeleton: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--ntf-space-md)',
    padding: 'var(--ntf-space-md) var(--ntf-space-lg)',
    borderBottom: '1px solid var(--ntf-color-border)',
  } as React.CSSProperties,

  skeletonDot: {
    width: 'var(--ntf-dot-size)',
    height: 'var(--ntf-dot-size)',
    borderRadius: 'var(--ntf-radius-full)',
    backgroundColor: 'var(--ntf-color-skeleton)',
    flexShrink: 0,
    marginTop: '0.4rem',
  } as React.CSSProperties,

  skeletonContent: {
    flex: 1,
  } as React.CSSProperties,

  skeletonLine: (width: string): React.CSSProperties => ({
    height: '0.75rem',
    borderRadius: 'var(--ntf-radius-sm)',
    backgroundColor: 'var(--ntf-color-skeleton)',
    marginBottom: 'var(--ntf-space-xs)',
    width,
    animation: 'ntf-skeleton-pulse 1.5s ease-in-out infinite',
  }),

  // ── Bell ───────────────────────────────────────────
  bellButton: {
    position: 'relative' as const,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--ntf-bell-size)',
    height: 'var(--ntf-bell-size)',
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: 'var(--ntf-color-text)',
    borderRadius: 'var(--ntf-radius-md)',
    transition: 'background-color 0.15s ease',
  } as React.CSSProperties,

  bellIcon: {
    width: '24px',
    height: '24px',
  } as React.CSSProperties,

  badge: {
    position: 'absolute' as const,
    top: '0',
    right: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 'var(--ntf-badge-size)',
    height: 'var(--ntf-badge-size)',
    padding: '0 0.3rem',
    borderRadius: 'var(--ntf-radius-full)',
    backgroundColor: 'var(--ntf-color-badge-bg)',
    color: 'var(--ntf-color-badge-text)',
    fontSize: '0.625rem',
    fontWeight: 'var(--ntf-font-weight-semibold)',
    lineHeight: 1,
    fontFamily: 'var(--ntf-font-family)',
    pointerEvents: 'none' as const,
  } as React.CSSProperties,

  // ── Popover ────────────────────────────────────────
  popoverOverlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 9998,
  } as React.CSSProperties,

  popover: {
    position: 'absolute' as const,
    zIndex: 9999,
    width: 'var(--ntf-inbox-width)',
    maxWidth: 'calc(100vw - 1rem)',
    boxShadow: '0 10px 25px var(--ntf-color-shadow), 0 4px 10px var(--ntf-color-shadow)',
    borderRadius: 'var(--ntf-radius-lg)',
    overflow: 'hidden',
    animation: 'ntf-popover-enter 0.15s ease-out',
  } as React.CSSProperties,

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
  `.trim(),
} as const;
