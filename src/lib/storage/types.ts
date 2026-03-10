import type { AppShellState } from '@/types/models';

export interface StorageAdapter {
  kind: 'localStorage' | 'telegramCloud' | 'memory';
  isAvailable(): boolean;
  load(): Promise<AppShellState | null>;
  save(snapshot: AppShellState): Promise<void>;
}
