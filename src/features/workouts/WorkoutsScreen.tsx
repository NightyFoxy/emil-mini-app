import { Card, PrimaryButton, Screen, SectionTitle } from '@/components/ui';
import { useAppStore } from '@/app/store';

export function WorkoutsScreen() {
  const workouts = useAppStore((state) => state.workouts);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  return (
    <Screen title="Тренировки" subtitle="Короткий стартовый экран для ритма активности">
      <Card className="space-y-3">
        <SectionTitle title="План" />
        {workouts.map((workout) => (
          <div key={workout.id} className="flex items-center justify-between rounded-[18px] bg-black/10 px-4 py-3 text-sm">
            <div>
              <div className="text-[var(--tg-text-color)]">{workout.title}</div>
              <div className="text-[var(--tg-hint-color)]">{workout.focus}</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-[var(--tg-text-color)]">{workout.durationMinutes} мин</div>
              <div className="text-[var(--tg-hint-color)]">{workout.status}</div>
            </div>
          </div>
        ))}
      </Card>

      <PrimaryButton onClick={() => setActiveTab('today')}>Перейти к плану дня</PrimaryButton>
    </Screen>
  );
}
