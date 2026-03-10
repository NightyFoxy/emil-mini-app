import type { AppShellState } from '@/types/models';
import type { StorageAdapter } from './types';

export const LOCAL_STORAGE_KEY = 'emil-mini-app-state';

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

      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) {
        return null;
      }

      return JSON.parse(raw) as AppShellState;
    },
    async save(snapshot) {
      if (!this.isAvailable()) {
        return;
      }

      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
    },
  };
}
