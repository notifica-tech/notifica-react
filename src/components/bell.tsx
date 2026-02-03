import { useCallback, useRef, useState } from 'react';
import type { NotificaBellProps } from '../types';
import { useUnreadCount } from '../hooks/use-unread-count';
import { useNotifica } from '../hooks/use-notifica';
import { Popover } from './popover';
import { NotificaInbox } from './inbox';
import { styles } from '../styles/default-theme';

// ── Default bell SVG ─────────────────────────────────

function BellSVG(): React.JSX.Element {
  return (
    <svg
      style={styles.bellIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ── Badge ────────────────────────────────────────────

function Badge({ count }: { count: number }): React.JSX.Element | null {
  if (count <= 0) return null;

  const display = count > 99 ? '99+' : String(count);

  return (
    <span
      style={styles.badge}
      aria-label={`${count} notificações não lidas`}
      data-notifica-badge=""
    >
      {display}
    </span>
  );
}

// ── NotificaBell ─────────────────────────────────────

/**
 * Bell icon with unread count badge. Clicking opens a popover inbox.
 *
 * @example
 * ```tsx
 * <NotificaBell popoverPosition="bottom-right" />
 * ```
 */
export function NotificaBell({
  className,
  renderIcon,
  renderBadge,
  popoverPosition = 'bottom-right',
  inboxProps,
}: NotificaBellProps): React.JSX.Element {
  const { labels } = useNotifica();
  const { count } = useUnreadCount();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div
      className={className}
      style={{ position: 'relative', display: 'inline-block' }}
      data-notifica-bell=""
    >
      <button
        ref={buttonRef}
        type="button"
        style={styles.bellButton}
        onClick={toggle}
        aria-label={`${labels.notifications}${count > 0 ? ` (${count} não lidas)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        data-notifica-bell-button=""
      >
        {renderIcon ? renderIcon(count) : <BellSVG />}
        {renderBadge ? renderBadge(count) : <Badge count={count} />}
      </button>

      <Popover
        isOpen={isOpen}
        onClose={close}
        anchorRef={buttonRef}
        position={popoverPosition}
      >
        <NotificaInbox maxHeight={420} {...inboxProps} />
      </Popover>
    </div>
  );
}
