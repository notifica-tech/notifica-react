import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotifica } from './use-notifica';
import type { NotificaUnreadCountResponse, UseUnreadCountReturn } from '../types';

/**
 * Fetch and poll the unread notification count.
 *
 * @example
 * ```tsx
 * const { count, isLoading } = useUnreadCount();
 * return <span>Unread: {count}</span>;
 * ```
 */
export function useUnreadCount(): UseUnreadCountReturn {
  const { config, apiFetch } = useNotifica();
  const { subscriberId, pollingInterval } = config;

  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
      const res = await apiFetch<NotificaUnreadCountResponse>(basePath);
      if (!mountedRef.current) return;
      setCount(res.data.count);
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [apiFetch, basePath]);

  // Initial fetch
  useEffect(() => {
    setIsLoading(true);
    fetchCount().finally(() => {
      if (mountedRef.current) setIsLoading(false);
    });
  }, [fetchCount]);

  // Polling
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
