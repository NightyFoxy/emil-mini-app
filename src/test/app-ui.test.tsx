import { fireEvent, render, screen, within } from '@testing-library/react';

import { App } from '@/app/App';
import { createDemoState } from '@/app/seed';
import { useAppStore } from '@/app/store';

describe('production ui', () => {
  beforeEach(() => {
    useAppStore.setState({
      ...createDemoState(),
      initialized: true,
      loadState: vi.fn(),
    });
  });

  it('has exactly 4 bottom tabs', () => {
    render(<App />);

    const nav = screen.getByRole('navigation');
    expect(within(nav).getAllByRole('button')).toHaveLength(4);
  });

  it('clicking focus does not crash', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Фокус' }));

    expect(screen.getByText('Что мешает начать?')).toBeInTheDocument();
  });

  it('does not expose debug or technical ui strings', () => {
    render(<App />);

    const forbidden = ['Debug', 'Storage', 'Profile', 'Summary', 'Assistant rules', 'Export', 'LLM', 'JSON', 'browser dev mode'];
    for (const text of forbidden) {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    }
  });

  it('uses Russian primary screen titles', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Календарь' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));
    expect(screen.getByRole('heading', { name: 'Добавить' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Фокус' }));
    expect(screen.getByRole('heading', { name: 'Фокус' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Настройки' }));
    expect(screen.getByRole('heading', { name: 'Настройки' })).toBeInTheDocument();
  });
});
