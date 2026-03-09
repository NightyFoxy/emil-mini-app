import type { AppStateSnapshot } from '@/types/models';
import { getTelegramWebApp } from '@/lib/telegram/env';
import type { StorageAdapter } from './types';

const STORAGE_KEY = 'emil-mini-app-state';
const MANIFEST_KEY = 'emil_state_manifest';
const CHUNK_KEY_PREFIX = 'emil_state_';
const CHUNK_SIZE = 3500;

interface CloudManifest {
  version: 1;
  chunks: number;
}

function getCloudStorage() {
  return getTelegramWebApp()?.CloudStorage;
}

function getItem(key: string): Promise<string> {
  const cloudStorage = getCloudStorage();
  if (!cloudStorage) {
    return Promise.resolve('');
  }

  return new Promise((resolve, reject) => {
    cloudStorage.getItem(key, (error, value) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(value ?? '');
    });
  });
}

function setItem(key: string, value: string): Promise<void> {
  const cloudStorage = getCloudStorage();
  if (!cloudStorage) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    cloudStorage.setItem(key, value, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export function createTelegramCloudAdapter(): StorageAdapter {
  return {
    kind: 'telegramCloud',
    isAvailable() {
      return Boolean(getCloudStorage());
    },
    async load() {
      if (!this.isAvailable()) {
        return null;
      }

      const manifestRaw = await getItem(MANIFEST_KEY);
      if (manifestRaw) {
        const manifest = JSON.parse(manifestRaw) as CloudManifest;
        const parts = await Promise.all(
          Array.from({ length: manifest.chunks }, (_, index) => getItem(`${CHUNK_KEY_PREFIX}${index}`)),
        );
        const raw = parts.join('');
        return raw ? (JSON.parse(raw) as AppStateSnapshot) : null;
      }

      const legacyRaw = await getItem(STORAGE_KEY);
      return legacyRaw ? (JSON.parse(legacyRaw) as AppStateSnapshot) : null;
    },
    async save(snapshot) {
      if (!this.isAvailable()) {
        return;
      }

      const serialized = JSON.stringify(snapshot);
      const chunks =
        serialized.length <= CHUNK_SIZE
          ? [serialized]
          : serialized.match(new RegExp(`.{1,${CHUNK_SIZE}}`, 'g')) ?? [serialized];

      await Promise.all(chunks.map((chunk, index) => setItem(`${CHUNK_KEY_PREFIX}${index}`, chunk)));
      await setItem(MANIFEST_KEY, JSON.stringify({ version: 1, chunks: chunks.length } satisfies CloudManifest));
    },
  };
}
