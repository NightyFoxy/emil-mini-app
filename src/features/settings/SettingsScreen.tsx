import { useState } from 'react';

import { useAppStore } from '@/app/store';
import { Card, PrimaryButton, Screen, SectionTitle, Toggle } from '@/components/ui';
import type { ReminderOption, ToneOption } from '@/types/models';

const reminderOptions: Array<{ value: ReminderOption; label: string }> = [
  { value: 'morning', label: 'Утром' },
  { value: 'day', label: 'Днём' },
  { value: 'evening', label: 'Вечером' },
  { value: 'off', label: 'Не надо' },
];

const toneOptions: Array<{ value: ToneOption; label: string }> = [
  { value: 'calm', label: 'Спокойный' },
  { value: 'business', label: 'Деловой' },
  { value: 'tough', label: 'Жёсткий' },
];

export function SettingsScreen() {
  const reminderSettings = useAppStore((state) => state.reminderSettings);
  const updateReminderSettings = useAppStore((state) => state.updateReminderSettings);
  const rerunSetup = useAppStore((state) => state.rerunSetup);
  const resetAllData = useAppStore((state) => state.resetAllData);
  const closeOverlay = useAppStore((state) => state.closeOverlay);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmSetup, setConfirmSetup] = useState(false);

  return (
    <Screen title="Настройки" subtitle="Напоминания и основные параметры">
      <Card className="space-y-4">
        <SectionTitle title="Когда напоминать" />
        <div className="grid grid-cols-2 gap-3">
          {reminderOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => void updateReminderSettings({ reminder: option.value })}
              className={`rounded-[20px] px-4 py-3 text-sm ${
                reminderSettings.reminder === option.value ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]' : 'bg-white text-[var(--tg-text-color)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Тон ассистента" />
        <div className="grid grid-cols-3 gap-3">
          {toneOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => void updateReminderSettings({ tone: option.value })}
              className={`rounded-[20px] px-4 py-3 text-sm ${
                reminderSettings.tone === option.value ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]' : 'bg-white text-[var(--tg-text-color)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Модули" />
        <Toggle
          checked={reminderSettings.expensesEnabled}
          onChange={(next) => void updateReminderSettings({ expensesEnabled: next })}
          label="Траты"
        />
        <Toggle
          checked={reminderSettings.workoutsEnabled}
          onChange={(next) => void updateReminderSettings({ workoutsEnabled: next })}
          label="Тренировки"
        />
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Настройка" />
        <PrimaryButton onClick={() => setConfirmSetup(true)}>Пройти настройку заново</PrimaryButton>
        {confirmSetup ? (
          <div className="space-y-3 rounded-[20px] bg-white p-4">
            <div className="text-sm text-[var(--tg-text-color)]">Настройка откроется заново, записи останутся.</div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setConfirmSetup(false)} className="rounded-[18px] border border-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">Отмена</button>
              <button type="button" onClick={() => void rerunSetup()} className="rounded-[18px] bg-[var(--tg-button-color)] px-4 py-3 text-sm text-[var(--tg-button-text-color)]">Продолжить</button>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Все данные" />
        <button type="button" onClick={() => setConfirmReset(true)} className="w-full rounded-[20px] border border-red-400/30 px-4 py-3 text-sm font-medium text-red-500">
          Очистить все данные
        </button>
        {confirmReset ? (
          <div className="space-y-3 rounded-[20px] bg-white p-4">
            <div className="text-sm text-[var(--tg-text-color)]">Это удалит все записи и настройку.</div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setConfirmReset(false)} className="rounded-[18px] border border-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">Отмена</button>
              <button type="button" onClick={() => void resetAllData()} className="rounded-[18px] bg-red-500 px-4 py-3 text-sm text-white">Удалить</button>
            </div>
          </div>
        ) : null}
      </Card>

      <button type="button" onClick={closeOverlay} className="w-full rounded-[20px] border border-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">
        Закрыть
      </button>
    </Screen>
  );
}
