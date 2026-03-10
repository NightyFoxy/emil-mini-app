import type { AppStateSnapshot, CalendarEntry, SetupAnswers } from '@/types/models';
import { buildProfile, buildSettingsFromAnswers } from '@/lib/profile/deriveProfile';

export const demoSetupAnswers: SetupAnswers = {
  displayName: 'Эмиль',
  priority: 'tasks',
  chaosSource: 'too_many_tasks',
  helpFormat: 'short_list',
  tone: 'business',
  reminder: 'evening',
  startupModule: 'all_core',
  note: '',
};

export const demoEntries: CalendarEntry[] = [
  {
    id: 'task-1',
    type: 'task',
    date: '2026-03-10',
    title: 'Собрать план дня',
    time: '09:30',
    note: 'Выделить 3 главных дела',
    done: false,
  },
  {
    id: 'task-2',
    type: 'task',
    date: '2026-03-10',
    title: 'Подтвердить встречу',
    done: false,
  },
  {
    id: 'expense-1',
    type: 'expense',
    date: '2026-03-10',
    title: 'Продукты',
    amount: 1850,
    category: 'Еда',
  },
  {
    id: 'workout-1',
    type: 'workout',
    date: '2026-03-11',
    title: 'Ходьба',
    durationMinutes: 30,
    workoutType: 'Ходьба',
  },
  {
    id: 'note-1',
    type: 'note',
    date: '2026-03-12',
    title: 'Позвонить по страховке',
  },
];

export function createEmptyState(): AppStateSnapshot {
  return {
    setupCompleted: false,
    setupAnswers: null,
    profile: null,
    settings: {
      reminder: 'off',
      tone: 'calm',
      modules: {
        expenses: false,
        workouts: false,
      },
    },
    entries: [],
    selectedDate: '2026-03-10',
    activeTab: 'calendar',
    focusedTaskId: null,
  };
}

export function createDemoState(): AppStateSnapshot {
  return {
    setupCompleted: true,
    setupAnswers: demoSetupAnswers,
    profile: buildProfile(demoSetupAnswers, new Date('2026-03-10T08:00:00.000Z')),
    settings: buildSettingsFromAnswers(demoSetupAnswers),
    entries: demoEntries,
    selectedDate: '2026-03-10',
    activeTab: 'calendar',
    focusedTaskId: 'task-1',
  };
}
