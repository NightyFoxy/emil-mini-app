import { useEffect, useMemo, useState } from 'react';

import { useAppStore } from '@/app/store';
import { Card, PrimaryButton, Screen, SectionTitle } from '@/components/ui';

const blockerHelp = {
  too_big: 'Сократи задачу до действия на 5 минут',
  unclear: 'Сначала зафиксируй, какой результат нужен',
  no_energy: 'Сделай самую короткую версию',
  distracted: 'Оставь один экран и включи таймер',
} as const;

export function FocusScreen() {
  const plannerItems = useAppStore((state) => state.plannerItems);
  const selectedDate = useAppStore((state) => state.selectedDate);
  const focusedTaskId = useAppStore((state) => state.focusedTaskId);
  const closeOverlay = useAppStore((state) => state.closeOverlay);
  const openOverlay = useAppStore((state) => state.openOverlay);
  const openFocusForTask = useAppStore((state) => state.openFocusForTask);
  const task = useMemo(
    () =>
      plannerItems.find((item) => item.type === 'task' && item.id === focusedTaskId && item.status !== 'done') ??
      plannerItems.find((item) => item.type === 'task' && item.date === selectedDate && item.status !== 'done') ??
      plannerItems.find((item) => item.type === 'task' && item.status !== 'done') ??
      null,
    [focusedTaskId, plannerItems, selectedDate],
  );
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [activeBlocker, setActiveBlocker] = useState<keyof typeof blockerHelp | null>(null);

  useEffect(() => {
    if (task && focusedTaskId !== task.id) {
      openFocusForTask(task.id);
    }
  }, [focusedTaskId, openFocusForTask, task]);

  useEffect(() => {
    if (!running) {
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  if (!task) {
    return (
      <Screen title="Фокус" subtitle="Одна задача на сейчас">
        <Card className="space-y-4">
          <div className="text-sm text-[var(--tg-hint-color)]">Нет задачи для фокуса</div>
          <PrimaryButton onClick={closeOverlay}>Вернуться в календарь</PrimaryButton>
          <button type="button" onClick={() => openOverlay('capture')} className="w-full rounded-[20px] border border-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">
            Добавить задачу
          </button>
        </Card>
      </Screen>
    );
  }

  const microSteps = [
    'Открыть всё нужное для задачи',
    task.note || 'Записать первый конкретный шаг',
    'Сделать короткий проход и остановиться',
  ].slice(0, 3);

  return (
    <Screen title="Фокус" subtitle="Сейчас делаем одну задачу">
      <Card className="space-y-4">
        <div className="text-lg font-semibold text-[var(--tg-text-color)]">{task.title}</div>
        <div className="text-sm text-[var(--tg-hint-color)]">Следующий шаг: {task.note || 'Начни с самого простого действия'}</div>
        <div className="space-y-2">
          {microSteps.map((step) => (
            <div key={step} className="rounded-[18px] bg-white px-4 py-3 text-sm text-[var(--tg-text-color)]">
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
          <button type="button" onClick={() => setSecondsLeft(25 * 60)} className="rounded-[20px] border border-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">
            Сброс
          </button>
          <button type="button" onClick={closeOverlay} className="rounded-[20px] border border-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">
            Назад
          </button>
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Что мешает начать?" />
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setActiveBlocker('too_big')} className="rounded-[18px] bg-white px-4 py-3 text-sm text-[var(--tg-text-color)]">Слишком большая</button>
          <button type="button" onClick={() => setActiveBlocker('unclear')} className="rounded-[18px] bg-white px-4 py-3 text-sm text-[var(--tg-text-color)]">Непонятно с чего начать</button>
          <button type="button" onClick={() => setActiveBlocker('no_energy')} className="rounded-[18px] bg-white px-4 py-3 text-sm text-[var(--tg-text-color)]">Нет сил</button>
          <button type="button" onClick={() => setActiveBlocker('distracted')} className="rounded-[18px] bg-white px-4 py-3 text-sm text-[var(--tg-text-color)]">Отвлекаюсь</button>
        </div>
        {activeBlocker ? <div className="rounded-[20px] bg-[var(--tg-button-color)] px-4 py-3 text-sm text-[var(--tg-button-text-color)]">{blockerHelp[activeBlocker]}</div> : null}
      </Card>
    </Screen>
  );
}
