import { create } from 'zustand';

import { buildProfile, buildSettingsFromAnswers } from '@/lib/profile/deriveProfile';
import { createStorageAdapter } from '@/lib/storage';
import type {
  AppSettings,
  AppStateSnapshot,
  AppTab,
  CalendarEntry,
  ExpenseCategory,
  ReminderOption,
  SetupAnswers,
  ExpenseEntry,
  NoteEntry,
  TaskEntry,
  ToneOption,
  WorkoutEntry,
  WorkoutType,
} from '@/types/models';
import { createDemoState, createEmptyState } from './seed';

const storage = createStorageAdapter();

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function migrateLegacySnapshot(snapshot: Record<string, unknown>): AppStateSnapshot {
  const base = createEmptyState();
  const legacyEntries: CalendarEntry[] = [];

  const tasks = Array.isArray(snapshot.tasks) ? snapshot.tasks : [];
  for (const task of tasks) {
    if (typeof task === 'object' && task && 'title' in task) {
      const item = task as Record<string, unknown>;
      legacyEntries.push({
        id: String(item.id ?? crypto.randomUUID()),
        type: 'task',
        title: String(item.title ?? 'Задача'),
        date: typeof item.dueDate === 'string' && item.dueDate ? item.dueDate.slice(0, 10) : todayString(),
        note: typeof item.nextAction === 'string' ? item.nextAction : undefined,
        time: undefined,
        done: item.status === 'done',
      });
    }
  }

  const expenses = Array.isArray(snapshot.expenses) ? snapshot.expenses : [];
  for (const expense of expenses) {
    if (typeof expense === 'object' && expense) {
      const item = expense as Record<string, unknown>;
      legacyEntries.push({
        id: String(item.id ?? crypto.randomUUID()),
        type: 'expense',
        title: String(item.title ?? 'Трата'),
        amount: Number(item.amount ?? 0),
        category: (item.category as ExpenseCategory) ?? 'Другое',
        date: typeof item.createdAt === 'string' ? item.createdAt.slice(0, 10) : todayString(),
        note: undefined,
      });
    }
  }

  const workouts = Array.isArray(snapshot.workouts) ? snapshot.workouts : [];
  for (const workout of workouts) {
    if (typeof workout === 'object' && workout) {
      const item = workout as Record<string, unknown>;
      legacyEntries.push({
        id: String(item.id ?? crypto.randomUUID()),
        type: 'workout',
        title: String(item.title ?? 'Тренировка'),
        durationMinutes: Number(item.durationMinutes ?? 20),
        workoutType: (item.focus as WorkoutType) ?? 'Ходьба',
        date: todayString(),
        note: undefined,
      });
    }
  }

  return {
    ...base,
    setupCompleted: false,
    entries: legacyEntries,
    selectedDate: todayString(),
  };
}

export function normalizeSnapshot(snapshot: unknown): AppStateSnapshot | null {
  if (!snapshot || typeof snapshot !== 'object') {
    return null;
  }

  const raw = snapshot as Record<string, unknown>;
  if ('setupCompleted' in raw && Array.isArray(raw.entries)) {
    const base = createEmptyState();
    return {
      ...base,
      ...raw,
      settings: {
        ...base.settings,
        ...(raw.settings as AppSettings | undefined),
        modules: {
          ...base.settings.modules,
          ...((raw.settings as AppSettings | undefined)?.modules ?? {}),
        },
      },
      entries: raw.entries as CalendarEntry[],
      selectedDate: typeof raw.selectedDate === 'string' ? raw.selectedDate : todayString(),
      activeTab: (raw.activeTab as AppTab) ?? 'calendar',
      focusedTaskId: (raw.focusedTaskId as string | null) ?? null,
    };
  }

  if ('tasks' in raw || 'expenses' in raw || 'workouts' in raw) {
    return migrateLegacySnapshot(raw);
  }

  return null;
}

async function persistState(state: AppStore) {
  const snapshot: AppStateSnapshot = {
    setupCompleted: state.setupCompleted,
    setupAnswers: state.setupAnswers,
    profile: state.profile,
    settings: state.settings,
    entries: state.entries,
    selectedDate: state.selectedDate,
    activeTab: state.activeTab,
    focusedTaskId: state.focusedTaskId,
  };

  try {
    await storage.save(snapshot);
  } catch (error) {
    console.error('Failed to persist app state', error);
  }
}

interface AppStore extends AppStateSnapshot {
  initialized: boolean;
  loadState: () => Promise<void>;
  completeSetup: (answers: SetupAnswers) => Promise<void>;
  setActiveTab: (tab: AppTab) => void;
  setSelectedDate: (date: string) => void;
  setFocusedTaskId: (taskId: string | null) => void;
  addEntry: (input: Omit<TaskEntry, 'id'> | Omit<ExpenseEntry, 'id'> | Omit<WorkoutEntry, 'id'> | Omit<NoteEntry, 'id'>) => Promise<void>;
  toggleTaskDone: (taskId: string) => Promise<void>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  rerunSetup: () => Promise<void>;
  resetAllData: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  ...createEmptyState(),
  initialized: false,

  async loadState() {
    let loaded: AppStateSnapshot | null = null;
    try {
      loaded = normalizeSnapshot(await storage.load());
    } catch (error) {
      console.error('Failed to load app state', error);
    }

    set({
      ...(loaded ?? (import.meta.env.DEV ? createDemoState() : createEmptyState())),
      initialized: true,
    });
  },

  async completeSetup(answers) {
    const profile = buildProfile(answers);
    set({
      setupCompleted: true,
      setupAnswers: answers,
      profile,
      settings: buildSettingsFromAnswers(answers),
      activeTab: 'calendar',
    });
    await persistState(get());
  },

  setActiveTab(tab) {
    set({ activeTab: tab });
    void persistState(get());
  },

  setSelectedDate(date) {
    set({ selectedDate: date });
    void persistState(get());
  },

  setFocusedTaskId(taskId) {
    set({ focusedTaskId: taskId });
    void persistState(get());
  },

  async addEntry(input) {
    const entry: CalendarEntry = {
      ...input,
      id: crypto.randomUUID(),
    } as CalendarEntry;
    set((state) => ({
      entries: [entry, ...state.entries],
      focusedTaskId: entry.type === 'task' ? entry.id : state.focusedTaskId,
      activeTab: 'calendar',
      selectedDate: entry.date,
    }));
    await persistState(get());
  },

  async toggleTaskDone(taskId) {
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.type === 'task' && entry.id === taskId ? { ...entry, done: !entry.done } : entry,
      ),
    }));
    await persistState(get());
  },

  async updateSettings(patch) {
    set((state) => ({
      settings: {
        ...state.settings,
        ...patch,
        modules: {
          ...state.settings.modules,
          ...(patch.modules ?? {}),
        },
      },
      profile: state.profile
        ? {
            ...state.profile,
            reminder: (patch.reminder as ReminderOption | undefined) ?? state.profile.reminder,
            tone: (patch.tone as ToneOption | undefined) ?? state.profile.tone,
            updatedAt: new Date().toISOString(),
          }
        : state.profile,
    }));
    await persistState(get());
  },

  async rerunSetup() {
    set({
      setupCompleted: false,
      activeTab: 'calendar',
    });
    await persistState(get());
  },

  async resetAllData() {
    set({
      ...createEmptyState(),
      initialized: true,
    });
    await persistState(get());
  },
}));
