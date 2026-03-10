import { fireEvent, render, screen } from '@testing-library/react';

import { ErrorBoundary } from '@/app/ErrorBoundary';

function BrokenScreen(): JSX.Element {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('reload button does not wipe persisted state', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload },
      configurable: true,
    });
    const removeSpy = vi.spyOn(window.localStorage, 'removeItem');

    render(
      <ErrorBoundary>
        <BrokenScreen />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByText('Перезагрузить экран'));

    expect(reload).toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
