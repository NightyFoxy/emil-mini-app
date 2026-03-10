import { render, screen } from '@testing-library/react';

import { FocusScreen } from '@/features/focus/FocusScreen';
import { createDemoState, createEmptyState } from '@/app/seed';
import { normalizeSnapshot, useAppStore } from '@/app/store';

describe('FocusScreen', () => {
  it('shows safe empty state when there are no tasks', () => {
    useAppStore.setState({ ...createEmptyState(), initialized: true });

    render(<FocusScreen />);

    expect(screen.getByText('Нет задачи для фокуса')).toBeInTheDocument();
    expect(screen.getByText('Вернуться в календарь')).toBeInTheDocument();
  });

  it('does not crash with malformed focused task id', () => {
    useAppStore.setState({
      ...createDemoState(),
      initialized: true,
      focusedTaskId: 'broken-id',
    });

    render(<FocusScreen />);

    expect(screen.getByText('Фокус')).toBeInTheDocument();
    expect(screen.getByText('Собрать план дня')).toBeInTheDocument();
  });

  it('normalizes corrupted persisted data into a safe state', () => {
    const normalized = normalizeSnapshot({
      tasks: [{ id: 't1', title: 'Старая задача', status: 'todo' }],
      expenses: [],
      workouts: [],
    });

    expect(normalized?.entries[0]?.type).toBe('task');
    expect(normalized?.activeTab).toBe('calendar');
  });
});
