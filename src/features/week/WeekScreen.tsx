import { Card, Screen, SectionTitle } from '@/components/ui';
import { useAppStore } from '@/app/store';

export function WeekScreen() {
  const tasks = useAppStore((state) => state.tasks);
  const weeklyReview = useAppStore((state) => state.weeklyReview);

  const overdue = tasks.filter((task) => task.status === 'todo' && task.urgency === 'high');
  const backlog = tasks.filter((task) => task.bucket === 'backlog');

  return (
    <Screen title="Week" subtitle="Лёгкий weekly reset без декоративности">
      <Card className="space-y-3">
        <SectionTitle title="Приоритеты недели" />
        {weeklyReview.weeklyPriorities.map((item) => (
          <div key={item} className="rounded-[18px] bg-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">
            {item}
          </div>
        ))}
      </Card>

      <Card className="space-y-3">
        <SectionTitle title="Зависшие и просроченные" />
        {overdue.map((task) => (
          <div key={task.id} className="rounded-[18px] bg-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">
            {task.title}
          </div>
        ))}
      </Card>

      <Card className="space-y-3">
        <SectionTitle title="Рутины" />
        {weeklyReview.routines.map((routine) => (
          <div key={routine.id} className="flex items-center justify-between rounded-[18px] bg-black/10 px-4 py-3 text-sm">
            <span className="text-[var(--tg-text-color)]">{routine.title}</span>
            <span className="text-[var(--tg-hint-color)]">{routine.cadence}</span>
          </div>
        ))}
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <Card>
          <SectionTitle title="Что движется" />
          <div className="mt-3 space-y-2">
            {weeklyReview.whatIsMoving.map((item) => (
              <div key={item} className="text-sm text-[var(--tg-text-color)]">
                {item}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Что застряло" />
          <div className="mt-3 space-y-2">
            {weeklyReview.whatIsStuck.map((item) => (
              <div key={item} className="text-sm text-[var(--tg-text-color)]">
                {item}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Что стоит отрезать" />
          <div className="mt-3 space-y-2">
            {weeklyReview.whatShouldBeCut.map((item) => (
              <div key={item} className="text-sm text-[var(--tg-text-color)]">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="space-y-3">
        <SectionTitle title="Backlog overview" />
        {backlog.map((task) => (
          <div key={task.id} className="rounded-[18px] bg-black/10 px-4 py-3 text-sm text-[var(--tg-text-color)]">
            {task.title}
          </div>
        ))}
      </Card>
    </Screen>
  );
}
