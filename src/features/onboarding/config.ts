import type {
  ChaosPattern,
  OnboardingStartArea,
  PrimaryNeed,
  ReminderWindow,
  ResponseStyle,
  StartupBundle,
  ToneStyle,
} from '@/types/models';

export const startAreaOptions: Array<{ value: OnboardingStartArea; label: string }> = [
  { value: 'tasks', label: 'Дела и задачи' },
  { value: 'routine', label: 'Режим дня' },
  { value: 'expenses', label: 'Финансы и траты' },
  { value: 'workouts', label: 'Тренировки и активность' },
  { value: 'all', label: 'Всё сразу' },
  { value: 'explore', label: 'Пока просто посмотреть' },
];

export const chaosPatternOptions: Array<{ value: ChaosPattern; label: string }> = [
  { value: 'too_many_tasks', label: 'Слишком много дел' },
  { value: 'forget_important', label: 'Забываю важное' },
  { value: 'hard_to_start', label: 'Не понимаю, с чего начать' },
  { value: 'procrastination', label: 'Постоянно откладываю' },
  { value: 'keeping_in_head', label: 'Всё держу в голове' },
  { value: 'no_routine', label: 'Нет стабильного режима' },
];

export const primaryNeedOptions: Array<{ value: PrimaryNeed; label: string }> = [
  { value: 'daily_plan', label: 'План на день' },
  { value: 'reminders', label: 'Напоминания' },
  { value: 'step_breakdown', label: 'Разбор хаоса по шагам' },
  { value: 'task_control', label: 'Контроль задач' },
  { value: 'expense_tracking', label: 'Учёт трат' },
  { value: 'workout_plan', label: 'План тренировок' },
];

export const responseStyleOptions: Array<{ value: ResponseStyle; label: string }> = [
  { value: 'very_short', label: 'Очень коротко' },
  { value: 'short_list', label: 'Короткий список' },
  { value: 'step_by_step', label: 'По шагам' },
  { value: 'table', label: 'Таблицей' },
  { value: 'situational', label: 'По ситуации' },
];

export const toneStyleOptions: Array<{ value: ToneStyle; label: string }> = [
  { value: 'soft', label: 'Мягкий' },
  { value: 'calm', label: 'Спокойный' },
  { value: 'business', label: 'Деловой' },
  { value: 'tough', label: 'Жёсткий и по делу' },
];

export const reminderWindowOptions: Array<{ value: ReminderWindow; label: string }> = [
  { value: 'morning', label: 'Утром' },
  { value: 'day', label: 'Днём' },
  { value: 'evening', label: 'Вечером' },
  { value: 'before_sleep', label: 'Перед сном' },
  { value: 'on_demand', label: 'Только когда сам попрошу' },
];

export const startupBundleOptions: Array<{ value: StartupBundle; label: string }> = [
  { value: 'today_plan', label: 'План на сегодня' },
  { value: 'reminders', label: 'Напоминания' },
  { value: 'expenses', label: 'Учёт трат' },
  { value: 'workouts', label: 'Тренировки' },
  { value: 'all_core', label: 'Всё основное' },
];
