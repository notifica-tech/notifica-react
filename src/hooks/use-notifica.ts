import { useContext } from 'react';
import { NotificaContext } from '../provider';
import type { NotificaContextValue } from '../types';

/**
 * Access the Notifica context (config, labels, apiFetch).
 *
 * Must be used inside a <NotificaProvider>.
 *
 * @example
 * ```tsx
 * const { apiFetch, labels } = useNotifica();
 * ```
 */
export function useNotifica(): NotificaContextValue {
  const ctx = useContext(NotificaContext);
  if (!ctx) {
    throw new Error(
      '[Notifica] useNotifica() must be used inside a <NotificaProvider>. ' +
        'Wrap your app or component tree with <NotificaProvider publishableKey="..." subscriberId="...">.'
    );
  }
  return ctx;
}
