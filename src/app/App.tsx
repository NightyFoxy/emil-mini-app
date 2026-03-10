import { useEffect } from 'react';

import { useAppStore } from './store';
import { applyTelegramTheme } from '@/lib/telegram/theme';
import { ensureTelegramEnvironment, getTelegramUserDisplayName, signalReady } from '@/lib/telegram/env';
import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { CalendarScreen } from '@/features/calendar/CalendarScreen';
import { CaptureScreen } from '@/features/capture/CaptureScreen';
import { FocusScreen } from '@/features/focus/FocusScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import { Card } from '@/components/ui';

function AppBody() {
  const initialized = useAppStore((state) => state.initialized);
  const setupCompleted = useAppStore((state) => state.setupCompleted);
  const overlay = useAppStore((state) => state.overlay);
  const completeSetup = useAppStore((state) => state.completeSetup);
  const openOverlay = useAppStore((state) => state.openOverlay);
  const closeOverlay = useAppStore((state) => state.closeOverlay);

  useEffect(() => {
    ensureTelegramEnvironment();
    applyTelegramTheme();
  }, []);

  useEffect(() => {
    if (initialized) {
      signalReady();
    }
  }, [initialized]);

  if (!initialized) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <Card className="w-full max-w-sm text-center text-sm text-[var(--tg-hint-color)]">Загрузка панели…</Card>
      </div>
    );
  }

  if (!setupCompleted) {
    return (
      <div className="mx-auto min-h-dvh w-full max-w-md px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(20px+env(safe-area-inset-top))]">
        <OnboardingFlow displayName={getTelegramUserDisplayName()} onComplete={completeSetup} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-[calc(92px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
      <main className="flex-1">
        <CalendarScreen />
      </main>

      <button
        type="button"
        onClick={() => openOverlay('capture')}
        className="fixed bottom-[calc(24px+env(safe-area-inset-bottom))] left-1/2 z-20 w-[calc(100%-32px)] max-w-[380px] -translate-x-1/2 rounded-[22px] bg-[var(--tg-button-color)] px-5 py-4 text-sm font-semibold text-[var(--tg-button-text-color)] shadow-[0_10px_30px_rgba(15,23,42,0.2)]"
      >
        + Добавить
      </button>

      {overlay ? (
        <div className="fixed inset-0 z-30 bg-[rgba(15,23,42,0.36)] px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-[calc(20px+env(safe-area-inset-top))] backdrop-blur-sm">
          <div className="mx-auto h-full w-full max-w-md overflow-auto rounded-[28px] bg-[var(--tg-bg-color)] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.28)]">
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={closeOverlay} className="rounded-full bg-white/6 px-3 py-2 text-sm text-[var(--tg-text-color)]">
                Закрыть
              </button>
            </div>
            {overlay === 'capture' ? <CaptureScreen /> : null}
            {overlay === 'focus' ? <FocusScreen /> : null}
            {overlay === 'settings' ? <SettingsScreen /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function App() {
  const loadApp = useAppStore((state) => state.loadApp);

  useEffect(() => {
    void loadApp();
  }, [loadApp]);

  return <AppBody />;
}
