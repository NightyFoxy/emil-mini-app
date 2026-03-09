import { useMemo, useState } from 'react';

import { Card, Chip, PrimaryButton, Screen, SectionTitle, TextInput } from '@/components/ui';
import { useAppStore } from '@/app/store';
import { parseInboxCapture } from './parser';
import type { TaskType } from '@/types/models';

const quickTypes: Array<{ value: TaskType; label: string }> = [
  { value: 'task', label: 'Задача' },
  { value: 'thought', label: 'Мысль' },
  { value: 'worry', label: 'Риск' },
  { value: 'idea', label: 'Идея' },
  { value: 'later', label: 'Потом' },
];

export function InboxScreen() {
  const addTask = useAppStore((state) => state.addTask);
  const tasks = useAppStore((state) => state.tasks);
  const [text, setText] = useState('');
  const [selectedType, setSelectedType] = useState<TaskType>('task');

  const suggestion = useMemo(() => parseInboxCapture(text, selectedType), [selectedType, text]);

  return (
    <Screen title="Inbox" subtitle="Сбросить входящий шум и быстро структурировать">
      <Card className="space-y-4">
        <SectionTitle title="Быстрый захват" />
        <TextInput
          value={text}
          onChange={setText}
          placeholder="Например: срочно добить таблицу, не понимаю с чего начать"
          multiline
        />
        <div className="flex flex-wrap gap-2">
          {quickTypes.map((chip) => (
            <Chip key={chip.value} selected={selectedType === chip.value} onClick={() => setSelectedType(chip.value)}>
              {chip.label}
            </Chip>
          ))}
        </div>
        <Card className="space-y-2 rounded-[20px] bg-black/10">
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--tg-hint-color)]">Предпросмотр</div>
          <div className="text-sm text-[var(--tg-text-color)]">{suggestion.title}</div>
          <div className="text-xs text-[var(--tg-hint-color)]">Тип: {suggestion.type}</div>
          <div className="text-xs text-[var(--tg-hint-color)]">Срочность: {suggestion.urgency}</div>
          <div className="text-xs text-[var(--tg-hint-color)]">Следующий шаг: {suggestion.nextAction}</div>
        </Card>
        <PrimaryButton
          onClick={() => {
            if (!text.trim()) {
              return;
            }
            void addTask({
              title: suggestion.title,
              type: suggestion.type,
              urgency: suggestion.urgency,
              nextAction: suggestion.nextAction,
              bucket: suggestion.urgency === 'high' ? 'priority' : 'backlog',
            });
            setText('');
            setSelectedType('task');
          }}
        >
          Преобразовать во входящий элемент
        </PrimaryButton>
      </Card>

      <div className="space-y-3">
        <SectionTitle title="Последние входящие" />
        {tasks.slice(0, 5).map((task) => (
          <Card key={task.id}>
            <div className="text-sm text-[var(--tg-text-color)]">{task.title}</div>
            <div className="mt-1 text-xs text-[var(--tg-hint-color)]">
              {task.type} • {task.urgency} • {task.bucket}
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
