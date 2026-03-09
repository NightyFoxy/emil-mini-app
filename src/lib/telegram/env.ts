import { installTelegramMock } from './mock';

export interface TelegramCloudStorage {
  getItem(key: string, callback: (error: Error | null, value: string) => void): void;
  setItem(key: string, value: string, callback: (error: Error | null) => void): void;
}

export interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: {
    user?: {
      id?: number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
  };
  colorScheme?: 'light' | 'dark';
  platform?: string;
  version?: string;
  isExpanded?: boolean;
  themeParams?: Record<string, string>;
  ready?: () => void;
  expand?: () => void;
  enableClosingConfirmation?: () => void;
  requestWriteAccess?: (callback?: (granted: boolean) => void) => void;
  HapticFeedback?: {
    impactOccurred?: (style: 'light' | 'medium' | 'heavy') => void;
  };
  MainButton?: {
    show: () => void;
    hide: () => void;
    setParams: (params: Record<string, unknown>) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  CloudStorage?: TelegramCloudStorage;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function isTelegramRuntime(): boolean {
  return Boolean(window.Telegram?.WebApp);
}

export function ensureTelegramEnvironment() {
  if (import.meta.env.DEV && !window.Telegram?.WebApp) {
    installTelegramMock();
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp ?? null;
}

export function getTelegramUserDisplayName(): string {
  const user = getTelegramWebApp()?.initDataUnsafe?.user;
  return user?.first_name ?? user?.username ?? 'Пользователь';
}

export function requestTelegramWriteAccess(): Promise<boolean> {
  const app = getTelegramWebApp();
  if (!app?.requestWriteAccess) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    app.requestWriteAccess?.((granted) => resolve(granted));
  });
}

export function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'light') {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred?.(style);
}

export function signalReady() {
  const app = getTelegramWebApp();
  app?.expand?.();
  app?.enableClosingConfirmation?.();
  app?.ready?.();
}
