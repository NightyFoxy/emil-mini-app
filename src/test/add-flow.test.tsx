import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { CaptureScreen } from '@/features/capture/CaptureScreen';
import { createDemoShellState } from '@/app/seed';
import { useAppStore } from '@/app/store';

describe('capture flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAppStore.setState({
      ...createDemoShellState(),
      initialized: true,
      plannerItems: [],
      dailyCheckins: [],
      reminderSettings: {
        reminder: 'off',
        tone: 'calm',
        expensesEnabled: true,
        workoutsEnabled: true,
      },
      addPlannerItem: useAppStore.getState().addPlannerItem,
    });
  });

  it('creates planner item from add flow', async () => {
    render(<CaptureScreen />);

    fireEvent.change(screen.getByPlaceholderText('Название задачи'), { target: { value: 'Купить продукты' } });
    fireEvent.click(screen.getByText('Сохранить'));

    await waitFor(() => {
      expect(useAppStore.getState().plannerItems.some((item) => item.title === 'Купить продукты')).toBe(true);
    });
  });
});
