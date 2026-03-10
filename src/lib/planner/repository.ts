import type {
  DailyCheckin,
  PlannerItem,
  PlannerItemInput,
  PlannerItemUpdate,
  PlannerQuery,
  PlannerState,
  ReminderSettings,
} from '@/types/models';

export interface PlannerRepository {
  getState(userId: string): Promise<PlannerState>;
  getItems(userId: string, query?: PlannerQuery): Promise<PlannerItem[]>;
  createItem(userId: string, item: PlannerItemInput, source: 'bot' | 'miniapp'): Promise<PlannerItem>;
  updateItem(userId: string, itemId: string, patch: PlannerItemUpdate): Promise<PlannerItem | null>;
  recordCheckin(
    userId: string,
    input: Omit<DailyCheckin, 'id' | 'createdAt' | 'updatedAt' | 'userId'>,
  ): Promise<DailyCheckin>;
  updateReminderSettings(userId: string, settings: ReminderSettings): Promise<ReminderSettings>;
}
