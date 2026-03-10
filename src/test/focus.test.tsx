import { fireEvent, render, screen } from '@testing-library/react';

import { FocusScreen } from '@/features/focus/FocusScreen';
import { createDemoShellState } from '@/app/seed';
import { useAppStore } from '@/app/store';

describe('focus', () => {
  it('focus no longer crashes with empty state', () => {
    useAppStore.setState({
      ...createDemoShellState(),
      initialized: true,
      plannerItems: [],
      dailyCheckins: [],
      reminderSettings: {
        reminder: 'off',
        tone: 'calm',
        expensesEnabled: false,
        workoutsEnabled: false,
      },
      focusedTaskId: null,
    });

    render(<FocusScreen />);
    expect(screen.getByText('Нет задачи для фокуса')).toBeInTheDocument();
  });

  it('focus no longer crashes with malformed selected task id', () => {
    useAppStore.setState({
      ...createDemoShellState(),
      initialized: true,
      focusedTaskId: 'broken-id',
      plannerItems: [
        {
          id: 'task-1',
          userId: 'demo-user',
          type: 'task',
          title: 'Собрать план дня',
          date: '2026-03-10',
          status: 'planned',
          source: 'bot',
          createdAt: '2026-03-10T08:00:00.000Z',
          updatedAt: '2026-03-10T08:00:00.000Z',
        },
      ],
      dailyCheckins: [],
      reminderSettings: {
        reminder: 'off',
        tone: 'calm',
        expensesEnabled: false,
        workoutsEnabled: false,
      },
    });

    render(<FocusScreen />);
    fireEvent.click(screen.getByText('Слишком большая'));
    expect(screen.getByText('Сократи задачу до действия на 5 минут')).toBeInTheDocument();
  });
});
