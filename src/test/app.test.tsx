import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { App } from '@/app/App';
import { createDemoShellState, createEmptyShellState } from '@/app/seed';
import { useAppStore } from '@/app/store';

const initialStoreState = useAppStore.getState();

describe('app flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, '', '/');
    useAppStore.setState({
      ...initialStoreState,
      ...createEmptyShellState(),
      initialized: false,
      plannerItems: [],
      dailyCheckins: [],
      reminderSettings: {
        reminder: 'off',
        tone: 'calm',
        expensesEnabled: false,
        workoutsEnabled: false,
      },
    });
  });

  it('onboarding ends on calendar', async () => {
    useAppStore.setState({
      ...createEmptyShellState(),
      initialized: true,
      plannerItems: [],
      dailyCheckins: [],
      reminderSettings: {
        reminder: 'off',
        tone: 'calm',
        expensesEnabled: false,
        workoutsEnabled: false,
      },
      loadApp: vi.fn(),
    });

    render(<App />);

    fireEvent.click(screen.getByText('Всё сразу'));
    fireEvent.click(screen.getByText('Дальше'));
    fireEvent.click(screen.getByText('Всё держу в голове'));
    fireEvent.click(screen.getByText('Дальше'));
    fireEvent.click(screen.getByText('Деловой'));
    fireEvent.click(screen.getByText('Дальше'));
    fireEvent.click(screen.getByText('Вечером'));
    fireEvent.click(screen.getByText('Дальше'));
    fireEvent.click(screen.getByText('Всё основное'));
    fireEvent.click(screen.getByText('Готово'));

    await waitFor(() => {
      expect(useAppStore.getState().setupCompleted).toBe(true);
      expect(screen.getByRole('heading', { name: 'Календарь' })).toBeInTheDocument();
    });
  });

  it('calendar opens selected date from deep link state', async () => {
    window.history.pushState({}, '', '/?date=2026-03-11');
    render(<App />);

    await waitFor(() => {
      expect(useAppStore.getState().selectedDate).toBe('2026-03-11');
    });
  });

  it('russian production ui does not expose debug or technical blocks', async () => {
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
      loadApp: vi.fn(),
    });
    render(<App />);

    expect(screen.queryByText(/Debug|Export|JSON|Summary|LLM|Storage|Profile/)).not.toBeInTheDocument();
  });

  it('empty state is clear and safe', () => {
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
      loadApp: vi.fn(),
    });

    render(<App />);

    expect(screen.getByText('На этот день пока ничего нет')).toBeInTheDocument();
  });
});
