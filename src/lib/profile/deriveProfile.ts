import type {
  ChaosPattern,
  OnboardingAnswers,
  OperationalProfile,
  PrimaryNeed,
  ReminderWindow,
  ResponseStyle,
  StartupBundle,
  TabId,
  ToneStyle,
} from '@/types/models';
import { operationalProfileSchema } from './schemas';

const startAreaLabels = {
  tasks: 'дела и задачи',
  routine: 'режим дня',
  expenses: 'финансы и траты',
  workouts: 'тренировки и активность',
  all: 'всё сразу',
  explore: 'пока осматривается',
} satisfies Record<OnboardingAnswers['startArea'], string>;

const chaosLabels: Record<ChaosPattern, string> = {
  too_many_tasks: 'слишком много дел',
  forget_important: 'забывает важное',
  hard_to_start: 'неясно, с чего начать',
  procrastination: 'часто откладывает',
  keeping_in_head: 'всё держит в голове',
  no_routine: 'нет стабильного режима',
};

const primaryNeedLabels: Record<PrimaryNeed, string> = {
  daily_plan: 'план на день',
  reminders: 'напоминания',
  step_breakdown: 'разбор хаоса по шагам',
  task_control: 'контроль задач',
  expense_tracking: 'учёт трат',
  workout_plan: 'план тренировок',
};

const responseStyleLabels: Record<ResponseStyle, string> = {
  very_short: 'очень коротко',
  short_list: 'коротким списком',
  step_by_step: 'по шагам',
  table: 'таблицей',
  situational: 'по ситуации',
};

const toneLabels: Record<ToneStyle, string> = {
  soft: 'мягко',
  calm: 'спокойно',
  business: 'деловым тоном',
  tough: 'жёстко и по делу',
};

const reminderLabels: Record<ReminderWindow, string> = {
  morning: 'утром',
  day: 'днём',
  evening: 'вечером',
  before_sleep: 'перед сном',
  on_demand: 'только по запросу',
};

const bundleLabels: Record<StartupBundle, string> = {
  today_plan: 'план на сегодня',
  reminders: 'напоминания',
  expenses: 'учёт трат',
  workouts: 'тренировки',
  all_core: 'всё основное',
};

function getFirstScreen(answers: OnboardingAnswers): TabId {
  if (answers.startArea === 'expenses' || answers.primaryNeed === 'expense_tracking' || answers.startupBundle === 'expenses') {
    return 'expenses';
  }

  if (answers.startArea === 'workouts' || answers.primaryNeed === 'workout_plan' || answers.startupBundle === 'workouts') {
    return 'workouts';
  }

  return 'today';
}

function derivePracticalTags(answers: OnboardingAnswers): string[] {
  return Array.from(
    new Set([
      `старт: ${startAreaLabels[answers.startArea]}`,
      `хаос: ${chaosLabels[answers.chaosPattern]}`,
      `главный запрос: ${primaryNeedLabels[answers.primaryNeed]}`,
      `формат: ${responseStyleLabels[answers.responseStyle]}`,
      `тон: ${toneLabels[answers.toneStyle]}`,
      `напоминания: ${reminderLabels[answers.reminderWindow]}`,
      `стартовый набор: ${bundleLabels[answers.startupBundle]}`,
    ]),
  );
}

export function deriveAssistantRules(answers: OnboardingAnswers): string[] {
  const rules = [
    `Главная зона пользы: ${primaryNeedLabels[answers.primaryNeed]}.`,
    `Подавай ответы ${responseStyleLabels[answers.responseStyle]}.`,
    `Тон общения держи ${toneLabels[answers.toneStyle]}.`,
  ];

  if (answers.chaosPattern === 'hard_to_start') {
    rules.push('Если человек застрял, сразу предлагай первый физический шаг без абстракций.');
  }
  if (answers.chaosPattern === 'too_many_tasks' || answers.chaosPattern === 'keeping_in_head') {
    rules.push('Сначала разгружай голову: группируй входящее и выделяй 1-3 ближайших действия.');
  }
  if (answers.chaosPattern === 'forget_important') {
    rules.push('Фиксируй важные пункты и предлагай напоминания без лишнего текста.');
  }
  if (answers.chaosPattern === 'procrastination') {
    rules.push('Для старта дроби задачу на короткие шаги и сокращай порог входа.');
  }
  if (answers.chaosPattern === 'no_routine') {
    rules.push('Помогай держать простой повторяемый ритм дня без перегруза.');
  }

  if (answers.dailyPlanReminderEnabled && answers.reminderWindow !== 'on_demand') {
    rules.push(`Напоминай о плане ${reminderLabels[answers.reminderWindow]}.`);
  } else {
    rules.push('Не навязывай напоминания без явного запроса.');
  }

  if (answers.specialPreferences.trim()) {
    rules.push(`Особые пожелания: ${answers.specialPreferences.trim()}.`);
  }

  return Array.from(new Set(rules));
}

export function buildLlmProfileSummary(answers: OnboardingAnswers, assistantRules: string[]): string {
  return [
    `${answers.displayName}: настройка помощника завершена.`,
    `Сначала хочет наладить ${startAreaLabels[answers.startArea]}.`,
    `Главный источник хаоса: ${chaosLabels[answers.chaosPattern]}.`,
    `Главная польза от Эмиля: ${primaryNeedLabels[answers.primaryNeed]}.`,
    `Ответы нужны ${responseStyleLabels[answers.responseStyle]}.`,
    `Предпочтительный тон: ${toneLabels[answers.toneStyle]}.`,
    `Ритм напоминаний: ${answers.dailyPlanReminderEnabled ? reminderLabels[answers.reminderWindow] : 'без ежедневного напоминания'}.`,
    `Стартовый набор: ${bundleLabels[answers.startupBundle]}.`,
    `Ключевые правила: ${assistantRules.slice(0, 4).join(' ')}`,
  ].join(' ');
}

export function generateOperationalProfile(
  answers: OnboardingAnswers,
  now = new Date(),
): OperationalProfile {
  const assistantRules = deriveAssistantRules(answers);
  const firstScreen = getFirstScreen(answers);
  const practicalTags = derivePracticalTags(answers);
  const iso = now.toISOString();

  return operationalProfileSchema.parse({
    profileVersion: '1.0.0',
    displayName: answers.displayName.trim(),
    startArea: answers.startArea,
    chaosPattern: answers.chaosPattern,
    primaryNeed: answers.primaryNeed,
    responseStyle: answers.responseStyle,
    toneStyle: answers.toneStyle,
    reminderWindow: answers.reminderWindow,
    dailyPlanReminderEnabled: answers.dailyPlanReminderEnabled,
    startupBundle: answers.startupBundle,
    specialPreferences: answers.specialPreferences.trim(),
    firstScreen,
    practicalTags,
    assistantRules,
    llmProfileSummary: buildLlmProfileSummary(answers, assistantRules),
    createdAt: iso,
    updatedAt: iso,
  });
}
