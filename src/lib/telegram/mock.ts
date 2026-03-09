const mockInitDataRaw =
  'query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A777000%2C%22first_name%22%3A%22Emil%20Dev%22%2C%22username%22%3A%22emil_dev%22%7D&auth_date=1710000000&hash=mock';

export function installTelegramMock() {
  if (typeof window === 'undefined' || window.Telegram?.WebApp) {
    return;
  }

  const themeParams = {
    bg_color: '#0f172a',
    secondary_bg_color: '#111827',
    text_color: '#e5eef9',
    hint_color: '#8da2bf',
    link_color: '#6aa7ff',
    button_color: '#e5eef9',
    button_text_color: '#0f172a',
    accent_text_color: '#c7dcff',
    destructive_text_color: '#f87171',
    section_bg_color: '#0b1220',
    section_header_text_color: '#9fb7d9',
    subtitle_text_color: '#9fb7d9',
  };

  const store = new Map<string, string>();

  window.Telegram = {
    WebApp: {
      initData: mockInitDataRaw,
      initDataUnsafe: {
        user: {
          id: 777000,
          first_name: 'Emil Dev',
          username: 'emil_dev',
        },
      },
      colorScheme: 'dark',
      isExpanded: true,
      platform: 'web',
      version: '8.0',
      themeParams,
      ready: () => undefined,
      expand: () => undefined,
      enableClosingConfirmation: () => undefined,
      HapticFeedback: {
        impactOccurred: () => undefined,
      },
      MainButton: {
        show: () => undefined,
        hide: () => undefined,
        setParams: () => undefined,
        onClick: () => undefined,
        offClick: () => undefined,
      },
      BackButton: {
        show: () => undefined,
        hide: () => undefined,
        onClick: () => undefined,
        offClick: () => undefined,
      },
      CloudStorage: {
        getItem: (key: string, callback: (error: Error | null, value: string) => void) => {
          callback(null, store.get(key) ?? '');
        },
        setItem: (key: string, value: string, callback: (error: Error | null) => void) => {
          store.set(key, value);
          callback(null);
        },
      },
      requestWriteAccess: (callback?: (granted: boolean) => void) => {
        callback?.(true);
      },
    },
  } as Window['Telegram'];
}
