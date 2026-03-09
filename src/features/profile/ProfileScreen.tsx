import { useState } from 'react';

import { Card, PrimaryButton, Screen, SectionTitle, TextInput, Toggle } from '@/components/ui';
import { useAppStore } from '@/app/store';

export function ProfileScreen() {
  const profile = useAppStore((state) => state.profile);
  const answers = useAppStore((state) => state.onboardingAnswers);
  const updateProfileNotes = useAppStore((state) => state.updateProfileNotes);
  const requestDemoReset = useAppStore((state) => state.requestDemoReset);
  const storageKind = useAppStore((state) => state.storageKind);

  const [specialPreferences, setSpecialPreferences] = useState(answers?.specialPreferences ?? '');
  const [copied, setCopied] = useState('');

  if (!profile || !answers) {
    return (
      <Screen title="Profile" subtitle="Профиль будет доступен после онбординга">
        <Card>Нет данных профиля.</Card>
      </Screen>
    );
  }

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
  }

  return (
    <Screen title="Profile" subtitle={`Storage: ${storageKind}`}>
      <Card className="space-y-3">
        <SectionTitle title="Операционный профиль" />
        <div className="space-y-2 text-sm text-[var(--tg-text-color)]">
          <div>Версия: {profile.profileVersion}</div>
          <div>С чего начали: {profile.startArea}</div>
          <div>Главный запрос: {profile.primaryNeed}</div>
          <div>Формат ответов: {profile.responseStyle}</div>
          <div>Тон: {profile.toneStyle}</div>
          <div>Напоминания: {profile.dailyPlanReminderEnabled ? profile.reminderWindow : 'выключены'}</div>
          <div>Первый экран: {profile.firstScreen}</div>
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Особые пожелания" />
        <TextInput
          value={specialPreferences}
          onChange={setSpecialPreferences}
          placeholder="Например: вечером мало сил, не люблю длинные ответы"
          multiline
        />
        <PrimaryButton
          onClick={() => {
            void updateProfileNotes({ specialPreferences });
          }}
        >
          Сохранить
        </PrimaryButton>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Практические теги" />
        <div className="space-y-2">
          {profile.practicalTags.map((tag) => (
            <div key={tag} className="rounded-[18px] bg-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">
              {tag}
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Assistant rules" />
        <div className="space-y-2">
          {profile.assistantRules.map((rule) => (
            <div key={rule} className="rounded-[18px] bg-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">
              {rule}
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Export" />
        <PrimaryButton onClick={() => void copy(JSON.stringify(profile, null, 2), 'json')}>
          {copied === 'json' ? 'JSON скопирован' : 'Копировать profile JSON'}
        </PrimaryButton>
        <PrimaryButton onClick={() => void copy(profile.llmProfileSummary, 'summary')}>
          {copied === 'summary' ? 'Summary скопирован' : 'Копировать LLM summary'}
        </PrimaryButton>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Debug" />
        <Toggle
          checked={profile.dailyPlanReminderEnabled}
          onChange={() => undefined}
          label="Напоминание активно"
          description="Состояние берётся из текущего профиля."
        />
        <button
          type="button"
          onClick={() => void requestDemoReset()}
          className="w-full rounded-[20px] border border-white/8 px-4 py-3 text-sm text-[var(--tg-text-color)]"
        >
          Сбросить в demo-state
        </button>
      </Card>
    </Screen>
  );
}
