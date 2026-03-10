import type { ChaosSource, ReminderOption, SetupPriority, StartupModule, ToneOption } from '@/types/models';

export const priorityOptions: Array<{ value: SetupPriority; label: string }> = [
  { value: 'tasks', label: 'Дела' },
  { value: 'routine', label: 'Режим' },
  { value: 'expenses', label: 'Траты' },
  { value: 'workouts', label: 'Тренировки' },
  { value: 'all', label: 'Всё сразу' },
];

export const chaosOptions: Array<{ value: ChaosSource; label: string }> = [
  { value: 'too_many_tasks', label: 'Слишком много дел' },
  { value: 'forget_important', label: 'Забываю важное' },
  { value: 'hard_to_start', label: 'Не понимаю, с чего начать' },
  { value: 'procrastination', label: 'Постоянно откладываю' },
  { value: 'keeping_in_head', label: 'Всё держу в голове' },
];

export const toneOptions: Array<{ value: ToneOption; label: string }> = [
  { value: 'calm', label: 'Спокойный' },
  { value: 'business', label: 'Деловой' },
  { value: 'tough', label: 'Жёсткий и по делу' },
];

export const reminderOptions: Array<{ value: ReminderOption; label: string }> = [
  { value: 'morning', label: 'Утром' },
  { value: 'day', label: 'Днём' },
  { value: 'evening', label: 'Вечером' },
  { value: 'off', label: 'Не надо напоминаний' },
];

export const startupModuleOptions: Array<{ value: StartupModule; label: string }> = [
  { value: 'tasks', label: 'Задачи' },
  { value: 'expenses', label: 'Траты' },
  { value: 'workouts', label: 'Тренировки' },
  { value: 'all_core', label: 'Всё основное' },
];
