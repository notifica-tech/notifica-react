import type { NotificaThemeTokens } from '../types';

/**
 * CSS custom property prefix: --ntf-*
 *
 * Consumers override tokens via CSS:
 *   :root { --ntf-color-primary: #7c3aed; }
 *
 * Or via the <NotificaProvider> style override (injected inline).
 */

export const lightTokens: NotificaThemeTokens = {
  // Colors
  '--ntf-color-bg': '#ffffff',
  '--ntf-color-bg-hover': '#f9fafb',
  '--ntf-color-bg-unread': '#f0f7ff',
  '--ntf-color-text': '#111827',
  '--ntf-color-text-secondary': '#374151',
  '--ntf-color-text-muted': '#9ca3af',
  '--ntf-color-primary': '#2563eb',
  '--ntf-color-primary-hover': '#1d4ed8',
  '--ntf-color-border': '#e5e7eb',
  '--ntf-color-badge-bg': '#ef4444',
  '--ntf-color-badge-text': '#ffffff',
  '--ntf-color-dot': '#2563eb',
  '--ntf-color-skeleton': '#e5e7eb',
  '--ntf-color-skeleton-shine': '#f3f4f6',
  '--ntf-color-shadow': 'rgba(0, 0, 0, 0.1)',

  // Typography
  '--ntf-font-family':
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  '--ntf-font-size-sm': '0.75rem',
  '--ntf-font-size-base': '0.875rem',
  '--ntf-font-size-lg': '1rem',
  '--ntf-font-weight-normal': '400',
  '--ntf-font-weight-medium': '500',
  '--ntf-font-weight-semibold': '600',

  // Spacing
  '--ntf-space-xs': '0.25rem',
  '--ntf-space-sm': '0.5rem',
  '--ntf-space-md': '0.75rem',
  '--ntf-space-lg': '1rem',
  '--ntf-space-xl': '1.5rem',

  // Borders
  '--ntf-radius-sm': '0.25rem',
  '--ntf-radius-md': '0.5rem',
  '--ntf-radius-lg': '0.75rem',
  '--ntf-radius-full': '9999px',

  // Sizes
  '--ntf-inbox-width': '380px',
  '--ntf-bell-size': '2.5rem',
  '--ntf-badge-size': '1.25rem',
  '--ntf-dot-size': '0.5rem',
};

export const darkTokens: NotificaThemeTokens = {
  ...lightTokens,

  // Override colors for dark mode
  '--ntf-color-bg': '#1f2937',
  '--ntf-color-bg-hover': '#374151',
  '--ntf-color-bg-unread': '#1e3a5f',
  '--ntf-color-text': '#f9fafb',
  '--ntf-color-text-secondary': '#d1d5db',
  '--ntf-color-text-muted': '#6b7280',
  '--ntf-color-primary': '#3b82f6',
  '--ntf-color-primary-hover': '#60a5fa',
  '--ntf-color-border': '#374151',
  '--ntf-color-skeleton': '#374151',
  '--ntf-color-skeleton-shine': '#4b5563',
  '--ntf-color-shadow': 'rgba(0, 0, 0, 0.3)',
};

/**
 * Injects theme tokens as CSS custom properties on a style element.
 * Returns a CSS string suitable for a <style> tag.
 */
export function tokensToCSS(
  tokens: NotificaThemeTokens,
  selector: string = ':host, [data-notifica]'
): string {
  const entries = Object.entries(tokens)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${entries}\n}`;
}
