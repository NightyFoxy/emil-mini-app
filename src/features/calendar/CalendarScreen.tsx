import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
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

function streakCount(dates: string[]) {
  const unique = Array.from(new Set(dates)).sort().reverse();
  let current = new Date();
  let streak = 0;
  for (const date of unique) {
    const compare = current.toISOString().slice(0, 10);
    if (date === compare) {
      streak += 1;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function CalendarScreen() {
  const plannerItems = useAppStore((state) => state.plannerItems);
  const dailyCheckins = useAppStore((state) => state.dailyCheckins);
  const reminderSettings = useAppStore((state) => state.reminderSettings);
  const selectedDate = useAppStore((state) => state.selectedDate);
  const setSelectedDate = useAppStore((state) => state.setSelectedDate);
  const openOverlay = useAppStore((state) => state.openOverlay);
  const openFocusForTask = useAppStore((state) => state.openFocusForTask);
  const markTaskDone = useAppStore((state) => state.markTaskDone);
  const moveTaskToNextDay = useAppStore((state) => state.moveTaskToNextDay);
  const answerCheckin = useAppStore((state) => state.answerCheckin);

  const selected = parseISO(selectedDate);
  const days = buildMonthDays(selectedDate);
  const selectedItems = plannerItems.filter((item) => item.date === selectedDate);
  const tasks = selectedItems.filter((item) => item.type === 'task');
  const events = selectedItems.filter((item) => item.type === 'event');
  const expenses = selectedItems.filter((item) => item.type === 'expense');
  const workouts = selectedItems.filter((item) => item.type === 'workout');
  const notes = selectedItems.filter((item) => item.type === 'note');
  const todayCheckins = dailyCheckins.filter((item) => item.date === selectedDate);
  const rhythm = streakCount(dailyCheckins.filter((item) => item.completed).map((item) => item.date));
  const lastCheckin = todayCheckins[0];

  return (
    <Screen title="Календарь" subtitle={format(selected, 'LLLL yyyy', { locale: ru })}>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => openOverlay('settings')}
          className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[var(--tg-text-color)]"
        >
          Настройки
        </button>
      </div>

      <Card className="space-y-4">
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-[var(--tg-hint-color)]">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const items = plannerItems.filter((entry) => entry.date === key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => void setSelectedDate(key)}
                className={`rounded-[18px] px-2 py-3 text-sm transition ${
                  isSameDay(day, selected)
                    ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
                    : isToday(day)
                      ? 'border border-[var(--tg-button-color)] bg-white text-[var(--tg-text-color)]'
                      : 'bg-white text-[var(--tg-text-color)]'
                } ${isSameMonth(day, selected) ? '' : 'opacity-35'}`}
              >
                <div>{format(day, 'd')}</div>
                <div className="mt-2 flex justify-center gap-1">
                  {items.some((entry) => entry.type === 'task' || entry.type === 'event') ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> : null}
                  {items.some((entry) => entry.type === 'expense') ? <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> : null}
                  {items.some((entry) => entry.type === 'workout') ? <span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> : null}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Ритм дня" />
        <div className="flex items-center justify-between rounded-[20px] bg-white/80 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-[var(--tg-text-color)]">Ритм: {rhythm} дн.</div>
            <div className="text-xs text-[var(--tg-hint-color)]">
              {lastCheckin?.completed ? 'Сегодня отметка уже есть' : 'Сегодня ещё нет отметки'}
            </div>
          </div>
          <div className="text-right text-xs text-[var(--tg-hint-color)]">Следующее напоминание: {reminderSettings.reminder === 'off' ? 'выкл.' : reminderSettings.reminder}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => void answerCheckin('done')} className="rounded-[18px] bg-white px-4 py-3 text-sm text-[var(--tg-text-color)]">Сделано</button>
          <button type="button" onClick={() => void answerCheckin('move')} className="rounded-[18px] bg-white px-4 py-3 text-sm text-[var(--tg-text-color)]">Перенести</button>
          <button type="button" onClick={() => void answerCheckin('later')} className="rounded-[18px] bg-white px-4 py-3 text-sm text-[var(--tg-text-color)]">Позже</button>
          <button type="button" onClick={() => void answerCheckin('help')} className="rounded-[18px] bg-white px-4 py-3 text-sm text-[var(--tg-text-color)]">Нужна помощь</button>
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title={format(selected, 'd MMMM, EEEE', { locale: ru })} />

        {selectedItems.length === 0 ? <div className="text-sm text-[var(--tg-hint-color)]">На этот день пока ничего нет</div> : null}

        {tasks.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm font-medium text-[var(--tg-text-color)]">Задачи</div>
            {tasks.map((item) => (
              <div key={item.id} className="rounded-[20px] bg-white px-4 py-4">
                <div className="text-sm font-medium text-[var(--tg-text-color)]">{item.title}</div>
                {item.note ? <div className="mt-1 text-xs text-[var(--tg-hint-color)]">{item.note}</div> : null}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => void markTaskDone(item.id)} className="rounded-[16px] bg-[var(--tg-button-color)] px-3 py-2 text-xs text-[var(--tg-button-text-color)]">Сделано</button>
                  <button type="button" onClick={() => openFocusForTask(item.id)} className="rounded-[16px] border border-black/10 px-3 py-2 text-xs text-[var(--tg-text-color)]">В фокус</button>
                  <button type="button" onClick={() => void moveTaskToNextDay(item.id)} className="rounded-[16px] border border-black/10 px-3 py-2 text-xs text-[var(--tg-text-color)]">Перенести</button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {events.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm font-medium text-[var(--tg-text-color)]">События</div>
            {events.map((item) => (
              <div key={item.id} className="rounded-[20px] bg-white px-4 py-4 text-sm text-[var(--tg-text-color)]">
                {item.title} {item.time ? `· ${item.time}` : ''}
              </div>
            ))}
          </div>
        ) : null}

        {expenses.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm font-medium text-[var(--tg-text-color)]">Траты</div>
            {expenses.map((item) => (
              <div key={item.id} className="rounded-[20px] bg-white px-4 py-4 text-sm text-[var(--tg-text-color)]">
                {item.title} · {item.amount?.toLocaleString('ru-RU')} ₽
              </div>
            ))}
          </div>
        ) : null}

        {workouts.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm font-medium text-[var(--tg-text-color)]">Тренировки</div>
            {workouts.map((item) => (
              <div key={item.id} className="rounded-[20px] bg-white px-4 py-4 text-sm text-[var(--tg-text-color)]">
                {item.title} {item.duration ? `· ${item.duration} мин` : ''}
              </div>
            ))}
          </div>
        ) : null}

        {notes.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm font-medium text-[var(--tg-text-color)]">Заметки</div>
            {notes.map((item) => (
              <div key={item.id} className="rounded-[20px] bg-white px-4 py-4 text-sm text-[var(--tg-text-color)]">
                {item.title}
              </div>
            ))}
          </div>
        ) : null}

        <PrimaryButton onClick={() => openOverlay('capture')}>Добавить на этот день</PrimaryButton>
      </Card>
    </Screen>
  );
}
