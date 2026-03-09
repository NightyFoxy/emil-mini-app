import { useMemo, useState } from 'react';

import { Card, PrimaryButton, TextInput } from '@/components/ui';
import { onboardingAnswersSchema } from '@/lib/profile/schemas';
import { requestTelegramWriteAccess } from '@/lib/telegram/env';
import type { OnboardingAnswers } from '@/types/models';
import {
  chaosPatternOptions,
  primaryNeedOptions,
  reminderWindowOptions,
  responseStyleOptions,
  startAreaOptions,
  startupBundleOptions,
  toneStyleOptions,
} from './config';

const screensCount = 8;

const initialAnswers: OnboardingAnswers = {
  displayName: 'Пользователь',
  startArea: 'tasks',
  chaosPattern: 'too_many_tasks',
  primaryNeed: 'daily_plan',
  responseStyle: 'short_list',
  toneStyle: 'calm',
  reminderWindow: 'evening',
  dailyPlanReminderEnabled: true,
  startupBundle: 'today_plan',
  specialPreferences: '',
};

function ProgressBar({ current }: { current: number }) {
  const progress = Math.round(((current + 1) / screensCount) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[var(--tg-hint-color)]">
        <span>Настройка</span>
        <span>{current + 1} / {screensCount}</span>
      </div>
      <div className="rounded-full bg-white/6 p-1">
        <div
          className="h-2 rounded-full bg-[var(--tg-button-color)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function OptionGrid<T extends string>({
  selected,
  options,
  onSelect,
}: {
  selected: T;
  options: Array<{ value: T; label: string }>;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`min-h-24 rounded-[24px] border px-4 py-4 text-left text-[15px] font-medium leading-5 transition active:scale-[0.99] ${
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

function OptionList<T extends string>({
  selected,
  options,
  onSelect,
}: {
  selected: T;
  options: Array<{ value: T; label: string }>;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`min-h-20 w-full rounded-[24px] border px-4 py-4 text-left text-[15px] font-medium leading-5 transition active:scale-[0.99] ${
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
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<OnboardingAnswers>({ ...initialAnswers, displayName });

  const canSkip = useMemo(() => step === 7, [step]);

  function next() {
    setStep((current) => Math.min(current + 1, screensCount - 1));
  }

  function back() {
    setStep((current) => Math.max(current - 1, 0));
  }

  async function finish() {
    const validated = onboardingAnswersSchema.parse({
      ...answers,
      specialPreferences: answers.specialPreferences.trim(),
    });
    setSubmitting(true);
    await onComplete(validated);
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <ProgressBar current={step} />

      <Card className="space-y-5 p-5">
        {step === 0 ? (
          <>
            <div className="space-y-2">
              <h1 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">С чего начнём?</h1>
              <p className="text-sm text-[var(--tg-hint-color)]">Выбери, что хочешь наладить в первую очередь.</p>
            </div>
            <OptionGrid
              selected={answers.startArea}
              options={startAreaOptions}
              onSelect={(value) => setAnswers((current) => ({ ...current, startArea: value }))}
            />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <div className="space-y-2">
              <h1 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Где чаще всего начинается хаос?</h1>
              <p className="text-sm text-[var(--tg-hint-color)]">Это поможет Эмилю быстрее быть полезным.</p>
            </div>
            <OptionList
              selected={answers.chaosPattern}
              options={chaosPatternOptions}
              onSelect={(value) => setAnswers((current) => ({ ...current, chaosPattern: value }))}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="space-y-2">
              <h1 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Что тебе нужнее всего?</h1>
              <p className="text-sm text-[var(--tg-hint-color)]">Выбери главную пользу от Эмиля.</p>
            </div>
            <OptionGrid
              selected={answers.primaryNeed}
              options={primaryNeedOptions}
              onSelect={(value) => setAnswers((current) => ({ ...current, primaryNeed: value }))}
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div className="space-y-2">
              <h1 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Как тебе удобнее получать ответы?</h1>
              <p className="text-sm text-[var(--tg-hint-color)]">Подстроим формат под тебя.</p>
            </div>
            <OptionList
              selected={answers.responseStyle}
              options={responseStyleOptions}
              onSelect={(value) => setAnswers((current) => ({ ...current, responseStyle: value }))}
            />
          </>
        ) : null}

        {step === 4 ? (
          <>
            <div className="space-y-2">
              <h1 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Какой тон тебе подходит?</h1>
              <p className="text-sm text-[var(--tg-hint-color)]">Эмиль будет вести тебя в этом стиле.</p>
            </div>
            <OptionGrid
              selected={answers.toneStyle}
              options={toneStyleOptions}
              onSelect={(value) => setAnswers((current) => ({ ...current, toneStyle: value }))}
            />
          </>
        ) : null}

        {step === 5 ? (
          <>
            <div className="space-y-2">
              <h1 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Когда лучше напоминать?</h1>
              <p className="text-sm text-[var(--tg-hint-color)]">Настроим удобный ритм.</p>
            </div>
            <OptionList
              selected={answers.reminderWindow}
              options={reminderWindowOptions}
              onSelect={(value) => setAnswers((current) => ({ ...current, reminderWindow: value }))}
            />
            <div className="rounded-[24px] border border-white/8 bg-black/8 p-4">
              <div className="text-sm font-medium text-[var(--tg-text-color)]">Включить ежедневное напоминание про план на завтра?</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    if (answers.reminderWindow !== 'on_demand') {
                      await requestTelegramWriteAccess();
                    }
                    setAnswers((current) => ({ ...current, dailyPlanReminderEnabled: true }));
                  }}
                  className={`rounded-[20px] px-4 py-3 text-sm font-medium ${
                    answers.dailyPlanReminderEnabled
                      ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
                      : 'bg-white/6 text-[var(--tg-text-color)]'
                  }`}
                >
                  Да
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers((current) => ({ ...current, dailyPlanReminderEnabled: false }))}
                  className={`rounded-[20px] px-4 py-3 text-sm font-medium ${
                    !answers.dailyPlanReminderEnabled
                      ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
                      : 'bg-white/6 text-[var(--tg-text-color)]'
                  }`}
                >
                  Нет
                </button>
              </div>
            </div>
          </>
        ) : null}

        {step === 6 ? (
          <>
            <div className="space-y-2">
              <h1 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Что включить сразу?</h1>
              <p className="text-sm text-[var(--tg-hint-color)]">Выбери стартовый набор.</p>
            </div>
            <OptionGrid
              selected={answers.startupBundle}
              options={startupBundleOptions}
              onSelect={(value) => setAnswers((current) => ({ ...current, startupBundle: value }))}
            />
          </>
        ) : null}

        {step === 7 ? (
          <>
            <div className="space-y-2">
              <h1 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Есть что-то важное?</h1>
              <p className="text-sm text-[var(--tg-hint-color)]">
                Можно написать, если у тебя есть особые пожелания.
              </p>
            </div>
            <TextInput
              value={answers.specialPreferences}
              onChange={(value) => setAnswers((current) => ({ ...current, specialPreferences: value }))}
              placeholder="Например: не люблю длинные ответы, вечером мало сил, часто забываю бытовые дела"
              multiline
              maxLength={280}
            />
            <PrimaryButton onClick={() => void finish()} disabled={submitting}>
              Завершить
            </PrimaryButton>
          </>
        ) : null}

        {step < 7 ? (
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={back}
              className="flex-1 rounded-[20px] border border-white/8 px-4 py-3 text-sm text-[var(--tg-text-color)]"
            >
              Назад
            </button>
            <PrimaryButton className="flex-1" onClick={next}>
              Дальше
            </PrimaryButton>
          </div>
        ) : null}

        {canSkip ? (
          <button
            type="button"
            onClick={() => void finish()}
            className="text-sm text-[var(--tg-hint-color)]"
          >
            Пропустить
          </button>
        ) : null}
      </Card>
    </div>
  );
}
