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
import type { AppTab } from '@/types/models';

const tabs: Array<{ id: AppTab; label: string }> = [
  { id: 'calendar', label: 'Календарь' },
  { id: 'capture', label: 'Добавить' },
  { id: 'focus', label: 'Фокус' },
  { id: 'settings', label: 'Настройки' },
];

function AppBody() {
  const initialized = useAppStore((state) => state.initialized);
  const setupCompleted = useAppStore((state) => state.setupCompleted);
  const activeTab = useAppStore((state) => state.activeTab);
  const completeSetup = useAppStore((state) => state.completeSetup);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

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
        {activeTab === 'calendar' ? <CalendarScreen /> : null}
        {activeTab === 'capture' ? <CaptureScreen /> : null}
        {activeTab === 'focus' ? <FocusScreen /> : null}
        {activeTab === 'settings' ? <SettingsScreen /> : null}
      </main>

      <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md gap-2 border-t border-white/6 bg-[var(--tg-bg-color)]/92 px-4 pb-[calc(14px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-2xl px-3 py-2 text-xs font-medium transition ${
              activeTab === tab.id
                ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
                : 'text-[var(--tg-hint-color)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export function App() {
  const loadState = useAppStore((state) => state.loadState);

  useEffect(() => {
    void loadState();
  }, [loadState]);

  return <AppBody />;
}
