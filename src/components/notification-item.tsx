import { useCallback, useMemo } from 'react';
import type { NotificationItemProps } from '../types';
import { useNotifica } from '../hooks/use-notifica';
import { styles } from '../styles/default-theme';

/**
 * Formats a timestamp to a human-friendly relative string.
 */
function formatRelativeTime(
  iso: string,
  labels: ReturnType<typeof useNotifica>['labels']
): string {
  const now = Date.now();
  const date = new Date(iso);
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return labels.justNow;
  if (diffMin < 60) return labels.minutesAgo(diffMin);
  if (diffHours < 24) return labels.hoursAgo(diffHours);
  if (diffDays === 1) return labels.yesterday;
  if (diffDays < 30) return labels.daysAgo(diffDays);

  // Fallback to date
  return date.toLocaleDateString();
}

/**
 * A single notification row in the inbox list.
 */
export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps): React.JSX.Element {
  const { labels } = useNotifica();
  const isUnread = notification.read_at === null;

  const handleClick = useCallback(() => {
    onClick?.(notification);
  }, [onClick, notification]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
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
      ...(isUnread ? styles.itemUnread : {}),
    }),
    [isUnread]
  );

  const titleStyle = useMemo(
    () => ({
      ...styles.itemTitle,
      ...(isUnread ? styles.itemTitleUnread : {}),
    }),
    [isUnread]
  );

  return (
    <li
      role="option"
      aria-selected={false}
      aria-label={`${notification.title}${isUnread ? ' (não lida)' : ''}`}
      tabIndex={0}
      style={itemStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-notifica-item=""
      data-notifica-unread={isUnread ? '' : undefined}
    >
      {/* Unread dot */}
      {isUnread ? (
        <span
          style={styles.itemDot}
          aria-hidden="true"
          data-notifica-dot=""
        />
      ) : (
        <span
          style={styles.itemDotPlaceholder}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div style={styles.itemContent}>
        <p style={titleStyle}>{notification.title}</p>

        {notification.body && (
          <p style={styles.itemBody}>{notification.body}</p>
        )}

        <time
          style={styles.itemTime}
          dateTime={notification.inserted_at}
          title={new Date(notification.inserted_at).toLocaleString()}
        >
          {timeAgo}
        </time>
      </div>
    </li>
  );
}
