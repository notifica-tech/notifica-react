/**
 * @notifica/react — Exemplo de uso básico
 *
 * Este arquivo demonstra as três formas principais de usar o SDK:
 * 1. Bell com popover (mais comum)
 * 2. Inbox standalone
 * 3. Hooks para UI customizada
 */

import React from 'react';
import {
  NotificaProvider,
  NotificaBell,
  NotificaInbox,
  useNotifications,
  useUnreadCount,
  darkTokens,
  tokensToCSS,
} from '@notifica/react';

// ── 1. Setup básico com Bell ─────────────────────────

function AppComBell() {
  return (
    <NotificaProvider
      apiKey="nk_live_sua_chave_aqui"
      subscriberId="user_123"
      apiUrl="https://api.usenotifica.com.br"
    >
      <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <NotificaBell popoverPosition="bottom-right" />
      </header>
    </NotificaProvider>
  );
}

// ── 2. Inbox standalone ──────────────────────────────

function PaginaNotificacoes() {
  return (
    <NotificaProvider
      apiKey="nk_live_sua_chave_aqui"
      subscriberId="user_123"
    >
      <div style={{ maxWidth: 600, margin: '2rem auto' }}>
        <NotificaInbox
          maxHeight={500}
          pageSize={15}
          onNotificationClick={(notification) => {
            if (notification.action_url) {
              window.location.href = notification.action_url;
            }
          }}
        />
      </div>
    </NotificaProvider>
  );
}

// ── 3. Hooks para UI customizada ─────────────────────

function ContadorCustomizado() {
  const { count } = useUnreadCount();

  return (
    <div style={{ padding: '1rem' }}>
      <h3>
        {count > 0
          ? `Você tem ${count} notificação${count > 1 ? 'ões' : ''} não lida${count > 1 ? 's' : ''}`
          : 'Tudo em dia! ✅'
        }
      </h3>
    </div>
  );
}

function ListaCustomizada() {
  const {
    notifications,
    isLoading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotifications(10);

  if (isLoading) return <p>Carregando...</p>;

  return (
    <div>
      <button onClick={markAllAsRead}>Marcar todas como lidas</button>

      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => markAsRead(n.id)}
          style={{
            padding: '1rem',
            borderBottom: '1px solid #eee',
            backgroundColor: n.read_at ? 'white' : '#f0f7ff',
          }}
        >
          <strong>{n.title}</strong>
          {n.body && <p>{n.body}</p>}
        </div>
      ))}

      {hasMore && (
        <button onClick={loadMore}>Carregar mais</button>
      )}
    </div>
  );
}

function AppComHooksCustomizados() {
  return (
    <NotificaProvider
      apiKey="nk_live_sua_chave_aqui"
      subscriberId="user_123"
      pollingInterval={15_000}
      locale="pt-BR"
    >
      <ContadorCustomizado />
      <ListaCustomizada />
    </NotificaProvider>
  );
}

// ── 4. Dark mode ─────────────────────────────────────

function AppDarkMode() {
  return (
    <>
      {/* Injeta tokens dark mode via CSS */}
      <style>{tokensToCSS(darkTokens)}</style>

      <NotificaProvider
        apiKey="nk_live_sua_chave_aqui"
        subscriberId="user_123"
      >
        <NotificaBell />
      </NotificaProvider>
    </>
  );
}

// ── 5. i18n (English) ────────────────────────────────

function AppIngles() {
  return (
    <NotificaProvider
      apiKey="nk_live_sua_chave_aqui"
      subscriberId="user_123"
      locale="en"
    >
      <NotificaInbox maxHeight={400} />
    </NotificaProvider>
  );
}

// ── 6. Labels customizadas ───────────────────────────

function AppLabelsCustom() {
  return (
    <NotificaProvider
      apiKey="nk_live_sua_chave_aqui"
      subscriberId="user_123"
      labels={{
        notifications: 'Central de Avisos',
        emptyTitle: 'Nada por aqui!',
        emptyDescription: 'Volte mais tarde para ver novidades.',
        markAllAsRead: 'Limpar tudo',
      }}
    >
      <NotificaBell />
    </NotificaProvider>
  );
}

// ── 7. Bell com ícone e badge customizados ───────────

function AppBellCustom() {
  return (
    <NotificaProvider
      apiKey="nk_live_sua_chave_aqui"
      subscriberId="user_123"
    >
      <NotificaBell
        renderIcon={(count) => (
          <span style={{ fontSize: '1.5rem' }}>
            {count > 0 ? '🔔' : '🔕'}
          </span>
        )}
        renderBadge={(count) =>
          count > 0 ? (
            <span style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
            }}>
              {count}
            </span>
          ) : null
        }
      />
    </NotificaProvider>
  );
}

// ── Export ────────────────────────────────────────────

export {
  AppComBell,
  PaginaNotificacoes,
  AppComHooksCustomizados,
  AppDarkMode,
  AppIngles,
  AppLabelsCustom,
  AppBellCustom,
};
