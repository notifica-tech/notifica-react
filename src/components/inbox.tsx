import { useCallback, useMemo } from 'react';
import type { NotificaInboxProps, NotificaNotification } from '../types';
import { useNotifica } from '../hooks/use-notifica';
import { useNotifications } from '../hooks/use-notifications';
import { NotificationList } from './notification-list';
import { styles } from '../styles/default-theme';

// ── Skeleton loader ──────────────────────────────────

function SkeletonItem(): React.JSX.Element {
  return (
    <div style={styles.skeleton} aria-hidden="true">
      <span style={styles.skeletonDot} />
      <div style={styles.skeletonContent}>
        <div style={styles.skeletonLine('70%')} />
        <div style={styles.skeletonLine('90%')} />
        <div style={styles.skeletonLine('40%')} />
      </div>
    </div>
  );
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div role="status" aria-label="Carregando notificações...">
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </div>
  );
}

// ── Empty state ──────────────────────────────────────

function EmptyState(): React.JSX.Element {
  const { labels } = useNotifica();

  return (
    <div style={styles.empty} data-notifica-empty="">
      {/* Bell icon placeholder */}
      <svg
        style={styles.emptyIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
      <p style={styles.emptyTitle}>{labels.emptyTitle}</p>
      <p style={styles.emptyDescription}>{labels.emptyDescription}</p>
    </div>
  );
}

// ── Main Inbox ───────────────────────────────────────

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
export function NotificaInbox({
  maxHeight,
  className,
  onNotificationClick,
  pageSize = 20,
  showHeader = true,
}: NotificaInboxProps): React.JSX.Element {
  const { labels } = useNotifica();
  const {
    notifications,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotifications(pageSize);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.read_at === null).length,
    [notifications]
  );

  const handleNotificationClick = useCallback(
    async (notification: NotificaNotification) => {
      if (notification.read_at === null) {
        try {
          await markAsRead(notification.id);
        } catch {
          // Swallow — optimistic update already applied
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
      // Swallow — optimistic update already applied
    }
  }, [markAllAsRead]);

  const listStyle = useMemo(
    () =>
      maxHeight
        ? { ...styles.list, maxHeight: `${maxHeight}px`, overflowY: 'auto' as const }
        : styles.list,
    [maxHeight]
  );

  return (
    <div
      className={className}
      style={styles.inbox}
      role="region"
      aria-label={labels.notifications}
      data-notifica-inbox=""
    >
      {/* Header */}
      {showHeader && (
        <div style={styles.inboxHeader} data-notifica-inbox-header="">
          <h2 style={styles.inboxTitle}>{labels.notifications}</h2>
          {unreadCount > 0 && (
            <button
              type="button"
              style={styles.markAllButton}
              onClick={handleMarkAllAsRead}
              aria-label={labels.markAllAsRead}
              data-notifica-mark-all=""
            >
              {labels.markAllAsRead}
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div style={listStyle}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <NotificationList
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onLoadMore={loadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
          />
        )}
      </div>
    </div>
  );
}
