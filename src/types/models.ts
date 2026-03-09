export const ONBOARDING_START_AREAS = [
  'tasks',
  'routine',
  'expenses',
  'workouts',
  'all',
  'explore',
] as const;

export const CHAOS_PATTERNS = [
  'too_many_tasks',
  'forget_important',
  'hard_to_start',
  'procrastination',
  'keeping_in_head',
  'no_routine',
] as const;

export const PRIMARY_NEEDS = [
  'daily_plan',
  'reminders',
  'step_breakdown',
  'task_control',
  'expense_tracking',
  'workout_plan',
] as const;

export const RESPONSE_STYLES = [
  'very_short',
  'short_list',
  'step_by_step',
  'table',
  'situational',
] as const;

export const TONE_STYLES = [
  'soft',
  'calm',
  'business',
  'tough',
] as const;

export const REMINDER_WINDOWS = [
  'morning',
  'day',
  'evening',
  'before_sleep',
  'on_demand',
] as const;

export const STARTUP_BUNDLES = [
  'today_plan',
  'reminders',
  'expenses',
  'workouts',
  'all_core',
] as const;

export const TABS = ['today', 'inbox', 'focus', 'week', 'profile', 'expenses', 'workouts'] as const;

export const TODAY_MODES = ['overloaded', 'normal', 'focused'] as const;
export const TASK_TYPES = ['task', 'thought', 'worry', 'idea', 'later'] as const;
export const TASK_STATUSES = ['todo', 'done'] as const;
export const TASK_BUCKETS = ['priority', 'secondary', 'backlog'] as const;

export type OnboardingStartArea = (typeof ONBOARDING_START_AREAS)[number];
export type ChaosPattern = (typeof CHAOS_PATTERNS)[number];
export type PrimaryNeed = (typeof PRIMARY_NEEDS)[number];
export type ResponseStyle = (typeof RESPONSE_STYLES)[number];
export type ToneStyle = (typeof TONE_STYLES)[number];
export type ReminderWindow = (typeof REMINDER_WINDOWS)[number];
export type StartupBundle = (typeof STARTUP_BUNDLES)[number];
export type TabId = (typeof TABS)[number];
export type TodayMode = (typeof TODAY_MODES)[number];
export type TaskType = (typeof TASK_TYPES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskBucket = (typeof TASK_BUCKETS)[number];

export interface OnboardingAnswers {
  displayName: string;
  startArea: OnboardingStartArea;
  chaosPattern: ChaosPattern;
  primaryNeed: PrimaryNeed;
  responseStyle: ResponseStyle;
  toneStyle: ToneStyle;
  reminderWindow: ReminderWindow;
  dailyPlanReminderEnabled: boolean;
  startupBundle: StartupBundle;
  specialPreferences: string;
}

export interface OperationalProfile {
  profileVersion: '1.0.0';
  displayName: string;
  startArea: OnboardingStartArea;
  chaosPattern: ChaosPattern;
  primaryNeed: PrimaryNeed;
  responseStyle: ResponseStyle;
  toneStyle: ToneStyle;
  reminderWindow: ReminderWindow;
  dailyPlanReminderEnabled: boolean;
  startupBundle: StartupBundle;
  specialPreferences: string;
  firstScreen: TabId;
  practicalTags: string[];
  assistantRules: string[];
  llmProfileSummary: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  bucket: TaskBucket;
  notes?: string;
  urgency: 'low' | 'medium' | 'high';
  nextAction?: string;
  estimatedMinutes?: number;
  dueDate?: string;
}

export interface InboxDraftSuggestion {
  title: string;
  type: TaskType;
  urgency: 'low' | 'medium' | 'high';
  nextAction: string;
}

export interface WeeklyRoutine {
  id: string;
  title: string;
  cadence: string;
  status: 'on_track' | 'at_risk';
}

export interface WeeklyReviewState {
  weeklyPriorities: string[];
  whatIsMoving: string[];
  whatIsStuck: string[];
  whatShouldBeCut: string[];
  routines: WeeklyRoutine[];
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'home' | 'food' | 'transport' | 'health' | 'other';
  createdAt: string;
}

export interface WorkoutItem {
  id: string;
  title: string;
  status: 'planned' | 'done';
  durationMinutes: number;
  focus: 'strength' | 'cardio' | 'mobility' | 'walk';
}

export interface AppStateSnapshot {
  onboardingCompleted: boolean;
  onboardingAnswers: OnboardingAnswers | null;
  profile: OperationalProfile | null;
  tasks: TaskItem[];
  weeklyReview: WeeklyReviewState;
  expenses: ExpenseItem[];
  workouts: WorkoutItem[];
  todayMode: TodayMode;
  todayEnergy: ReminderWindow | null;
  activeTab: TabId;
}
