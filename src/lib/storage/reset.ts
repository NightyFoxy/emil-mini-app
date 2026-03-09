import { getTelegramWebApp } from '@/lib/telegram/env';
import { LOCAL_STORAGE_KEY } from './localStorageAdapter';
import { CHUNK_KEY_PREFIX, MANIFEST_KEY, STORAGE_KEY } from './telegramCloudAdapter';

function setCloudItem(key: string, value: string): Promise<void> {
  const cloudStorage = getTelegramWebApp()?.CloudStorage;
  if (!cloudStorage) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    cloudStorage.setItem(key, value, () => resolve());
  });
}

export async function resetPersistedAppState() {
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  await Promise.all([
    setCloudItem(STORAGE_KEY, ''),
    setCloudItem(MANIFEST_KEY, ''),
    ...Array.from({ length: 12 }, (_, index) => setCloudItem(`${CHUNK_KEY_PREFIX}${index}`, '')),
  ]);
}
