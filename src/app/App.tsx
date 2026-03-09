import { useEffect } from 'react';

import { useAppStore } from './store';
import { applyTelegramTheme } from '@/lib/telegram/theme';
import { ensureTelegramEnvironment, getTelegramUserDisplayName, isTelegramRuntime, signalReady } from '@/lib/telegram/env';
import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { TodayScreen } from '@/features/today/TodayScreen';
import { InboxScreen } from '@/features/inbox/InboxScreen';
import { FocusScreen } from '@/features/focus/FocusScreen';
import { WeekScreen } from '@/features/week/WeekScreen';
import { ProfileScreen } from '@/features/profile/ProfileScreen';
import { Card } from '@/components/ui';
import type { TabId } from '@/types/models';

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'today', label: 'Today' },
  { id: 'inbox', label: 'Inbox' },
  { id: 'focus', label: 'Focus' },
  { id: 'week', label: 'Week' },
  { id: 'profile', label: 'Profile' },
];

function AppBody() {
  const initialized = useAppStore((state) => state.initialized);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const activeTab = useAppStore((state) => state.activeTab);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
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

  if (!onboardingCompleted) {
    return (
      <div className="mx-auto min-h-dvh w-full max-w-md px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(20px+env(safe-area-inset-top))]">
        <OnboardingFlow displayName={getTelegramUserDisplayName()} onComplete={completeOnboarding} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-[calc(92px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
      <main className="flex-1">
        {activeTab === 'today' ? <TodayScreen /> : null}
        {activeTab === 'inbox' ? <InboxScreen /> : null}
        {activeTab === 'focus' ? <FocusScreen /> : null}
        {activeTab === 'week' ? <WeekScreen /> : null}
        {activeTab === 'profile' ? <ProfileScreen /> : null}
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

      {import.meta.env.DEV && !isTelegramRuntime() ? (
        <div className="fixed right-4 top-4 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-[var(--tg-hint-color)]">
          browser dev mode
        </div>
      ) : null}
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
