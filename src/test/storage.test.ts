import { createLocalStorageAdapter } from '@/lib/storage/localStorageAdapter';
import { createCompletedDemoState } from '@/app/seed';

describe('localStorage adapter', () => {
  it('saves and loads snapshot', async () => {
    const adapter = createLocalStorageAdapter();
    const snapshot = createCompletedDemoState();

    await adapter.save(snapshot);
    const loaded = await adapter.load();

    expect(loaded?.profile?.displayName).toBe(snapshot.profile?.displayName);
    expect(loaded?.tasks).toHaveLength(snapshot.tasks.length);
  });
});
