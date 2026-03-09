import type { AppStateSnapshot } from '@/types/models';

export interface StorageAdapter {
  kind: 'localStorage' | 'telegramCloud' | 'memory';
  isAvailable(): boolean;
  load(): Promise<AppStateSnapshot | null>;
  save(snapshot: AppStateSnapshot): Promise<void>;
}
