import type { AppStateSnapshot, OnboardingAnswers, TaskItem, WeeklyReviewState } from '@/types/models';
import { generateOperationalProfile } from '@/lib/profile/deriveProfile';

export const demoAnswers: OnboardingAnswers = {
  displayName: 'Эмиль',
  goals: ['Стабилизировать планирование недели', 'Снизить перегруз по входящему', 'Держать фокус на 3 приоритетах'],
  chaosSources: ['work', 'personal_admin', 'communication'],
  planningStyle: 'week',
  dailyPriorityCapacity: 'three',
  energyPattern: 'morning',
  accountabilityStyle: 'direct',
  mainBlockers: ['too_big', 'distractions', 'too_many_obligations'],
  preferredOutputFormats: ['top_3', 'short_checklist', 'step_by_step'],
  reminderEnabled: true,
  reminderTime: '21:30',
  avoidPhrases: 'просто расслабься, всё получится',
  startHelps: 'один чёткий первый шаг и короткий дедлайн',
};

export const demoTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Собрать план дня до 11:00',
    type: 'task',
    status: 'todo',
    bucket: 'priority',
    urgency: 'high',
    nextAction: 'Выбрать 3 приоритета и один необязательный пункт',
    estimatedMinutes: 15,
  },
  {
    id: 'task-2',
    title: 'Закрыть черновик отчёта по клиенту',
    type: 'task',
    status: 'todo',
    bucket: 'priority',
    urgency: 'high',
    nextAction: 'Собрать цифры за неделю и обновить выводы',
    estimatedMinutes: 45,
  },
  {
    id: 'task-3',
    title: 'Назначить визит в сервис',
    type: 'task',
    status: 'todo',
    bucket: 'priority',
    urgency: 'medium',
    nextAction: 'Позвонить и выбрать слот на среду',
    estimatedMinutes: 10,
  },
  {
    id: 'task-4',
    title: 'Разобрать заметки из Telegram',
    type: 'thought',
    status: 'todo',
    bucket: 'secondary',
    urgency: 'medium',
    nextAction: 'Свести входящие в 5 пунктов и решить судьбу каждого',
  },
  {
    id: 'task-5',
    title: 'Идея: шаблон еженедельного ревью',
    type: 'idea',
    status: 'todo',
    bucket: 'backlog',
    urgency: 'low',
    nextAction: 'Проверить, какие блоки реально используются каждую пятницу',
  },
  {
    id: 'task-6',
    title: 'Оплатить интернет',
    type: 'task',
    status: 'done',
    bucket: 'secondary',
    urgency: 'medium',
  },
];

export const demoWeeklyReview: WeeklyReviewState = {
  weeklyPriorities: ['Клиентский отчёт', 'Стабильный утренний план', 'Финансы дома'],
  whatIsMoving: ['Отчёт почти собран', 'Утренний ритуал держится 4 дня'],
  whatIsStuck: ['Домашние счета раскиданы по чатам', 'Нет фиксированного окна на разбор входящих'],
  whatShouldBeCut: ['Лишние созвоны без решения', 'Три параллельных списка задач'],
  routines: [
    { id: 'routine-1', title: 'План на завтра', cadence: 'ежедневно 21:30', status: 'on_track' },
    { id: 'routine-2', title: 'Недельный reset', cadence: 'воскресенье 18:00', status: 'at_risk' },
  ],
};

export function createDemoState(): AppStateSnapshot {
  return {
    onboardingCompleted: false,
    onboardingAnswers: null,
    profile: null,
    tasks: demoTasks,
    weeklyReview: demoWeeklyReview,
    todayMode: 'normal',
    todayEnergy: null,
    activeTab: 'today',
  };
}

export function createCompletedDemoState(): AppStateSnapshot {
  return {
    onboardingCompleted: true,
    onboardingAnswers: demoAnswers,
    profile: generateOperationalProfile(demoAnswers, new Date('2026-03-09T08:00:00.000Z')),
    tasks: demoTasks,
    weeklyReview: demoWeeklyReview,
    todayMode: 'normal',
    todayEnergy: 'morning',
    activeTab: 'today',
  };
}
