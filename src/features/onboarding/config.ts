import type {
  AccountabilityStyle,
  Blocker,
  ChaosSource,
  DailyPriorityCapacity,
  EnergyPattern,
  OutputFormat,
  PlanningStyle,
} from '@/types/models';

export const chaosSourceOptions: Array<{ value: ChaosSource; label: string }> = [
  { value: 'work', label: 'Работа' },
  { value: 'study', label: 'Учёба' },
  { value: 'personal_admin', label: 'Личное администрирование' },
  { value: 'health', label: 'Здоровье' },
  { value: 'money', label: 'Деньги' },
  { value: 'home', label: 'Дом / быт' },
  { value: 'communication', label: 'Коммуникация' },
  { value: 'other', label: 'Другое' },
];

export const planningStyleOptions: Array<{ value: PlanningStyle; label: string }> = [
  { value: 'day', label: 'По дню' },
  { value: 'week', label: 'По неделе' },
  { value: 'flexible', label: 'Гибко' },
  { value: 'none', label: 'Пока не планирую' },
];

export const dailyCapacityOptions: Array<{ value: DailyPriorityCapacity; label: string }> = [
  { value: 'one', label: '1 главное дело' },
  { value: 'three', label: '3 приоритета' },
  { value: 'five_plus', label: '5+ пунктов' },
  { value: 'depends', label: 'Зависит от дня' },
];

export const energyPatternOptions: Array<{ value: EnergyPattern; label: string }> = [
  { value: 'morning', label: 'Утренний пик' },
  { value: 'daytime', label: 'Дневной пик' },
  { value: 'evening', label: 'Вечерний пик' },
  { value: 'unstable', label: 'Нестабильно' },
];

export const accountabilityOptions: Array<{ value: AccountabilityStyle; label: string }> = [
  { value: 'gentle', label: 'Мягко' },
  { value: 'neutral', label: 'Нейтрально' },
  { value: 'direct', label: 'Прямо' },
  { value: 'strict', label: 'Строго' },
];

export const blockerOptions: Array<{ value: Blocker; label: string }> = [
  { value: 'too_big', label: 'Задача слишком большая' },
  { value: 'unclear', label: 'Непонятно, что делать' },
  { value: 'fear_of_mistakes', label: 'Страх ошибки' },
  { value: 'fatigue', label: 'Усталость' },
  { value: 'distractions', label: 'Отвлекаюсь' },
  { value: 'too_many_obligations', label: 'Слишком много обязательств' },
  { value: 'low_urgency', label: 'Низкая срочность' },
  { value: 'other', label: 'Другое' },
];

export const outputFormatOptions: Array<{ value: OutputFormat; label: string }> = [
  { value: 'short_checklist', label: 'Короткий чек-лист' },
  { value: 'table', label: 'Таблица' },
  { value: 'step_by_step', label: 'Пошагово' },
  { value: 'top_3', label: 'Топ-3' },
  { value: 'time_blocks', label: 'Тайм-блоки' },
];
