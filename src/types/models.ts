export const APP_TABS = ['calendar', 'capture', 'focus', 'settings'] as const;

export const SETUP_PRIORITIES = ['tasks', 'routine', 'expenses', 'workouts', 'all'] as const;
export const CHAOS_SOURCES = [
  'too_many_tasks',
  'forget_important',
  'hard_to_start',
  'procrastination',
  'keeping_in_head',
] as const;
export const HELP_FORMATS = ['very_short', 'short_list', 'step_by_step'] as const;
export const TONE_OPTIONS = ['calm', 'business', 'tough'] as const;
export const REMINDER_OPTIONS = ['morning', 'day', 'evening', 'off'] as const;
export const STARTUP_MODULES = ['tasks', 'expenses', 'workouts', 'all_core'] as const;

export const ENTRY_TYPES = ['task', 'expense', 'workout', 'note'] as const;
export const EXPENSE_CATEGORIES = ['Дом', 'Еда', 'Транспорт', 'Здоровье', 'Другое'] as const;
export const WORKOUT_TYPES = ['Силовая', 'Кардио', 'Растяжка', 'Ходьба'] as const;

export type AppTab = (typeof APP_TABS)[number];
export type SetupPriority = (typeof SETUP_PRIORITIES)[number];
export type ChaosSource = (typeof CHAOS_SOURCES)[number];
export type HelpFormat = (typeof HELP_FORMATS)[number];
export type ToneOption = (typeof TONE_OPTIONS)[number];
export type ReminderOption = (typeof REMINDER_OPTIONS)[number];
export type StartupModule = (typeof STARTUP_MODULES)[number];
export type EntryType = (typeof ENTRY_TYPES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type WorkoutType = (typeof WORKOUT_TYPES)[number];

export interface SetupAnswers {
  displayName: string;
  priority: SetupPriority;
  chaosSource: ChaosSource;
  helpFormat: HelpFormat;
  tone: ToneOption;
  reminder: ReminderOption;
  startupModule: StartupModule;
  note: string;
}

export interface AppSettings {
  reminder: ReminderOption;
  tone: ToneOption;
  modules: {
    expenses: boolean;
    workouts: boolean;
  };
}

export interface UserProfile {
  version: '2.0.0';
  displayName: string;
  priority: SetupPriority;
  chaosSource: ChaosSource;
  helpFormat: HelpFormat;
  tone: ToneOption;
  reminder: ReminderOption;
  startupModule: StartupModule;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEntryBase {
  id: string;
  date: string;
  type: EntryType;
  note?: string;
}

export interface TaskEntry extends CalendarEntryBase {
  type: 'task';
  title: string;
  time?: string;
  done: boolean;
}

export interface ExpenseEntry extends CalendarEntryBase {
  type: 'expense';
  title: string;
  amount: number;
  category: ExpenseCategory;
}

export interface WorkoutEntry extends CalendarEntryBase {
  type: 'workout';
  title: string;
  durationMinutes: number;
  workoutType: WorkoutType;
}

export interface NoteEntry extends CalendarEntryBase {
  type: 'note';
  title: string;
}

export type CalendarEntry = TaskEntry | ExpenseEntry | WorkoutEntry | NoteEntry;

export interface AppStateSnapshot {
  setupCompleted: boolean;
  setupAnswers: SetupAnswers | null;
  profile: UserProfile | null;
  settings: AppSettings;
  entries: CalendarEntry[];
  selectedDate: string;
  activeTab: AppTab;
  focusedTaskId: string | null;
}
