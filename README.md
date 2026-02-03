# @notifica/react

Componente React embeddable para notificações in-app. Adicione um sino de notificações e inbox completo ao seu app com poucas linhas de código.

## Instalação

```bash
npm install @notifica/react
# ou
yarn add @notifica/react
# ou
pnpm add @notifica/react
```

> **Requisitos:** React 18+ como peer dependency.

## Início Rápido

```tsx
import { NotificaProvider, NotificaBell } from '@notifica/react';

function App() {
  return (
    <NotificaProvider
      publishableKey="pk_live_sua_chave_aqui"
      subscriberId="user_123"
    >
      <header>
        <NotificaBell />
      </header>
    </NotificaProvider>
  );
}
```

Isso exibe um ícone de sino com badge de contagem de não lidas. Ao clicar, abre um popover com a lista completa de notificações.

---

## Autenticação (v0.2.0+)

O SDK usa **publishable keys** — chaves públicas seguras para uso no frontend.

| Prefixo | Ambiente | Origin restriction |
|---------|----------|-------------------|
| `pk_live_...` | Produção | ✅ Apenas origens permitidas no dashboard |
| `pk_test_...` | Desenvolvimento | ❌ Aceita qualquer origin (localhost, etc.) |

As chamadas enviam os headers:
- `X-Notifica-Publishable-Key` — identifica o tenant
- `X-Notifica-Subscriber-Id` — identifica o subscriber

> **Nunca exponha secret keys no frontend.** Use `publishableKey` para o SDK React e secret keys apenas no backend.

### Dev Mode

Para desenvolvimento local, use uma chave de teste:

```tsx
<NotificaProvider
  publishableKey="pk_test_..."
  subscriberId="user_123"
  apiUrl="http://localhost:4000"
/>
```

### Origin Allowlist

Em produção (`pk_live_...`), o servidor valida a origem da request. Configure as origens permitidas no [dashboard do Notifica](https://app.usenotifica.com.br) → Settings → API Keys → Origin allowlist.

Se a origem não estiver na allowlist, o SDK lança `NotificaOriginError` com uma mensagem amigável.

### Migração de `apiKey` (deprecated)

Se você usava `apiKey` na v0.1.x, ele ainda funciona como alias por 1 versão menor:

```tsx
// ❌ Deprecated (v0.1.x)
<NotificaProvider apiKey="nk_live_..." subscriberId="..." />

// ✅ Novo (v0.2.0+)
<NotificaProvider publishableKey="pk_live_..." subscriberId="..." />
```

O SDK emite um `console.warn` ao detectar `apiKey`. Será removido na v0.3.0.

---

## Componentes

### `<NotificaProvider>`

Provedor de contexto obrigatório. Deve envolver todos os componentes e hooks do Notifica.

```tsx
<NotificaProvider
  publishableKey="pk_live_..."
  subscriberId="user_123"
  apiUrl="https://api.usenotifica.com.br"  // opcional (padrão: https://api.usenotifica.com.br)
  pollingInterval={30000}                   // opcional (padrão: 30s)
  locale="pt-BR"                            // opcional (padrão: "pt-BR")
  labels={{ notifications: 'Avisos' }}      // opcional (override parcial)
>
  {children}
</NotificaProvider>
```

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `publishableKey` | `string` | — | **Obrigatório.** Chave pública do Notifica (`pk_live_...` ou `pk_test_...`) |
| `subscriberId` | `string` | — | **Obrigatório.** ID do assinante (subscriber) |
| `apiUrl` | `string` | `https://api.usenotifica.com.br` | URL base da API |
| `pollingInterval` | `number` | `30000` | Intervalo de polling em ms (0 = desabilitar) |
| `locale` | `'pt-BR' \| 'en'` | `'pt-BR'` | Locale para labels |
| `labels` | `Partial<NotificaLabels>` | — | Override parcial de labels (veja seção i18n) |
| ~~`apiKey`~~ | `string` | — | ⚠️ Deprecated. Use `publishableKey`. Será removido na v0.3.0. |

### `<NotificaBell>`

Ícone de sino com badge de contagem de não lidas. Abre um popover com o inbox ao clicar.

```tsx
<NotificaBell
  popoverPosition="bottom-right"  // "bottom-left" | "bottom-right" | "bottom-center"
  className="meu-bell"
  renderIcon={(count) => <MeuIcone ativo={count > 0} />}
  renderBadge={(count) => count > 0 ? <MeuBadge>{count}</MeuBadge> : null}
  inboxProps={{ maxHeight: 400, pageSize: 15 }}
/>
```

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `className` | `string` | — | Classe CSS no wrapper |
| `popoverPosition` | `string` | `'bottom-right'` | Posição do popover |
| `renderIcon` | `(count: number) => ReactNode` | — | Ícone customizado |
| `renderBadge` | `(count: number) => ReactNode` | — | Badge customizado |
| `inboxProps` | `NotificaInboxProps` | — | Props repassadas ao `<NotificaInbox>` interno |

### `<NotificaInbox>`

Painel completo de inbox, pode ser usado standalone (fora do bell).

```tsx
<NotificaInbox
  maxHeight={400}
  pageSize={20}
  showHeader={true}
  className="meu-inbox"
  onNotificationClick={(notification) => {
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  }}
/>
```

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `maxHeight` | `number` | — | Altura máxima em px (habilita scroll) |
| `className` | `string` | — | Classe CSS no wrapper |
| `pageSize` | `number` | `20` | Notificações por página |
| `showHeader` | `boolean` | `true` | Exibir cabeçalho com título + botão "marcar todas" |
| `onNotificationClick` | `(notification) => void` | — | Callback ao clicar em uma notificação |

**Funcionalidades incluídas:**
- ✅ Indicador de não lida (dot azul)
- ✅ Marca como lida ao clicar
- ✅ Botão "Marcar todas como lidas"
- ✅ "Carregar mais" (paginação)
- ✅ Estado vazio ("Nenhuma notificação")
- ✅ Skeleton de carregamento
- ✅ Timestamps relativos ("há 5 min", "há 1 hora", "ontem")

---

## Hooks

Todos os hooks devem ser usados dentro de `<NotificaProvider>`.

### `useNotifications(pageSize?)`

Hook principal para buscar, paginar e gerenciar notificações.

```tsx
const {
  notifications,   // NotificaNotification[]
  isLoading,       // boolean
  isLoadingMore,   // boolean
  error,           // Error | null
  hasMore,         // boolean
  loadMore,        // () => void
  refresh,         // () => Promise<void>
  markAsRead,      // (id: string) => Promise<void>
  markAllAsRead,   // () => Promise<void>
} = useNotifications(20);
```

### `useUnreadCount()`

Contagem de notificações não lidas (com polling automático).

```tsx
const {
  count,      // number
  isLoading,  // boolean
  error,      // Error | null
  refresh,    // () => Promise<void>
} = useUnreadCount();
```

### `useNotifica()`

Acesso direto ao contexto (config, labels, apiFetch).

```tsx
const { config, labels, apiFetch } = useNotifica();

// Exemplo: chamar a API diretamente
const data = await apiFetch('/v1/subscribers/user_123/notifications?limit=5');
```

---

## Error Handling

### `NotificaOriginError`

Thrown when the API returns 403 due to origin restriction:

```tsx
import { NotificaOriginError } from '@notifica/react';

try {
  await apiFetch('/v1/...');
} catch (err) {
  if (err instanceof NotificaOriginError) {
    // err.status === 403
    // err.message includes: origin, allowlist instructions, dev mode hint
    showToast(err.message);
  }
}
```

---

## Temas (Theming)

O SDK usa **CSS Custom Properties** (variáveis CSS) com prefixo `--ntf-*`. Você pode customizar qualquer token via CSS:

```css
/* No seu CSS global */
[data-notifica] {
  --ntf-color-primary: #7c3aed;
  --ntf-color-bg: #fafafa;
  --ntf-color-badge-bg: #f97316;
  --ntf-radius-lg: 1rem;
  --ntf-font-family: 'Inter', sans-serif;
}
```

### Tokens disponíveis

| Token | Padrão (light) | Descrição |
|-------|----------------|-----------|
| `--ntf-color-bg` | `#ffffff` | Fundo do inbox |
| `--ntf-color-bg-hover` | `#f9fafb` | Fundo ao hover |
| `--ntf-color-bg-unread` | `#f0f7ff` | Fundo de notificação não lida |
| `--ntf-color-text` | `#111827` | Texto principal |
| `--ntf-color-text-secondary` | `#374151` | Texto secundário (body) |
| `--ntf-color-text-muted` | `#9ca3af` | Texto muted (timestamps) |
| `--ntf-color-primary` | `#2563eb` | Cor primária (links, dots) |
| `--ntf-color-border` | `#e5e7eb` | Bordas |
| `--ntf-color-badge-bg` | `#ef4444` | Fundo do badge |
| `--ntf-color-badge-text` | `#ffffff` | Texto do badge |
| `--ntf-font-family` | system fonts | Família tipográfica |
| `--ntf-font-size-sm` | `0.75rem` | Tamanho fonte pequena |
| `--ntf-font-size-base` | `0.875rem` | Tamanho fonte base |
| `--ntf-font-size-lg` | `1rem` | Tamanho fonte grande |
| `--ntf-radius-sm` | `0.25rem` | Border radius pequeno |
| `--ntf-radius-md` | `0.5rem` | Border radius médio |
| `--ntf-radius-lg` | `0.75rem` | Border radius grande |
| `--ntf-inbox-width` | `380px` | Largura do popover |
| `--ntf-bell-size` | `2.5rem` | Tamanho do botão do sino |

### Dark Mode

```tsx
import { darkTokens, tokensToCSS } from '@notifica/react';

// Injete via CSS
<style>{tokensToCSS(darkTokens)}</style>
```

Ou via CSS puro:

```css
@media (prefers-color-scheme: dark) {
  [data-notifica] {
    --ntf-color-bg: #1f2937;
    --ntf-color-bg-hover: #374151;
    --ntf-color-bg-unread: #1e3a5f;
    --ntf-color-text: #f9fafb;
    --ntf-color-text-secondary: #d1d5db;
    --ntf-color-text-muted: #6b7280;
    --ntf-color-border: #374151;
  }
}
```

---

## Internacionalização (i18n)

O SDK vem com labels em **português (pt-BR)** por padrão. Para mudar:

```tsx
// Inglês built-in
<NotificaProvider locale="en" ... />

// Ou labels customizadas
<NotificaProvider
  labels={{
    notifications: 'Central de Avisos',
    emptyTitle: 'Nada por aqui!',
    markAllAsRead: 'Limpar tudo',
    minutesAgo: (n) => `${n} minuto${n > 1 ? 's' : ''} atrás`,
  }}
  ...
/>
```

### Labels disponíveis

| Chave | pt-BR (padrão) | en |
|-------|----------------|-----|
| `notifications` | "Notificações" | "Notifications" |
| `markAllAsRead` | "Marcar todas como lidas" | "Mark all as read" |
| `loadMore` | "Carregar mais" | "Load more" |
| `emptyTitle` | "Nenhuma notificação" | "No notifications" |
| `emptyDescription` | "Quando você receber..." | "When you receive..." |
| `justNow` | "agora" | "just now" |
| `minutesAgo(n)` | "há N min" | "Nm ago" |
| `hoursAgo(n)` | "há N hora(s)" | "Nh ago" |
| `yesterday` | "ontem" | "yesterday" |
| `daysAgo(n)` | "há N dias" | "Nd ago" |

---

## Acessibilidade

- ✅ ARIA labels em todos os elementos interativos
- ✅ Navegação por teclado (Tab, Enter, Space, Escape)
- ✅ Focus management no popover (focus trap, retorno ao bell)
- ✅ `role="listbox"` + `role="option"` na lista
- ✅ `aria-expanded` e `aria-haspopup` no bell
- ✅ `aria-modal` no popover
- ✅ Timestamps com `<time>` semântico e `dateTime`

---

## SSR (Server-Side Rendering)

O SDK é **SSR safe** — não acessa `window` ou `document` durante renderização server-side. A injeção de estilos e cálculo de posição do popover só ocorrem em `useEffect` (client-side only).

---

## API Endpoints Utilizados

O SDK consome a API REST do Notifica automaticamente:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/v1/subscribers/:id/notifications` | Lista notificações |
| `GET` | `/v1/subscribers/:id/notifications/unread-count` | Contagem de não lidas |
| `POST` | `/v1/subscribers/:id/notifications/:nid/read` | Marca como lida |
| `POST` | `/v1/subscribers/:id/notifications/read-all` | Marca todas como lidas |

---

## Tipo `NotificaNotification`

```typescript
interface NotificaNotification {
  id: string;
  tenant_id: string;
  subscriber_id: string;
  title: string;
  body: string | null;
  action_url: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;       // null = não lida
  inserted_at: string;          // ISO 8601
  updated_at: string;           // ISO 8601
}
```

---

## Requisitos Técnicos

- **Zero dependências runtime** — apenas React como peer dependency
- **< 50KB gzipped** — bundle otimizado (~32KB ESM)
- **TypeScript strict mode** — tipos completos exportados
- **CSS-in-JS via CSS custom properties** — sem styled-components/Tailwind
- **Sem window/document no render** — SSR compatível
- **Secure by default** — publishable keys, never secret keys in the browser

---

## Licença

MIT © [Notifica](https://usenotifica.com.br)
