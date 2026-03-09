import type { AppStateSnapshot } from '@/types/models';
import type { StorageAdapter } from './types';

const STORAGE_KEY = 'emil-mini-app-state';

export function createLocalStorageAdapter(): StorageAdapter {
  return {
    kind: 'localStorage',
    isAvailable() {
      return typeof window !== 'undefined' && 'localStorage' in window;
    },
    async load() {
      if (!this.isAvailable()) {
        return null;
      }

      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      return JSON.parse(raw) as AppStateSnapshot;
    },
    async save(snapshot) {
      if (!this.isAvailable()) {
        return;
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    },
  };
}
