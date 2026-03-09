import { useMemo, useState } from 'react';

import { Card, Chip, PrimaryButton, TextInput } from '@/components/ui';
import { onboardingAnswersSchema } from '@/lib/profile/schemas';
import { requestTelegramWriteAccess } from '@/lib/telegram/env';
import type { OnboardingAnswers } from '@/types/models';
import {
  accountabilityOptions,
  blockerOptions,
  chaosSourceOptions,
  dailyCapacityOptions,
  energyPatternOptions,
  outputFormatOptions,
  planningStyleOptions,
} from './config';

const totalSteps = 12;

const initialAnswers: OnboardingAnswers = {
  displayName: 'Пользователь',
  goals: [''],
  chaosSources: [],
  planningStyle: 'day',
  dailyPriorityCapacity: 'three',
  energyPattern: 'morning',
  accountabilityStyle: 'neutral',
  mainBlockers: [],
  preferredOutputFormats: ['short_checklist'],
  reminderEnabled: false,
  reminderTime: '21:30',
  avoidPhrases: '',
  startHelps: '',
};

function MultiSelect<T extends string>({
  selected,
  options,
  onToggle,
}: {
  selected: T[];
  options: Array<{ value: T; label: string }>;
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip key={option.value} selected={selected.includes(option.value)} onClick={() => onToggle(option.value)}>
          {option.label}
        </Chip>
      ))}
    </div>
  );
}

function SingleSelect<T extends string>({
  selected,
  options,
  onSelect,
}: {
  selected: T;
  options: Array<{ value: T; label: string }>;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`flex w-full items-center justify-between rounded-[20px] border px-4 py-3 text-left text-sm transition ${
            selected === option.value
              ? 'border-[var(--tg-button-color)] bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
              : 'border-white/8 bg-black/8 text-[var(--tg-text-color)]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function OnboardingFlow({
  displayName,
  onComplete,
}: {
  displayName: string;
  onComplete: (answers: OnboardingAnswers) => Promise<void>;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({ ...initialAnswers, displayName });
  const [submitting, setSubmitting] = useState(false);

  const progress = useMemo(() => Math.round(((step + 1) / totalSteps) * 100), [step]);

  function setGoal(index: number, value: string) {
    setAnswers((current) => {
      const goals = [...current.goals];
      goals[index] = value;
      return { ...current, goals };
    });
  }

  function toggleArrayValue<K extends keyof OnboardingAnswers>(
    key: K,
    value: OnboardingAnswers[K] extends Array<infer Item> ? Item : never,
  ) {
    setAnswers((current) => {
      const currentValues = current[key] as unknown as string[];
      const nextValues = currentValues.includes(value as string)
        ? currentValues.filter((entry) => entry !== value)
        : [...currentValues, value as string];
      return { ...current, [key]: nextValues };
    });
  }

  function next() {
    setStep((current) => Math.min(current + 1, totalSteps - 1));
  }

  function previous() {
    setStep((current) => Math.max(current - 1, 0));
  }

  async function finish() {
    const sanitized = {
      ...answers,
      goals: answers.goals.map((goal) => goal.trim()).filter(Boolean),
    };
    const validated = onboardingAnswersSchema.parse(sanitized);
    setSubmitting(true);
    await onComplete(validated);
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-full bg-white/5 p-1">
        <div
          className="h-2 rounded-full bg-[var(--tg-button-color)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card className="min-h-[520px] space-y-5">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--tg-hint-color)]">Шаг {step + 1} / 12</div>
          <div className="text-xs text-[var(--tg-hint-color)]">3-5 минут</div>
        </div>

        {step === 0 ? (
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--tg-hint-color)]">
              Эмиль: operational setup
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Контроль без шума</h1>
              <p className="text-sm leading-6 text-[var(--tg-hint-color)]">
                Эмиль адаптируется под ваш рабочий стиль и снижает когнитивную нагрузку. На выходе будет короткий
                операционный профиль и удобная панель дня.
              </p>
            </div>
            <TextInput
              value={answers.displayName}
              onChange={(value) => setAnswers((current) => ({ ...current, displayName: value }))}
              placeholder="Как к вам обращаться"
            />
            <PrimaryButton onClick={next}>Начать</PrimaryButton>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Цели на 30-90 дней</h2>
            <p className="text-sm text-[var(--tg-hint-color)]">До 3 целей. Коротко и предметно.</p>
            {[0, 1, 2].map((index) => (
              <TextInput
                key={index}
                value={answers.goals[index] ?? ''}
                onChange={(value) => setGoal(index, value)}
                placeholder={`Цель ${index + 1}`}
              />
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Где больше всего хаоса</h2>
            <MultiSelect
              selected={answers.chaosSources}
              options={chaosSourceOptions}
              onToggle={(value) => toggleArrayValue('chaosSources', value)}
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Как вы обычно планируете</h2>
            <SingleSelect
              selected={answers.planningStyle}
              options={planningStyleOptions}
              onSelect={(value) => setAnswers((current) => ({ ...current, planningStyle: value }))}
            />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Сколько приоритетов реально держится</h2>
            <SingleSelect
              selected={answers.dailyPriorityCapacity}
              options={dailyCapacityOptions}
              onSelect={(value) => setAnswers((current) => ({ ...current, dailyPriorityCapacity: value }))}
            />
          </div>
        ) : null}

        {step === 5 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Когда у вас лучший ресурс</h2>
            <SingleSelect
              selected={answers.energyPattern}
              options={energyPatternOptions}
              onSelect={(value) => setAnswers((current) => ({ ...current, energyPattern: value }))}
            />
          </div>
        ) : null}

        {step === 6 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Как держать вас в тонусе</h2>
            <SingleSelect
              selected={answers.accountabilityStyle}
              options={accountabilityOptions}
              onSelect={(value) => setAnswers((current) => ({ ...current, accountabilityStyle: value }))}
            />
          </div>
        ) : null}

        {step === 7 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Основные блокеры</h2>
            <MultiSelect
              selected={answers.mainBlockers}
              options={blockerOptions}
              onToggle={(value) => toggleArrayValue('mainBlockers', value)}
            />
          </div>
        ) : null}

        {step === 8 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Предпочтительный формат ответа</h2>
            <MultiSelect
              selected={answers.preferredOutputFormats}
              options={outputFormatOptions}
              onToggle={(value) => toggleArrayValue('preferredOutputFormats', value)}
            />
          </div>
        ) : null}

        {step === 9 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Напоминание спланировать завтра</h2>
            <label className="space-y-2">
              <span className="text-sm text-[var(--tg-hint-color)]">Время</span>
              <input
                type="time"
                value={answers.reminderTime}
                onChange={(event) => setAnswers((current) => ({ ...current, reminderTime: event.target.value }))}
                className="w-full rounded-[20px] border border-white/8 bg-black/8 px-4 py-3 text-sm text-[var(--tg-text-color)]"
              />
            </label>
            <button
              type="button"
              onClick={async () => {
                const granted = await requestTelegramWriteAccess();
                setAnswers((current) => ({ ...current, reminderEnabled: granted || !current.reminderEnabled }));
              }}
              className={`rounded-[20px] border px-4 py-3 text-left text-sm ${
                answers.reminderEnabled
                  ? 'border-[var(--tg-button-color)] bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
                  : 'border-white/8 bg-black/8 text-[var(--tg-text-color)]'
              }`}
            >
              {answers.reminderEnabled ? 'Напоминание включено' : 'Включить напоминание'}
            </button>
          </div>
        ) : null}

        {step === 10 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Фразовые настройки</h2>
            <TextInput
              value={answers.avoidPhrases}
              onChange={(value) => setAnswers((current) => ({ ...current, avoidPhrases: value }))}
              placeholder="Каких фраз лучше избегать?"
              multiline
              maxLength={280}
            />
            <TextInput
              value={answers.startHelps}
              onChange={(value) => setAnswers((current) => ({ ...current, startHelps: value }))}
              placeholder="Что обычно помогает начать?"
              multiline
              maxLength={280}
            />
          </div>
        ) : null}

        {step === 11 ? (
          <div className="space-y-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-[var(--tg-hint-color)]">Review</div>
              <h2 className="text-xl font-semibold text-[var(--tg-text-color)]">Операционный профиль готов</h2>
            </div>
            <div className="space-y-3 rounded-[20px] bg-black/10 p-4 text-sm text-[var(--tg-text-color)]">
              <div>Цели: {answers.goals.filter(Boolean).join(' • ') || 'не указаны'}</div>
              <div>Стиль планирования: {planningStyleOptions.find((item) => item.value === answers.planningStyle)?.label}</div>
              <div>Ёмкость дня: {dailyCapacityOptions.find((item) => item.value === answers.dailyPriorityCapacity)?.label}</div>
              <div>Энергия: {energyPatternOptions.find((item) => item.value === answers.energyPattern)?.label}</div>
              <div>Тон: {accountabilityOptions.find((item) => item.value === answers.accountabilityStyle)?.label}</div>
              <div>Напоминание: {answers.reminderEnabled ? answers.reminderTime : 'выключено'}</div>
            </div>
            <PrimaryButton onClick={() => void finish()} disabled={submitting}>
              Завершить
            </PrimaryButton>
          </div>
        ) : null}

        {step > 0 && step < 11 ? (
          <div className="mt-auto flex gap-3 pt-4">
            <button
              type="button"
              onClick={previous}
              className="flex-1 rounded-[20px] border border-white/8 px-4 py-3 text-sm text-[var(--tg-text-color)]"
            >
              Назад
            </button>
            <PrimaryButton className="flex-1" onClick={next}>
              Далее
            </PrimaryButton>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
