import { useState } from 'react';

import { useAppStore } from '@/app/store';
import { Card, PrimaryButton, Screen, TextInput } from '@/components/ui';
import type { EntryType, ExpenseCategory, WorkoutType } from '@/types/models';

const expenseCategories: ExpenseCategory[] = ['Дом', 'Еда', 'Транспорт', 'Здоровье', 'Другое'];
const workoutTypes: WorkoutType[] = ['Силовая', 'Кардио', 'Растяжка', 'Ходьба'];

export function CaptureScreen() {
  const selectedDate = useAppStore((state) => state.selectedDate);
  const addEntry = useAppStore((state) => state.addEntry);
  const settings = useAppStore((state) => state.settings);
  const [type, setType] = useState<EntryType>('task');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Еда');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Ходьба');

  return (
    <Screen title="Добавить" subtitle={`Дата: ${selectedDate}`}>
      <Card className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            ['task', 'Задача'],
            ['expense', 'Трата'],
            ['workout', 'Тренировка'],
            ['note', 'Заметка'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value as EntryType)}
              className={`rounded-[22px] px-4 py-4 text-sm font-medium ${
                type === value ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]' : 'bg-white/5 text-[var(--tg-text-color)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {type === 'task' ? (
          <div className="space-y-3">
            <TextInput value={title} onChange={setTitle} placeholder="Название задачи" />
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="w-full rounded-[20px] border border-white/8 bg-white/5 px-4 py-3 text-sm text-[var(--tg-text-color)]"
            />
            <TextInput value={note} onChange={setNote} placeholder="Короткая заметка" multiline />
          </div>
        ) : null}

        {type === 'expense' ? (
          <div className="space-y-3">
            <TextInput value={amount} onChange={setAmount} placeholder="Сумма" />
            <div className="grid grid-cols-2 gap-3">
              {expenseCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-[20px] px-4 py-3 text-sm ${
                    category === item ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]' : 'bg-white/5 text-[var(--tg-text-color)]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <TextInput value={note} onChange={setNote} placeholder="Комментарий" multiline />
          </div>
        ) : null}

        {type === 'workout' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {workoutTypes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setWorkoutType(item)}
                  className={`rounded-[20px] px-4 py-3 text-sm ${
                    workoutType === item ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]' : 'bg-white/5 text-[var(--tg-text-color)]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <TextInput value={durationMinutes} onChange={setDurationMinutes} placeholder="Длительность в минутах" />
            <TextInput value={note} onChange={setNote} placeholder="Комментарий" multiline />
          </div>
        ) : null}

        {type === 'note' ? <TextInput value={title} onChange={setTitle} placeholder="Текст заметки" multiline /> : null}

        <PrimaryButton
          onClick={() => {
            if (type === 'task' && title.trim()) {
              void addEntry({ type: 'task', date: selectedDate, title: title.trim(), time: time || undefined, note: note || undefined, done: false });
            }
            if (type === 'expense' && amount.trim()) {
              void addEntry({
                type: 'expense',
                date: selectedDate,
                title: note.trim() || 'Трата',
                amount: Number(amount || '0'),
                category,
                note: note || undefined,
              });
            }
            if (type === 'workout') {
              void addEntry({
                type: 'workout',
                date: selectedDate,
                title: workoutType,
                durationMinutes: Number(durationMinutes || '0'),
                workoutType,
                note: note || undefined,
              });
            }
            if (type === 'note' && title.trim()) {
              void addEntry({ type: 'note', date: selectedDate, title: title.trim(), note: undefined });
            }
            setTitle('');
            setTime('');
            setNote('');
            setAmount('');
          }}
        >
          Сохранить
        </PrimaryButton>

        {!settings.modules.expenses && type === 'expense' ? <div className="text-xs text-[var(--tg-hint-color)]">Модуль трат сейчас выключен, но запись всё равно сохранится.</div> : null}
      </Card>
    </Screen>
  );
}
