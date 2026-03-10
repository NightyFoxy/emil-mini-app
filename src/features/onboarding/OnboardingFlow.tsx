import { useState } from 'react';

import { Card, PrimaryButton, TextInput } from '@/components/ui';
import { setupAnswersSchema } from '@/lib/profile/schemas';
import type { SetupAnswers } from '@/types/models';
import {
  chaosOptions,
  helpFormatOptions,
  priorityOptions,
  reminderOptions,
  startupModuleOptions,
  toneOptions,
} from './config';

const totalScreens = 7;

const initialAnswers: SetupAnswers = {
  displayName: 'Пользователь',
  priority: 'tasks',
  chaosSource: 'too_many_tasks',
  helpFormat: 'short_list',
  tone: 'calm',
  reminder: 'off',
  startupModule: 'tasks',
  note: '',
};

function OptionButtons<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (next: T) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`min-h-20 w-full rounded-[24px] border px-4 py-4 text-left text-[15px] font-medium transition ${
            value === option.value
              ? 'border-[var(--tg-button-color)] bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
              : 'border-white/8 bg-white/5 text-[var(--tg-text-color)]'
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
  onComplete: (answers: SetupAnswers) => Promise<void>;
}) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<SetupAnswers>({ ...initialAnswers, displayName });

  const progress = Math.round(((step + 1) / totalScreens) * 100);

  async function finish() {
    setSubmitting(true);
    await onComplete(setupAnswersSchema.parse(answers));
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[var(--tg-hint-color)]">
          <span>Настройка</span>
          <span>{step + 1} / {totalScreens}</span>
        </div>
        <div className="rounded-full bg-white/6 p-1">
          <div className="h-2 rounded-full bg-[var(--tg-button-color)] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card className="space-y-5 p-5">
        {step === 0 ? (
          <>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">
              Что хочешь наладить в первую очередь?
            </h1>
            <OptionButtons
              value={answers.priority}
              options={priorityOptions}
              onChange={(value) => setAnswers((current) => ({ ...current, priority: value }))}
            />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">
              Где чаще всего начинается хаос?
            </h1>
            <OptionButtons
              value={answers.chaosSource}
              options={chaosOptions}
              onChange={(value) => setAnswers((current) => ({ ...current, chaosSource: value }))}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">
              Как тебе удобнее получать помощь?
            </h1>
            <OptionButtons
              value={answers.helpFormat}
              options={helpFormatOptions}
              onChange={(value) => setAnswers((current) => ({ ...current, helpFormat: value }))}
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">
              Какой тон тебе подходит?
            </h1>
            <OptionButtons
              value={answers.tone}
              options={toneOptions}
              onChange={(value) => setAnswers((current) => ({ ...current, tone: value }))}
            />
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">
              Когда лучше напоминать?
            </h1>
            <OptionButtons
              value={answers.reminder}
              options={reminderOptions}
              onChange={(value) => setAnswers((current) => ({ ...current, reminder: value }))}
            />
          </>
        ) : null}

        {step === 5 ? (
          <>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">
              Что включить сразу?
            </h1>
            <OptionButtons
              value={answers.startupModule}
              options={startupModuleOptions}
              onChange={(value) => setAnswers((current) => ({ ...current, startupModule: value }))}
            />
          </>
        ) : null}

        {step === 6 ? (
          <>
            <div className="space-y-2">
              <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">
                Есть что-то важное, что стоит учитывать?
              </h1>
              <p className="text-sm text-[var(--tg-hint-color)]">Можно пропустить.</p>
            </div>
            <TextInput
              value={answers.note}
              onChange={(value) => setAnswers((current) => ({ ...current, note: value }))}
              placeholder="Например: вечером мало сил"
              multiline
              maxLength={240}
            />
            <PrimaryButton onClick={() => void finish()} disabled={submitting}>
              Завершить
            </PrimaryButton>
          </>
        ) : null}

        {step < 6 ? (
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
              className="flex-1 rounded-[20px] border border-white/8 px-4 py-3 text-sm text-[var(--tg-text-color)]"
            >
              Назад
            </button>
            <PrimaryButton className="flex-1" onClick={() => setStep((current) => Math.min(current + 1, 6))}>
              Дальше
            </PrimaryButton>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => void finish()}
            className="text-sm text-[var(--tg-hint-color)]"
          >
            Пропустить
          </button>
        )}
      </Card>
    </div>
  );
}
