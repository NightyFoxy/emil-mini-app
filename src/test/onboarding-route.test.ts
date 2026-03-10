import { useAppStore } from '@/app/store';
import { createEmptyState, demoSetupAnswers } from '@/app/seed';

describe('setup completion', () => {
  it('routes user to calendar after setup', async () => {
    useAppStore.setState({ ...createEmptyState(), initialized: true });

    await useAppStore.getState().completeSetup(demoSetupAnswers);

    expect(useAppStore.getState().activeTab).toBe('calendar');
    expect(useAppStore.getState().setupCompleted).toBe(true);
  });
});
