import type {
  DailyCheckin,
  PlannerItem,
  PlannerState,
  ReminderSettings,
} from '@/types/models';
import type { PlannerRepository } from './repository';

const STORAGE_KEY_PREFIX = 'emil-planner-state:';

function defaultReminderSettings(): ReminderSettings {
  return {
    reminder: 'off',
    tone: 'calm',
    expensesEnabled: false,
    workoutsEnabled: false,
  };
}

function emptyPlannerState(): PlannerState {
  return {
    items: [],
    checkins: [],
    reminderSettings: defaultReminderSettings(),
  };
}

function storageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function readState(userId: string): PlannerState {
  const raw = window.localStorage.getItem(storageKey(userId));
  if (!raw) {
    return emptyPlannerState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PlannerState>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      checkins: Array.isArray(parsed.checkins) ? parsed.checkins : [],
      reminderSettings: {
        ...defaultReminderSettings(),
        ...(parsed.reminderSettings ?? {}),
      },
    };
  } catch {
    return emptyPlannerState();
  }
}

function writeState(userId: string, state: PlannerState) {
  window.localStorage.setItem(storageKey(userId), JSON.stringify(state));
}

export function createLocalPlannerRepository(): PlannerRepository {
  return {
    async getState(userId) {
      return readState(userId);
    },

    async getItems(userId, query) {
      const state = readState(userId);
      return state.items.filter((item) => {
        if (query?.date) {
          return item.date === query.date;
        }
        if (query?.from && item.date < query.from) {
          return false;
        }
        if (query?.to && item.date > query.to) {
          return false;
        }
        return true;
      });
    },

    async createItem(userId, item, source) {
      const state = readState(userId);
      const now = new Date().toISOString();
      const created: PlannerItem = {
        id: crypto.randomUUID(),
        userId,
        type: item.type,
        title: item.title,
        date: item.date,
        time: item.time,
        duration: item.duration,
        amount: item.amount,
        category: item.category,
        note: item.note,
        status: 'planned',
        source,
        createdAt: now,
        updatedAt: now,
      };
      writeState(userId, { ...state, items: [created, ...state.items] });
      return created;
    },

    async updateItem(userId, itemId, patch) {
      const state = readState(userId);
      let updatedItem: PlannerItem | null = null;
      const items = state.items.map((item) => {
        if (item.id !== itemId) {
          return item;
        }
        updatedItem = { ...item, ...patch, updatedAt: new Date().toISOString() };
        return updatedItem;
      });
      writeState(userId, { ...state, items });
      return updatedItem;
    },

    async recordCheckin(userId, input) {
      const state = readState(userId);
      const now = new Date().toISOString();
      const checkin: DailyCheckin = {
        id: crypto.randomUUID(),
        userId,
        date: input.date,
        type: input.type,
        response: input.response,
        completed: input.completed,
        createdAt: now,
        updatedAt: now,
      };
      writeState(userId, { ...state, checkins: [checkin, ...state.checkins] });
      return checkin;
    },

    async updateReminderSettings(userId, settings) {
      const state = readState(userId);
      writeState(userId, {
        ...state,
        reminderSettings: settings,
      });
      return settings;
    },
  };
}
