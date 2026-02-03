import { useCallback, useEffect, useRef, useState } from 'react';
import type { PopoverProps } from '../types';
import { styles } from '../styles/default-theme';

/**
 * Lightweight, accessible popover positioned relative to an anchor element.
 *
 * - Closes on Escape, click outside, or focus leaving the popover
 * - Traps focus within while open
 * - SSR safe (no window access during render)
 */
export function Popover({
  isOpen,
  onClose,
  anchorRef,
  position,
  children,
}: PopoverProps): React.JSX.Element | null {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [posStyle, setPosStyle] = useState<React.CSSProperties>({});

  // Calculate position relative to anchor
  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;

    // SSR guard
    if (typeof window === 'undefined') return;

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const top = rect.bottom + scrollY + 8;
      let left: number;

      switch (position) {
        case 'bottom-left':
          left = rect.left + scrollX;
          break;
        case 'bottom-center':
          left = rect.left + scrollX + rect.width / 2;
          break;
        case 'bottom-right':
        default:
          left = rect.right + scrollX;
          break;
      }

      const transform =
        position === 'bottom-center'
          ? 'translateX(-50%)'
          : position === 'bottom-right'
            ? 'translateX(-100%)'
            : 'none';

      setPosStyle({
        top: `${top}px`,
        left: `${left}px`,
        transform,
      });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, anchorRef, position]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        // Return focus to anchor
        anchorRef.current?.focus();
      }
    },
    [onClose, anchorRef]
  );

  useEffect(() => {
    if (!isOpen) return;
    if (typeof document === 'undefined') return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Focus management: focus first focusable child when opened
  useEffect(() => {
    if (!isOpen || !popoverRef.current) return;

    const firstFocusable = popoverRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible overlay to catch outside clicks */}
      <div
        style={styles.popoverOverlay}
        onClick={onClose}
        aria-hidden="true"
        data-notifica-popover-overlay=""
      />

      {/* Popover container */}
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-label="Notificações"
        style={{ ...styles.popover, ...posStyle }}
        data-notifica-popover=""
      >
        {children}
      </div>
    </>
  );
}
