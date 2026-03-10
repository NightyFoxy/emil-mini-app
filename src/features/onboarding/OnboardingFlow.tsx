import { useState } from 'react';

import { Card, PrimaryButton, TextInput } from '@/components/ui';
import { setupAnswersSchema } from '@/lib/profile/schemas';
import type { SetupAnswers } from '@/types/models';
import { chaosOptions, priorityOptions, reminderOptions, startupModuleOptions, toneOptions } from './config';

const initialAnswers: SetupAnswers = {
  displayName: 'Пользователь',
  priority: 'tasks',
  chaosSource: 'too_many_tasks',
  tone: 'calm',
  reminder: 'off',
  startupModule: 'tasks',
  note: '',
};

function QuestionOptions<T extends string>({
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
          className={`min-h-20 w-full rounded-[24px] border px-4 py-4 text-left text-[15px] font-medium ${
            value === option.value
              ? 'border-[var(--tg-button-color)] bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
              : 'border-black/5 bg-white text-[var(--tg-text-color)]'
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
  const [answers, setAnswers] = useState<SetupAnswers>({ ...initialAnswers, displayName });
  const [saving, setSaving] = useState(false);
  const total = 5;

  async function finish() {
    setSaving(true);
    await onComplete(setupAnswersSchema.parse(answers));
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-full bg-white/6 p-1">
        <div className="h-2 rounded-full bg-[var(--tg-button-color)] transition-all" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>

      <Card className="space-y-5 p-5">
        {step === 0 ? (
          <>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Что хочешь наладить в первую очередь?</h1>
            <QuestionOptions value={answers.priority} options={priorityOptions} onChange={(value) => setAnswers((current) => ({ ...current, priority: value }))} />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Где чаще всего начинается хаос?</h1>
            <QuestionOptions value={answers.chaosSource} options={chaosOptions} onChange={(value) => setAnswers((current) => ({ ...current, chaosSource: value }))} />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Какой стиль тебе подходит?</h1>
            <QuestionOptions value={answers.tone} options={toneOptions} onChange={(value) => setAnswers((current) => ({ ...current, tone: value }))} />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Когда напоминать?</h1>
            <QuestionOptions value={answers.reminder} options={reminderOptions} onChange={(value) => setAnswers((current) => ({ ...current, reminder: value }))} />
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">Что включить сразу?</h1>
            <QuestionOptions value={answers.startupModule} options={startupModuleOptions} onChange={(value) => setAnswers((current) => ({ ...current, startupModule: value }))} />
            <TextInput
              value={answers.note}
              onChange={(value) => setAnswers((current) => ({ ...current, note: value }))}
              placeholder="Есть что-то важное, что нужно учитывать?"
              multiline
              maxLength={200}
            />
            <PrimaryButton onClick={() => void finish()} disabled={saving}>Готово</PrimaryButton>
          </>
        ) : null}

        {step < 4 ? (
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep((current) => Math.max(current - 1, 0))} className="flex-1 rounded-[20px] border border-black/8 px-4 py-3 text-sm text-[var(--tg-text-color)]">
              Назад
            </button>
            <PrimaryButton className="flex-1" onClick={() => setStep((current) => Math.min(current + 1, 4))}>
              Дальше
            </PrimaryButton>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
