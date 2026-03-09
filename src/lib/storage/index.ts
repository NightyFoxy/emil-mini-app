import { createLocalStorageAdapter } from './localStorageAdapter';
import { createTelegramCloudAdapter } from './telegramCloudAdapter';
import type { StorageAdapter } from './types';

export function createStorageAdapter(): StorageAdapter {
  const telegram = createTelegramCloudAdapter();
  if (telegram.isAvailable()) {
    return telegram;
  }

  return createLocalStorageAdapter();
}
