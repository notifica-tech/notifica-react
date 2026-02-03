import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotifica } from './use-notifica';
import type {
  NotificaListResponse,
  NotificaMarkAllReadResponse,
  NotificaNotification,
  UseNotificationsReturn,
} from '../types';

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
export function useNotifications(pageSize: number = 20): UseNotificationsReturn {
  const { config, apiFetch } = useNotifica();
  const { subscriberId, pollingInterval } = config;

  const [notifications, setNotifications] = useState<NotificaNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
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
    async (offset: number = 0, append: boolean = false) => {
      try {
        const params = new URLSearchParams({
          limit: String(pageSize),
          offset: String(offset),
        });

        const res = await apiFetch<NotificaListResponse>(`${basePath}?${params.toString()}`);

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

  // Initial fetch
  useEffect(() => {
    setIsLoading(true);
    offsetRef.current = 0;
    fetchNotifications(0, false).finally(() => {
      if (mountedRef.current) setIsLoading(false);
    });
  }, [fetchNotifications]);

  // Polling
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
    async (id: string) => {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );

      try {
        await apiFetch(`${basePath}/${encodeURIComponent(id)}/read`, {
          method: 'POST',
        });
      } catch (err) {
        // Revert on failure
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read_at: null } : n))
        );
        throw err;
      }
    },
    [apiFetch, basePath]
  );

  const markAllAsRead = useCallback(async () => {
    const now = new Date().toISOString();

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.read_at ? n : { ...n, read_at: now }))
    );

    try {
      await apiFetch<NotificaMarkAllReadResponse>(`${basePath}/read-all`, {
        method: 'POST',
      });
    } catch (err) {
      // Revert on failure — refresh from server
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
    markAllAsRead,
  };
}
