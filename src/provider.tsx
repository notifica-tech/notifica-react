import { createContext, useCallback, useEffect, useMemo, useRef } from 'react';
import type {
  NotificaContextValue,
  NotificaLabels,
  NotificaLocale,
  NotificaProviderProps,
} from './types';
import { lightTokens, tokensToCSS } from './styles/tokens';
import { styles } from './styles/default-theme';

// ── i18n ─────────────────────────────────────────────

const LABELS_PT_BR: NotificaLabels = {
  notifications: 'Notificações',
  markAllAsRead: 'Marcar todas como lidas',
  loadMore: 'Carregar mais',
  emptyTitle: 'Nenhuma notificação',
  emptyDescription: 'Quando você receber notificações, elas aparecerão aqui.',
  justNow: 'agora',
  minutesAgo: (n: number) => `há ${n} min`,
  hoursAgo: (n: number) => (n === 1 ? 'há 1 hora' : `há ${n} horas`),
  yesterday: 'ontem',
  daysAgo: (n: number) => `há ${n} dias`,
};

const LABELS_EN: NotificaLabels = {
  notifications: 'Notifications',
  markAllAsRead: 'Mark all as read',
  loadMore: 'Load more',
  emptyTitle: 'No notifications',
  emptyDescription: "When you receive notifications, they'll appear here.",
  justNow: 'just now',
  minutesAgo: (n: number) => `${n}m ago`,
  hoursAgo: (n: number) => (n === 1 ? '1h ago' : `${n}h ago`),
  yesterday: 'yesterday',
  daysAgo: (n: number) => `${n}d ago`,
};

const LOCALE_MAP: Record<NotificaLocale, NotificaLabels> = {
  'pt-BR': LABELS_PT_BR,
  en: LABELS_EN,
};

// ── Context ──────────────────────────────────────────

export const NotificaContext = createContext<NotificaContextValue | null>(null);

// ── Provider ─────────────────────────────────────────

const DEFAULT_API_URL = 'https://api.usenotifica.com.br';
const DEFAULT_POLLING_INTERVAL = 30_000;
const DEFAULT_LOCALE: NotificaLocale = 'pt-BR';

export function NotificaProvider({
  apiKey,
  subscriberId,
  apiUrl = DEFAULT_API_URL,
  pollingInterval = DEFAULT_POLLING_INTERVAL,
  locale = DEFAULT_LOCALE,
  labels: labelOverrides,
  children,
}: NotificaProviderProps): React.JSX.Element {
  const styleInjectedRef = useRef(false);

  // Inject CSS custom properties and keyframes once
  useEffect(() => {
    if (styleInjectedRef.current) return;
    // SSR guard
    if (typeof document === 'undefined') return;

    const existing = document.getElementById('notifica-styles');
    if (existing) {
      styleInjectedRef.current = true;
      return;
    }

    const style = document.createElement('style');
    style.id = 'notifica-styles';
    style.textContent = `${tokensToCSS(lightTokens)}\n${styles.keyframes}`;
    document.head.appendChild(style);
    styleInjectedRef.current = true;
  }, []);

  const config = useMemo(
    () => ({
      apiKey,
      subscriberId,
      apiUrl: apiUrl.replace(/\/+$/, ''),
      pollingInterval,
      locale,
    }),
    [apiKey, subscriberId, apiUrl, pollingInterval, locale]
  );

  const labels = useMemo<NotificaLabels>(() => {
    const base = LOCALE_MAP[locale] ?? LABELS_PT_BR;
    if (!labelOverrides) return base;
    return { ...base, ...labelOverrides };
  }, [locale, labelOverrides]);

  const apiFetch = useCallback(
    async <T = unknown>(path: string, options: RequestInit = {}): Promise<T> => {
      const url = `${config.apiUrl}${path}`;
      const headers = new Headers(options.headers);
      headers.set('Authorization', `Bearer ${config.apiKey}`);
      headers.set('Content-Type', 'application/json');

      const res = await fetch(url, { ...options, headers });

      if (!res.ok) {
        const errorBody = await res.text().catch(() => '');
        throw new Error(
          `Notifica API error: ${res.status} ${res.statusText}${errorBody ? ` — ${errorBody}` : ''}`
        );
      }

      return res.json() as Promise<T>;
    },
    [config.apiUrl, config.apiKey]
  );

  const contextValue = useMemo<NotificaContextValue>(
    () => ({ config, labels, apiFetch }),
    [config, labels, apiFetch]
  );

  return (
    <NotificaContext.Provider value={contextValue}>
      <div data-notifica="" data-notifica-locale={locale}>
        {children}
      </div>
    </NotificaContext.Provider>
  );
}
