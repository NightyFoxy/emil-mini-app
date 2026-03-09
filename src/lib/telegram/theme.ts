import { getTelegramWebApp } from './env';

const themeKeyMap: Record<string, string> = {
  bg_color: '--tg-bg-color',
  secondary_bg_color: '--tg-secondary-bg-color',
  section_bg_color: '--tg-section-bg-color',
  text_color: '--tg-text-color',
  hint_color: '--tg-hint-color',
  link_color: '--tg-link-color',
  button_color: '--tg-button-color',
  button_text_color: '--tg-button-text-color',
  destructive_text_color: '--tg-destructive-text-color',
  section_header_text_color: '--tg-section-header-text-color',
  subtitle_text_color: '--tg-subtitle-text-color',
  accent_text_color: '--tg-accent-text-color',
};

export function applyTelegramTheme() {
  const root = document.documentElement;
  const app = getTelegramWebApp();
  const theme = app?.themeParams ?? {};

  for (const [sourceKey, cssVar] of Object.entries(themeKeyMap)) {
    const value = theme[sourceKey];
    if (value) {
      root.style.setProperty(cssVar, value);
    }
  }

  root.dataset.scheme = app?.colorScheme ?? 'light';
}
