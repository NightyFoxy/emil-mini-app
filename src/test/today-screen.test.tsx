import { render, screen } from '@testing-library/react';

import { TodayScreen } from '@/features/today/TodayScreen';
import { useAppStore } from '@/app/store';
import { createCompletedDemoState } from '@/app/seed';

describe('TodayScreen', () => {
  it('renders priorities from the store', () => {
    useAppStore.setState({
      ...createCompletedDemoState(),
      initialized: true,
      storageKind: 'localStorage',
    });

    render(<TodayScreen />);

    expect(screen.getByText('Топ-3 приоритета')).toBeInTheDocument();
    expect(screen.getByText('Собрать план дня до 11:00')).toBeInTheDocument();
  });
});
