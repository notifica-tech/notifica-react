import { useCallback } from 'react';
import type { NotificationListProps } from '../types';
import { useNotifica } from '../hooks/use-notifica';
import { NotificationItem } from './notification-item';
import { styles } from '../styles/default-theme';

/**
 * Scrollable list of notification items with "load more" support.
 */
export function NotificationList({
  notifications,
  onNotificationClick,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: NotificationListProps): React.JSX.Element {
  const { labels } = useNotifica();

  const handleLoadMore = useCallback(() => {
    onLoadMore?.();
  }, [onLoadMore]);

  return (
    <div data-notifica-list="">
      <ul
        role="listbox"
        aria-label={labels.notifications}
        style={styles.list}
      >
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={onNotificationClick}
          />
        ))}
      </ul>

      {hasMore && (
        <div style={styles.loadMoreWrapper}>
          <button
            type="button"
            style={styles.loadMoreButton}
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            aria-busy={isLoadingMore}
            data-notifica-load-more=""
          >
            {isLoadingMore ? '...' : labels.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
