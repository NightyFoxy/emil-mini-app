import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Card, Chip, PrimaryButton, Screen, SectionTitle, SegmentedControl } from '@/components/ui';
import { useAppStore } from '@/app/store';
import type { EnergyPattern, TaskItem, TodayMode } from '@/types/models';

const energyOptions: Array<{ value: EnergyPattern; label: string }> = [
  { value: 'morning', label: 'Утро' },
  { value: 'daytime', label: 'День' },
  { value: 'evening', label: 'Вечер' },
  { value: 'unstable', label: 'Нестабильно' },
];

const modeOptions: Array<{ value: TodayMode; label: string }> = [
  { value: 'overloaded', label: 'Перегруз' },
  { value: 'normal', label: 'Норма' },
  { value: 'focused', label: 'Фокус' },
];

function TaskCard({
  task,
  reorderable = false,
}: {
  task: TaskItem;
  reorderable?: boolean;
}) {
  const toggleTaskDone = useAppStore((state) => state.toggleTaskDone);
  const movePriorityTask = useAppStore((state) => state.movePriorityTask);

  return (
    <Card className={task.status === 'done' ? 'opacity-60' : ''}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => void toggleTaskDone(task.id)}
          className={`mt-1 h-6 w-6 rounded-full border ${
            task.status === 'done' ? 'border-emerald-400 bg-emerald-400' : 'border-white/15'
          }`}
          aria-label="mark done"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-[var(--tg-text-color)]">{task.title}</h3>
            <Chip selected={task.urgency === 'high'}>{task.urgency}</Chip>
          </div>
          {task.nextAction ? <p className="text-xs text-[var(--tg-hint-color)]">Следующий шаг: {task.nextAction}</p> : null}
        </div>
      </div>
      {reorderable ? (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => void movePriorityTask(task.id, 'up')}
            className="rounded-full border border-white/8 px-3 py-1 text-xs text-[var(--tg-hint-color)]"
          >
            Выше
          </button>
          <button
            type="button"
            onClick={() => void movePriorityTask(task.id, 'down')}
            className="rounded-full border border-white/8 px-3 py-1 text-xs text-[var(--tg-hint-color)]"
          >
            Ниже
          </button>
        </div>
      ) : null}
    </Card>
  );
}

export function TodayScreen() {
  const profile = useAppStore((state) => state.profile);
  const tasks = useAppStore((state) => state.tasks);
  const todayMode = useAppStore((state) => state.todayMode);
  const todayEnergy = useAppStore((state) => state.todayEnergy);
  const setTodayMode = useAppStore((state) => state.setTodayMode);
  const setTodayEnergy = useAppStore((state) => state.setTodayEnergy);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  const priorities = tasks.filter((task) => task.bucket === 'priority');
  const secondary = tasks.filter((task) => task.bucket === 'secondary' && task.status !== 'done');

  return (
    <Screen
      title={`Сегодня, ${format(new Date(), 'd MMMM', { locale: ru })}`}
      subtitle={profile ? `${profile.displayName}, контроль через короткие решения` : 'Панель дня'}
    >
      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-[var(--tg-hint-color)]">Today mode</div>
            <div className="mt-1 text-lg font-semibold text-[var(--tg-text-color)]">Режим дня</div>
          </div>
          <div className="rounded-full bg-white/6 px-3 py-1 text-xs text-[var(--tg-hint-color)]">{todayMode}</div>
        </div>
        <SegmentedControl value={todayMode} options={modeOptions} onChange={setTodayMode} />
        <div className="space-y-2">
          <div className="text-sm text-[var(--tg-hint-color)]">Ресурс на сегодня</div>
          <div className="flex flex-wrap gap-2">
            {energyOptions.map((option) => (
              <Chip
                key={option.value}
                selected={todayEnergy === option.value}
                onClick={() => setTodayEnergy(option.value)}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <SectionTitle title="Быстрые действия" />
        <div className="grid grid-cols-3 gap-2">
          <PrimaryButton className="py-2 text-xs" onClick={() => setActiveTab('inbox')}>
            Добавить
          </PrimaryButton>
          <PrimaryButton className="py-2 text-xs" onClick={() => setActiveTab('focus')}>
            Фокус
          </PrimaryButton>
          <PrimaryButton className="py-2 text-xs" onClick={() => setActiveTab('week')}>
            Завтра
          </PrimaryButton>
        </div>
      </Card>

      <div className="space-y-3">
        <SectionTitle title="Топ-3 приоритета" />
        {priorities.map((task) => (
          <TaskCard key={task.id} task={task} reorderable />
        ))}
      </div>

      <div className="space-y-3">
        <SectionTitle title="Второй контур" />
        {secondary.length > 0 ? secondary.map((task) => <TaskCard key={task.id} task={task} />) : <Card>Пусто</Card>}
      </div>
    </Screen>
  );
}
