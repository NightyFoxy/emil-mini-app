import type { InboxDraftSuggestion, TaskType } from '@/types/models';

const urgencyTriggers = {
  high: ['срочно', 'сегодня', 'urgent', 'asap', 'до 18', 'дедлайн'],
  medium: ['завтра', 'на неделе', 'скоро', 'надо'],
};

const typeMap: Array<{ type: TaskType; patterns: string[] }> = [
  { type: 'worry', patterns: ['пережива', 'боюсь', 'тревог', 'волнуюсь'] },
  { type: 'idea', patterns: ['идея', 'можно', 'придумал', 'гипотеза'] },
  { type: 'thought', patterns: ['мысль', 'заметка', 'набросок'] },
  { type: 'later', patterns: ['потом', 'когда-нибудь', 'позже'] },
];

export function parseInboxCapture(input: string, selectedType: TaskType): InboxDraftSuggestion {
  const text = input.trim();
  const lower = text.toLowerCase();

  let type = selectedType;
  for (const entry of typeMap) {
    if (entry.patterns.some((pattern) => lower.includes(pattern))) {
      type = entry.type;
      break;
    }
  }

  const urgency =
    urgencyTriggers.high.some((pattern) => lower.includes(pattern))
      ? 'high'
      : urgencyTriggers.medium.some((pattern) => lower.includes(pattern))
        ? 'medium'
        : 'low';

  const title = text
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/g, '')
    .slice(0, 72) || 'Новая запись';

  const nextAction =
    type === 'task'
      ? 'Определить первый наблюдаемый шаг и срок'
      : type === 'worry'
        ? 'Отделить риск от действия и зафиксировать следующий шаг'
        : type === 'idea'
          ? 'Проверить ценность идеи и решить: в работу или в later'
          : 'Перевести запись в понятный рабочий формат';

  return { title, type, urgency, nextAction };
}
