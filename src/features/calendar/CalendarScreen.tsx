import { addDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, parseISO, startOfMonth, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

import { useAppStore } from '@/app/store';
import { Card, PrimaryButton, Screen, SectionTitle } from '@/components/ui';

function buildMonthDays(selectedDate: string) {
  const selected = parseISO(selectedDate);
  const start = startOfWeek(startOfMonth(selected), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(selected), { weekStartsOn: 1 });
  const days = [];
  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }
  return days;
}

export function CalendarScreen() {
  const entries = useAppStore((state) => state.entries);
  const selectedDate = useAppStore((state) => state.selectedDate);
  const setSelectedDate = useAppStore((state) => state.setSelectedDate);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setFocusedTaskId = useAppStore((state) => state.setFocusedTaskId);
  const settings = useAppStore((state) => state.settings);

  const days = buildMonthDays(selectedDate);
  const selectedDayEntries = entries.filter((entry) => entry.date === selectedDate);
  const selectedTasks = selectedDayEntries.filter((entry) => entry.type === 'task');
  const selectedExpenses = selectedDayEntries.filter((entry) => entry.type === 'expense');
  const selectedWorkouts = selectedDayEntries.filter((entry) => entry.type === 'workout');

  return (
    <Screen title="Календарь" subtitle={format(parseISO(selectedDate), 'LLLL yyyy', { locale: ru })}>
      <Card className="space-y-4">
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-[var(--tg-hint-color)]">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const items = entries.filter((entry) => entry.date === key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDate(key)}
                className={`rounded-[18px] px-2 py-3 text-sm transition ${
                  isSameDay(day, parseISO(selectedDate))
                    ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
                    : isToday(day)
                      ? 'border border-[var(--tg-button-color)] text-[var(--tg-text-color)]'
                      : 'text-[var(--tg-text-color)]'
                } ${isSameMonth(day, parseISO(selectedDate)) ? '' : 'opacity-35'}`}
              >
                <div>{format(day, 'd')}</div>
                <div className="mt-2 flex justify-center gap-1">
                  {items.some((entry) => entry.type === 'task') ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> : null}
                  {items.some((entry) => entry.type === 'expense') ? <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> : null}
                  {items.some((entry) => entry.type === 'workout') ? <span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> : null}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title={format(parseISO(selectedDate), 'd MMMM, EEEE', { locale: ru })} />

        {selectedDayEntries.length === 0 ? (
          <div className="text-sm text-[var(--tg-hint-color)]">На этот день пока ничего нет</div>
        ) : (
          <div className="space-y-4">
            {selectedTasks.length > 0 ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-[var(--tg-text-color)]">Задачи</div>
                {selectedTasks.map((entry) => (
                  <div key={entry.id} className="rounded-[18px] bg-white/5 px-4 py-3 text-sm text-[var(--tg-text-color)]">
                    {entry.title}
                  </div>
                ))}
              </div>
            ) : null}

            {settings.modules.expenses && selectedExpenses.length > 0 ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-[var(--tg-text-color)]">Траты</div>
                {selectedExpenses.map((entry) => (
                  <div key={entry.id} className="rounded-[18px] bg-white/5 px-4 py-3 text-sm text-[var(--tg-text-color)]">
                    {entry.title} · {entry.amount.toLocaleString('ru-RU')} ₽
                  </div>
                ))}
              </div>
            ) : null}

            {settings.modules.workouts && selectedWorkouts.length > 0 ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-[var(--tg-text-color)]">Тренировка</div>
                {selectedWorkouts.map((entry) => (
                  <div key={entry.id} className="rounded-[18px] bg-white/5 px-4 py-3 text-sm text-[var(--tg-text-color)]">
                    {entry.title} · {entry.durationMinutes} мин
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        <PrimaryButton onClick={() => setActiveTab('capture')}>Добавить на этот день</PrimaryButton>
        {selectedTasks.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setFocusedTaskId(selectedTasks[0].id);
              setActiveTab('focus');
            }}
            className="w-full rounded-[20px] border border-white/10 px-4 py-3 text-sm font-medium text-[var(--tg-text-color)]"
          >
            В фокус
          </button>
        ) : null}
      </Card>
    </Screen>
  );
}
