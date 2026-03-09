import type { AppStateSnapshot } from '@/types/models';
import { getTelegramWebApp } from '@/lib/telegram/env';
import type { StorageAdapter } from './types';

const STORAGE_KEY = 'emil-mini-app-state';

export function createTelegramCloudAdapter(): StorageAdapter {
  return {
    kind: 'telegramCloud',
    isAvailable() {
      return Boolean(getTelegramWebApp()?.CloudStorage);
    },
    async load() {
      const cloudStorage = getTelegramWebApp()?.CloudStorage;
      if (!cloudStorage) {
        return null;
      }

      return new Promise((resolve, reject) => {
        cloudStorage.getItem(STORAGE_KEY, (error, value) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(value ? (JSON.parse(value) as AppStateSnapshot) : null);
        });
      });
    },
    async save(snapshot) {
      const cloudStorage = getTelegramWebApp()?.CloudStorage;
      if (!cloudStorage) {
        return;
      }

      return new Promise((resolve, reject) => {
        cloudStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot), (error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    },
  };
}
