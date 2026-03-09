export const CHAOS_SOURCES = [
  'work',
  'study',
  'personal_admin',
  'health',
  'money',
  'home',
  'communication',
  'other',
] as const;

export const PLANNING_STYLES = [
  'day',
  'week',
  'flexible',
  'none',
] as const;

export const DAILY_PRIORITY_CAPACITIES = [
  'one',
  'three',
  'five_plus',
  'depends',
] as const;

export const ENERGY_PATTERNS = [
  'morning',
  'daytime',
  'evening',
  'unstable',
] as const;

export const ACCOUNTABILITY_STYLES = [
  'gentle',
  'neutral',
  'direct',
  'strict',
] as const;

export const BLOCKERS = [
  'too_big',
  'unclear',
  'fear_of_mistakes',
  'fatigue',
  'distractions',
  'too_many_obligations',
  'low_urgency',
  'other',
] as const;

export const OUTPUT_FORMATS = [
  'short_checklist',
  'table',
  'step_by_step',
  'top_3',
  'time_blocks',
] as const;

export const TABS = ['today', 'inbox', 'focus', 'week', 'profile'] as const;

export const TODAY_MODES = ['overloaded', 'normal', 'focused'] as const;
export const TASK_TYPES = ['task', 'thought', 'worry', 'idea', 'later'] as const;
export const TASK_STATUSES = ['todo', 'done'] as const;
export const TASK_BUCKETS = ['priority', 'secondary', 'backlog'] as const;

export type ChaosSource = (typeof CHAOS_SOURCES)[number];
export type PlanningStyle = (typeof PLANNING_STYLES)[number];
export type DailyPriorityCapacity = (typeof DAILY_PRIORITY_CAPACITIES)[number];
export type EnergyPattern = (typeof ENERGY_PATTERNS)[number];
export type AccountabilityStyle = (typeof ACCOUNTABILITY_STYLES)[number];
export type Blocker = (typeof BLOCKERS)[number];
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];
export type TabId = (typeof TABS)[number];
export type TodayMode = (typeof TODAY_MODES)[number];
export type TaskType = (typeof TASK_TYPES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskBucket = (typeof TASK_BUCKETS)[number];

export interface OnboardingAnswers {
  displayName: string;
  goals: string[];
  chaosSources: ChaosSource[];
  planningStyle: PlanningStyle;
  dailyPriorityCapacity: DailyPriorityCapacity;
  energyPattern: EnergyPattern;
  accountabilityStyle: AccountabilityStyle;
  mainBlockers: Blocker[];
  preferredOutputFormats: OutputFormat[];
  reminderEnabled: boolean;
  reminderTime: string;
  avoidPhrases: string;
  startHelps: string;
}

export interface OperationalProfile {
  profileVersion: '1.0.0';
  displayName: string;
  goals: string[];
  chaosSources: ChaosSource[];
  planningStyle: PlanningStyle;
  dailyPriorityCapacity: DailyPriorityCapacity;
  energyPattern: EnergyPattern;
  accountabilityStyle: AccountabilityStyle;
  mainBlockers: Blocker[];
  preferredOutputFormats: OutputFormat[];
  reminderTime: string | null;
  avoidPhrases: string;
  startHelps: string;
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

export interface AppStateSnapshot {
  onboardingCompleted: boolean;
  onboardingAnswers: OnboardingAnswers | null;
  profile: OperationalProfile | null;
  tasks: TaskItem[];
  weeklyReview: WeeklyReviewState;
  todayMode: TodayMode;
  todayEnergy: EnergyPattern | null;
  activeTab: TabId;
}
