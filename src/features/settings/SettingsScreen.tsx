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
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const rerunSetup = useAppStore((state) => state.rerunSetup);
  const resetAllData = useAppStore((state) => state.resetAllData);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmRerun, setConfirmRerun] = useState(false);

  return (
    <Screen title="Настройки" subtitle="Только то, что реально влияет на работу">
      <Card className="space-y-4">
        <SectionTitle title="Когда напоминать" />
        <div className="grid grid-cols-2 gap-3">
          {reminderOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => void updateSettings({ reminder: option.value })}
              className={`rounded-[20px] px-4 py-3 text-sm ${
                settings.reminder === option.value ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]' : 'bg-white/5 text-[var(--tg-text-color)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Тон" />
        <div className="grid grid-cols-3 gap-3">
          {toneOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => void updateSettings({ tone: option.value })}
              className={`rounded-[20px] px-4 py-3 text-sm ${
                settings.tone === option.value ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]' : 'bg-white/5 text-[var(--tg-text-color)]'
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
          checked={settings.modules.expenses}
          onChange={(next) => void updateSettings({ modules: { ...settings.modules, expenses: next } })}
          label="Траты"
        />
        <Toggle
          checked={settings.modules.workouts}
          onChange={(next) => void updateSettings({ modules: { ...settings.modules, workouts: next } })}
          label="Тренировки"
        />
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Настройка" />
        <PrimaryButton onClick={() => setConfirmRerun(true)}>Пройти настройку заново</PrimaryButton>
        {confirmRerun ? (
          <div className="space-y-3 rounded-[20px] bg-white/5 p-4">
            <div className="text-sm text-[var(--tg-text-color)]">Данные останутся, но настройка откроется заново.</div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setConfirmRerun(false)} className="rounded-[18px] border border-white/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">Отмена</button>
              <button type="button" onClick={() => void rerunSetup()} className="rounded-[18px] bg-[var(--tg-button-color)] px-4 py-3 text-sm text-[var(--tg-button-text-color)]">Продолжить</button>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Очистка" />
        <button type="button" onClick={() => setConfirmReset(true)} className="w-full rounded-[20px] border border-red-400/30 px-4 py-3 text-sm font-medium text-red-500">
          Очистить все данные
        </button>
        {confirmReset ? (
          <div className="space-y-3 rounded-[20px] bg-white/5 p-4">
            <div className="text-sm text-[var(--tg-text-color)]">Это удалит все записи и настройку.</div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setConfirmReset(false)} className="rounded-[18px] border border-white/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">Отмена</button>
              <button type="button" onClick={() => void resetAllData()} className="rounded-[18px] bg-red-500 px-4 py-3 text-sm text-white">Удалить</button>
            </div>
          </div>
        ) : null}
      </Card>
    </Screen>
  );
}
