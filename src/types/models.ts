export const SETUP_PRIORITIES = ['tasks', 'routine', 'expenses', 'workouts', 'all'] as const;
export const CHAOS_SOURCES = [
  'too_many_tasks',
  'forget_important',
  'hard_to_start',
  'procrastination',
  'keeping_in_head',
] as const;
export const TONE_OPTIONS = ['calm', 'business', 'tough'] as const;
export const REMINDER_OPTIONS = ['morning', 'day', 'evening', 'off'] as const;
export const STARTUP_MODULES = ['tasks', 'expenses', 'workouts', 'all_core'] as const;

export const PLANNER_ITEM_TYPES = ['task', 'event', 'expense', 'workout', 'note'] as const;
export const PLANNER_ITEM_STATUSES = ['planned', 'done', 'moved', 'cancelled'] as const;
export const ITEM_SOURCES = ['bot', 'miniapp'] as const;
export const CHECKIN_TYPES = ['evening_plan', 'morning_kickoff', 'midday_progress', 'evening_review'] as const;
export const CHECKIN_RESPONSES = ['done', 'move', 'later', 'help'] as const;
export const OVERLAYS = ['capture', 'focus', 'settings'] as const;

export type SetupPriority = (typeof SETUP_PRIORITIES)[number];
export type ChaosSource = (typeof CHAOS_SOURCES)[number];
export type ToneOption = (typeof TONE_OPTIONS)[number];
export type ReminderOption = (typeof REMINDER_OPTIONS)[number];
export type StartupModule = (typeof STARTUP_MODULES)[number];
export type PlannerItemType = (typeof PLANNER_ITEM_TYPES)[number];
export type PlannerItemStatus = (typeof PLANNER_ITEM_STATUSES)[number];
export type PlannerItemSource = (typeof ITEM_SOURCES)[number];
export type CheckinType = (typeof CHECKIN_TYPES)[number];
export type CheckinResponse = (typeof CHECKIN_RESPONSES)[number];
export type OverlayType = (typeof OVERLAYS)[number];

export interface SetupAnswers {
  displayName: string;
  priority: SetupPriority;
  chaosSource: ChaosSource;
  tone: ToneOption;
  reminder: ReminderOption;
  startupModule: StartupModule;
  note: string;
}

export interface ReminderSettings {
  reminder: ReminderOption;
  tone: ToneOption;
  expensesEnabled: boolean;
  workoutsEnabled: boolean;
}

export interface UserSetupProfile {
  version: '3.0.0';
  displayName: string;
  priority: SetupPriority;
  chaosSource: ChaosSource;
  tone: ToneOption;
  reminder: ReminderOption;
  startupModule: StartupModule;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlannerItem {
  id: string;
  userId: string;
  type: PlannerItemType;
  title: string;
  date: string;
  time?: string;
  duration?: number;
  amount?: number;
  category?: string;
  note?: string;
  status: PlannerItemStatus;
  source: PlannerItemSource;
  createdAt: string;
  updatedAt: string;
}

export interface DailyCheckin {
  id: string;
  userId: string;
  date: string;
  type: CheckinType;
  response?: CheckinResponse;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlannerState {
  items: PlannerItem[];
  checkins: DailyCheckin[];
  reminderSettings: ReminderSettings;
}

export interface PlannerItemInput {
  type: PlannerItemType;
  title: string;
  date: string;
  time?: string;
  duration?: number;
  amount?: number;
  category?: string;
  note?: string;
}

export interface PlannerItemUpdate {
  title?: string;
  date?: string;
  time?: string;
  duration?: number;
  amount?: number;
  category?: string;
  note?: string;
  status?: PlannerItemStatus;
}

export interface PlannerQuery {
  date?: string;
  from?: string;
  to?: string;
}

export interface PlannerSyncClient {
  fetchState(userId: string): Promise<PlannerState>;
  createItem(userId: string, item: PlannerItemInput, source: PlannerItemSource): Promise<PlannerItem>;
  updateItem(userId: string, itemId: string, patch: PlannerItemUpdate): Promise<PlannerItem>;
  recordCheckin(userId: string, input: Omit<DailyCheckin, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyCheckin>;
  updateReminderSettings(userId: string, settings: ReminderSettings): Promise<ReminderSettings>;
}

export interface AppShellState {
  setupCompleted: boolean;
  setupAnswers: SetupAnswers | null;
  profile: UserSetupProfile | null;
  selectedDate: string;
  overlay: OverlayType | null;
  focusedTaskId: string | null;
}
