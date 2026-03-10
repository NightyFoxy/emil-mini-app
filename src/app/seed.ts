import type { AppShellState, DailyCheckin, PlannerItem, SetupAnswers } from '@/types/models';
import { buildReminderSettings, buildSetupProfile } from '@/lib/profile/deriveProfile';

export const demoSetupAnswers: SetupAnswers = {
  displayName: 'Эмиль',
  priority: 'tasks',
  chaosSource: 'too_many_tasks',
  tone: 'business',
  reminder: 'evening',
  startupModule: 'all_core',
  note: '',
};

export const demoPlannerItems: PlannerItem[] = [
  {
    id: 'task-1',
    userId: 'demo-user',
    type: 'task',
    title: 'Собрать план дня',
    date: '2026-03-10',
    time: '09:30',
    note: 'Выделить 3 главных дела',
    status: 'planned',
    source: 'bot',
    createdAt: '2026-03-09T18:00:00.000Z',
    updatedAt: '2026-03-09T18:00:00.000Z',
  },
  {
    id: 'event-1',
    userId: 'demo-user',
    type: 'event',
    title: 'Стоматолог',
    date: '2026-03-10',
    time: '14:00',
    note: '',
    status: 'planned',
    source: 'bot',
    createdAt: '2026-03-09T18:00:00.000Z',
    updatedAt: '2026-03-09T18:00:00.000Z',
  },
  {
    id: 'expense-1',
    userId: 'demo-user',
    type: 'expense',
    title: 'Продукты',
    date: '2026-03-10',
    amount: 1850,
    category: 'Еда',
    status: 'planned',
    source: 'miniapp',
    createdAt: '2026-03-09T18:00:00.000Z',
    updatedAt: '2026-03-09T18:00:00.000Z',
  },
  {
    id: 'workout-1',
    userId: 'demo-user',
    type: 'workout',
    title: 'Тренировка в зале',
    date: '2026-03-10',
    duration: 45,
    note: 'Без перегруза',
    status: 'planned',
    source: 'bot',
    createdAt: '2026-03-09T18:00:00.000Z',
    updatedAt: '2026-03-09T18:00:00.000Z',
  },
];

export const demoCheckins: DailyCheckin[] = [
  {
    id: 'checkin-1',
    userId: 'demo-user',
    date: '2026-03-10',
    type: 'morning_kickoff',
    response: 'done',
    completed: true,
    createdAt: '2026-03-10T06:00:00.000Z',
    updatedAt: '2026-03-10T06:00:00.000Z',
  },
];

export function createEmptyShellState(): AppShellState {
  return {
    setupCompleted: false,
    setupAnswers: null,
    profile: null,
    selectedDate: '2026-03-10',
    overlay: null,
    focusedTaskId: null,
  };
}

export function createDemoShellState(): AppShellState {
  return {
    setupCompleted: true,
    setupAnswers: demoSetupAnswers,
    profile: buildSetupProfile(demoSetupAnswers, new Date('2026-03-09T08:00:00.000Z')),
    selectedDate: '2026-03-10',
    overlay: null,
    focusedTaskId: 'task-1',
  };
}

export const demoReminderSettings = buildReminderSettings(demoSetupAnswers);
