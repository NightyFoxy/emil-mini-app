import { useEffect, useMemo, useState } from 'react';

import { Card, Chip, PrimaryButton, Screen, SectionTitle, TextInput } from '@/components/ui';
import { useAppStore } from '@/app/store';

const blockerInterventions: Record<string, { title: string; body: string }> = {
  too_big: {
    title: 'Слишком большая',
    body: 'Снизьте масштаб до шага на 5-10 минут. Формула: открыть, найти, выписать, отправить.',
  },
  unclear: {
    title: 'Непонятно с чего начать',
    body: 'Зафиксируйте результат в одном предложении и выберите первый физический шаг без абстракций.',
  },
  fatigue: {
    title: 'Нет сил',
    body: 'Сделайте минимальную версию. Цель: не завершить всё, а сдвинуть задачу без перегруза.',
  },
  distractions: {
    title: 'Отвлекаюсь',
    body: 'Оставьте один экран, выключите лишние входящие и поставьте таймер на 10-25 минут.',
  },
};

export function FocusScreen() {
  const tasks = useAppStore((state) => state.tasks.filter((task) => task.status === 'todo'));
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id ?? '');
  const [customStep, setCustomStep] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? tasks[0];
  const nextSteps = useMemo(() => {
    if (!selectedTask) {
      return [];
    }

    return [
      `Открыть контекст задачи: ${selectedTask.title}`,
      selectedTask.nextAction ?? 'Сформулировать конкретный следующий шаг',
      customStep || 'Сделать один короткий проход и зафиксировать результат',
    ];
  }, [customStep, selectedTask]);

  return (
    <Screen title="Focus" subtitle="Один объект внимания, короткий таймер, спасение от стопора">
      <Card className="space-y-4">
        <SectionTitle title="Выберите задачу" />
        <div className="space-y-2">
          {tasks.slice(0, 5).map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => setSelectedTaskId(task.id)}
              className={`w-full rounded-[20px] border px-4 py-3 text-left text-sm ${
                selectedTaskId === task.id
                  ? 'border-[var(--tg-button-color)] bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
                  : 'border-white/8 bg-black/8 text-[var(--tg-text-color)]'
              }`}
            >
              {task.title}
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Очень маленькие шаги" />
        <TextInput
          value={customStep}
          onChange={setCustomStep}
          placeholder="Добавить свой микро-шаг"
        />
        <div className="space-y-2">
          {nextSteps.map((step, index) => (
            <div key={step} className="rounded-[18px] bg-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">
              {index + 1}. {step}
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Фокус-таймер" />
        <div className="text-4xl font-semibold tracking-[-0.05em] text-[var(--tg-text-color)]">
          {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
        </div>
        <div className="flex gap-2">
          <PrimaryButton className="flex-1" onClick={() => setRunning((current) => !current)}>
            {running ? 'Пауза' : 'Старт 25 мин'}
          </PrimaryButton>
          <button
            type="button"
            onClick={() => {
              setSecondsLeft(25 * 60);
              setRunning(false);
            }}
            className="rounded-[20px] border border-white/8 px-4 py-3 text-sm text-[var(--tg-text-color)]"
          >
            Сброс
          </button>
        </div>
      </Card>

      <div className="space-y-3">
        <SectionTitle title="Rescue cards" />
        {Object.entries(blockerInterventions).map(([key, card]) => (
          <Card key={key}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-[var(--tg-text-color)]">{card.title}</div>
              <Chip>{key}</Chip>
            </div>
            <p className="mt-2 text-sm text-[var(--tg-hint-color)]">{card.body}</p>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
