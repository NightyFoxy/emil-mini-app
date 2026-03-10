import { useEffect, useMemo, useState } from 'react';

import { useAppStore } from '@/app/store';
import { Card, PrimaryButton, Screen, SectionTitle } from '@/components/ui';

const blockerTexts = {
  too_big: 'Уменьши задачу до действия на 5 минут',
  unclear: 'Сначала зафиксируй, какой результат нужен',
  no_energy: 'Сделай самую короткую версию',
  distracted: 'Оставь один экран и поставь таймер',
} as const;

export function FocusScreen() {
  const entries = useAppStore((state) => state.entries);
  const selectedDate = useAppStore((state) => state.selectedDate);
  const focusedTaskId = useAppStore((state) => state.focusedTaskId);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setFocusedTaskId = useAppStore((state) => state.setFocusedTaskId);

  const tasks = useMemo(
    () => entries.filter((entry) => entry.type === 'task' && !entry.done),
    [entries],
  );
  const task =
    tasks.find((entry) => entry.id === focusedTaskId) ??
    tasks.find((entry) => entry.date === selectedDate) ??
    tasks[0] ??
    null;

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [activeBlocker, setActiveBlocker] = useState<keyof typeof blockerTexts | null>(null);

  useEffect(() => {
    if (task && focusedTaskId !== task.id) {
      setFocusedTaskId(task.id);
    }
  }, [focusedTaskId, setFocusedTaskId, task]);

  useEffect(() => {
    if (!running) {
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  if (!task) {
    return (
      <Screen title="Фокус" subtitle="Одна задача без лишнего шума">
        <Card className="space-y-4">
          <div className="text-sm text-[var(--tg-hint-color)]">Нет задачи для фокуса</div>
          <PrimaryButton onClick={() => setActiveTab('calendar')}>Вернуться в календарь</PrimaryButton>
          <button
            type="button"
            onClick={() => setActiveTab('capture')}
            className="w-full rounded-[20px] border border-white/10 px-4 py-3 text-sm font-medium text-[var(--tg-text-color)]"
          >
            Добавить задачу
          </button>
        </Card>
      </Screen>
    );
  }

  const tinySteps = [
    'Открыть всё, что нужно для задачи',
    task.note || 'Записать первый конкретный шаг',
    'Сделать короткий проход и остановиться',
  ].slice(0, 3);

  return (
    <Screen title="Фокус" subtitle="Сейчас делаем только одну задачу">
      <Card className="space-y-4">
        <div>
          <div className="text-lg font-semibold text-[var(--tg-text-color)]">{task.title}</div>
          <div className="mt-1 text-sm text-[var(--tg-hint-color)]">Следующий шаг: {task.note || 'Начать с самого простого действия'}</div>
        </div>

        <div className="space-y-2">
          {tinySteps.map((step) => (
            <div key={step} className="rounded-[18px] bg-white/5 px-4 py-3 text-sm text-[var(--tg-text-color)]">
              {step}
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Таймер" />
        <div className="text-4xl font-semibold tracking-[-0.05em] text-[var(--tg-text-color)]">
          {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <PrimaryButton onClick={() => setRunning((current) => !current)}>{running ? 'Пауза' : 'Старт'}</PrimaryButton>
          <button
            type="button"
            onClick={() => setSecondsLeft(25 * 60)}
            className="rounded-[20px] border border-white/10 px-4 py-3 text-sm font-medium text-[var(--tg-text-color)]"
          >
            Сброс
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className="rounded-[20px] border border-white/10 px-4 py-3 text-sm font-medium text-[var(--tg-text-color)]"
          >
            Календарь
          </button>
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Что мешает начать?" />
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setActiveBlocker('too_big')} className="rounded-[20px] bg-white/5 px-4 py-3 text-sm text-[var(--tg-text-color)]">Слишком большая</button>
          <button type="button" onClick={() => setActiveBlocker('unclear')} className="rounded-[20px] bg-white/5 px-4 py-3 text-sm text-[var(--tg-text-color)]">Непонятно с чего начать</button>
          <button type="button" onClick={() => setActiveBlocker('no_energy')} className="rounded-[20px] bg-white/5 px-4 py-3 text-sm text-[var(--tg-text-color)]">Нет сил</button>
          <button type="button" onClick={() => setActiveBlocker('distracted')} className="rounded-[20px] bg-white/5 px-4 py-3 text-sm text-[var(--tg-text-color)]">Отвлекаюсь</button>
        </div>
        {activeBlocker ? <div className="rounded-[20px] bg-[var(--tg-button-color)] px-4 py-3 text-sm text-[var(--tg-button-text-color)]">{blockerTexts[activeBlocker]}</div> : null}
      </Card>
    </Screen>
  );
}
