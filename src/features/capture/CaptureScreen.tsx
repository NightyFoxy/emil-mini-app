import { useState } from 'react';

import { useAppStore } from '@/app/store';
import { Card, PrimaryButton, Screen, TextInput } from '@/components/ui';
import type { PlannerItemType } from '@/types/models';

const typeOptions: Array<{ value: PlannerItemType; label: string }> = [
  { value: 'task', label: 'Задача' },
  { value: 'event', label: 'Событие' },
  { value: 'expense', label: 'Трата' },
  { value: 'workout', label: 'Тренировка' },
];

export function CaptureScreen() {
  const selectedDate = useAppStore((state) => state.selectedDate);
  const setSelectedDate = useAppStore((state) => state.setSelectedDate);
  const addPlannerItem = useAppStore((state) => state.addPlannerItem);
  const [type, setType] = useState<PlannerItemType>('task');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Еда');
  const [duration, setDuration] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  return (
    <Screen title="Добавить" subtitle="Быстрое добавление в общий план">
      <Card className="space-y-4">
        <div className="flex gap-2">
          <button type="button" onClick={() => void setSelectedDate(today)} className="rounded-full bg-white px-4 py-2 text-sm text-[var(--tg-text-color)]">Сегодня</button>
          <button type="button" onClick={() => void setSelectedDate(tomorrow)} className="rounded-full bg-white px-4 py-2 text-sm text-[var(--tg-text-color)]">Завтра</button>
          <input type="date" value={selectedDate} onChange={(event) => void setSelectedDate(event.target.value)} className="min-w-0 flex-1 rounded-full bg-white px-4 py-2 text-sm text-[var(--tg-text-color)]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              className={`rounded-[20px] px-4 py-4 text-sm font-medium ${
                type === option.value ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]' : 'bg-white text-[var(--tg-text-color)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {type === 'task' ? (
          <div className="space-y-3">
            <TextInput value={title} onChange={setTitle} placeholder="Название задачи" />
            <input type="time" value={time} onChange={(event) => setTime(event.target.value)} className="w-full rounded-[20px] bg-white px-4 py-3 text-sm text-[var(--tg-text-color)]" />
            <TextInput value={note} onChange={setNote} placeholder="Заметка" multiline />
          </div>
        ) : null}

        {type === 'event' ? (
          <div className="space-y-3">
            <TextInput value={title} onChange={setTitle} placeholder="Название события" />
            <input type="time" value={time} onChange={(event) => setTime(event.target.value)} className="w-full rounded-[20px] bg-white px-4 py-3 text-sm text-[var(--tg-text-color)]" />
            <TextInput value={note} onChange={setNote} placeholder="Заметка" multiline />
          </div>
        ) : null}

        {type === 'expense' ? (
          <div className="space-y-3">
            <TextInput value={amount} onChange={setAmount} placeholder="Сумма" />
            <TextInput value={category} onChange={setCategory} placeholder="Категория" />
            <TextInput value={note} onChange={setNote} placeholder="Комментарий" multiline />
          </div>
        ) : null}

        {type === 'workout' ? (
          <div className="space-y-3">
            <TextInput value={title} onChange={setTitle} placeholder="Название тренировки" />
            <TextInput value={duration} onChange={setDuration} placeholder="Длительность в минутах" />
            <TextInput value={note} onChange={setNote} placeholder="Комментарий" multiline />
          </div>
        ) : null}

        <PrimaryButton
          onClick={() => {
            if (type === 'task' && title.trim()) {
              void addPlannerItem({ type: 'task', title: title.trim(), date: selectedDate, time: time || undefined, note: note || undefined });
            }
            if (type === 'event' && title.trim() && time) {
              void addPlannerItem({ type: 'event', title: title.trim(), date: selectedDate, time, note: note || undefined });
            }
            if (type === 'expense' && amount) {
              void addPlannerItem({ type: 'expense', title: 'Трата', date: selectedDate, amount: Number(amount), category, note: note || undefined });
            }
            if (type === 'workout' && title.trim()) {
              void addPlannerItem({ type: 'workout', title: title.trim(), date: selectedDate, duration: duration ? Number(duration) : undefined, note: note || undefined });
            }
          }}
        >
          Сохранить
        </PrimaryButton>
      </Card>
    </Screen>
  );
}
