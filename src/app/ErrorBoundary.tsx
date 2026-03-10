import { Component, type ErrorInfo, type ReactNode } from 'react';

import { useAppStore } from '@/app/store';
import { Card, PrimaryButton } from '@/components/ui';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    useAppStore.setState({ overlay: null, focusedTaskId: null });
    console.error('App crashed', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh items-center justify-center p-6">
          <Card className="w-full max-w-sm space-y-4 text-center">
            <div className="space-y-2">
              <div className="text-lg font-semibold text-[var(--tg-text-color)]">Что-то пошло не так</div>
              <div className="text-sm text-[var(--tg-hint-color)]">
                Перезагрузите экран. Данные не будут удалены.
              </div>
            </div>
            <PrimaryButton onClick={() => window.location.reload()}>Перезагрузить экран</PrimaryButton>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
