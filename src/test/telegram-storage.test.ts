import { createCompletedDemoState } from '@/app/seed';
import { createTelegramCloudAdapter } from '@/lib/storage/telegramCloudAdapter';

describe('telegramCloudAdapter', () => {
  it('stores large snapshots in chunks and restores them', async () => {
    const cloudMap = new Map<string, string>();
    window.Telegram = {
      WebApp: {
        CloudStorage: {
          getItem: (key, callback) => callback(null, cloudMap.get(key) ?? ''),
          setItem: (key, value, callback) => {
            cloudMap.set(key, value);
            callback(null);
          },
        },
      },
    };

    const adapter = createTelegramCloudAdapter();
    const snapshot = createCompletedDemoState();

    await adapter.save(snapshot);
    const restored = await adapter.load();

    expect(cloudMap.get('emil_state_manifest')).toBeTruthy();
    expect(restored?.profile?.displayName).toBe(snapshot.profile?.displayName);
    expect(restored?.tasks).toHaveLength(snapshot.tasks.length);
  });
});
