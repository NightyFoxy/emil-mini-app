import type {
  AccountabilityStyle,
  Blocker,
  DailyPriorityCapacity,
  EnergyPattern,
  OnboardingAnswers,
  OperationalProfile,
  OutputFormat,
  PlanningStyle,
} from '@/types/models';
import { operationalProfileSchema } from './schemas';

const planningLabels: Record<PlanningStyle, string> = {
  day: 'планирование по дням',
  week: 'планирование по неделям',
  flexible: 'гибкое планирование',
  none: 'планирование не закреплено',
};

const capacityLabels: Record<DailyPriorityCapacity, string> = {
  one: '1 главное дело',
  three: '3 приоритета',
  five_plus: '5+ пунктов',
  depends: 'ёмкость зависит от дня',
};

const energyLabels: Record<EnergyPattern, string> = {
  morning: 'пик утром',
  daytime: 'пик днём',
  evening: 'пик вечером',
  unstable: 'энергия нестабильна',
};

const accountabilityLabels: Record<AccountabilityStyle, string> = {
  gentle: 'мягкий тон',
  neutral: 'нейтральный тон',
  direct: 'прямой тон',
  strict: 'строгий тон',
};

const formatRules: Record<OutputFormat, string> = {
  short_checklist: 'Отвечай короткими чек-листами, когда это возможно.',
  table: 'Используй таблицу только если нужно быстро сравнить варианты.',
  step_by_step: 'Если задача новая или вязкая, давай пошаговый план.',
  top_3: 'Начинай с топ-3 приоритетов, когда запрос широкий.',
  time_blocks: 'Предлагай тайм-блоки для расписания и фокус-сессий.',
};

const blockerRules: Record<Blocker, string> = {
  too_big: 'Если задача большая, режь её на следующий наблюдаемый шаг.',
  unclear: 'Если задача неясна, сначала фиксируй конкретный результат и первый физический шаг.',
  fear_of_mistakes: 'Снижая страх ошибки, предлагай черновой безопасный вариант старта.',
  fatigue: 'При усталости уменьши объём до версии на 5-10 минут.',
  distractions: 'При отвлечениях возвращай к одному текущему действию и короткому таймеру.',
  too_many_obligations: 'Если обязательств слишком много, помогай явно отсекать или переносить лишнее.',
  low_urgency: 'Если срочность низкая, связывай задачу с конкретной датой или последствием.',
  other: 'Сначала уточняй барьер, затем предлагай одно простое действие.',
};

const planningRuleMap: Record<PlanningStyle, string> = {
  day: 'Структурируй ответы вокруг сегодняшнего дня и ближайшего следующего шага.',
  week: 'Показывай связь между днём и недельными приоритетами.',
  flexible: 'Давай адаптивный план с минимальным числом обязательных пунктов.',
  none: 'Не предполагай существующую систему планирования, начинай с простого каркаса.',
};

const capacityRuleMap: Record<DailyPriorityCapacity, string> = {
  one: 'Не предлагай больше одного главного приоритета на день.',
  three: 'Держи фокус на трёх основных приоритетах.',
  five_plus: 'Можно работать со списком из нескольких пунктов, но выделяй ядро.',
  depends: 'Каждый раз уточняй дневную ёмкость перед плотным планом.',
};

export function deriveAssistantRules(answers: OnboardingAnswers): string[] {
  const rules = [
    planningRuleMap[answers.planningStyle],
    capacityRuleMap[answers.dailyPriorityCapacity],
    `Тон ответов: ${accountabilityLabels[answers.accountabilityStyle]}.`,
    `Учитывай паттерн энергии: ${energyLabels[answers.energyPattern]}.`,
  ];

  for (const blocker of answers.mainBlockers) {
    rules.push(blockerRules[blocker]);
  }

  for (const format of answers.preferredOutputFormats) {
    rules.push(formatRules[format]);
  }

  if (answers.avoidPhrases.trim()) {
    rules.push(`Избегай формулировок: ${answers.avoidPhrases.trim()}.`);
  }

  if (answers.startHelps.trim()) {
    rules.push(`Для запуска используй опоры: ${answers.startHelps.trim()}.`);
  }

  return Array.from(new Set(rules));
}

export function buildLlmProfileSummary(answers: OnboardingAnswers, assistantRules: string[]): string {
  return [
    `Профиль пользователя: ${answers.displayName}.`,
    `Цели: ${answers.goals.join('; ')}.`,
    `Контекст хаоса: ${answers.chaosSources.join(', ')}.`,
    `Стиль планирования: ${planningLabels[answers.planningStyle]}.`,
    `Дневная ёмкость: ${capacityLabels[answers.dailyPriorityCapacity]}.`,
    `Энергия: ${energyLabels[answers.energyPattern]}.`,
    `Тон контроля: ${accountabilityLabels[answers.accountabilityStyle]}.`,
    `Главные блокеры: ${answers.mainBlockers.join(', ')}.`,
    `Предпочтительный формат ответа: ${answers.preferredOutputFormats.join(', ')}.`,
    `Напоминание о завтрашнем плане: ${answers.reminderEnabled ? answers.reminderTime : 'выключено'}.`,
    `Правила для ассистента: ${assistantRules.slice(0, 4).join(' ')}`,
  ].join(' ');
}

export function generateOperationalProfile(
  answers: OnboardingAnswers,
  now = new Date(),
): OperationalProfile {
  const assistantRules = deriveAssistantRules(answers);
  const iso = now.toISOString();

  const profile: OperationalProfile = {
    profileVersion: '1.0.0',
    displayName: answers.displayName.trim(),
    goals: answers.goals.map((goal) => goal.trim()),
    chaosSources: answers.chaosSources,
    planningStyle: answers.planningStyle,
    dailyPriorityCapacity: answers.dailyPriorityCapacity,
    energyPattern: answers.energyPattern,
    accountabilityStyle: answers.accountabilityStyle,
    mainBlockers: answers.mainBlockers,
    preferredOutputFormats: answers.preferredOutputFormats,
    reminderTime: answers.reminderEnabled ? answers.reminderTime : null,
    avoidPhrases: answers.avoidPhrases.trim(),
    startHelps: answers.startHelps.trim(),
    assistantRules,
    llmProfileSummary: buildLlmProfileSummary(answers, assistantRules),
    createdAt: iso,
    updatedAt: iso,
  };

  return operationalProfileSchema.parse(profile);
}
